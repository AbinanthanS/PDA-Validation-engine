exports.runPDA = function (tokens) {
  const stack = [];
  const transitions = [];

  let state = "q_start";
  let valid = true;
  let error = "";

  const recordTransition = (token, prevState, nextState, stackBefore, action, error = null) => {
    transitions.push({
      token,
      prevState,
      nextState,
      stackBefore,
      stackAfter: [...stack],
      action,
      error,
    });
  };

  const isPrimitive = (t) =>
    /^".*"$/.test(t) || /^-?\d+(\.\d+)?$/.test(t) || ["true", "false", "null"].includes(t);

  const top = () => stack[stack.length - 1];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const prevState = state;
    const stackBefore = [...stack];
    let action = "";

    switch (state) {
      // ===== START =====
      case "q_start":
        if (token === "{") {
          stack.push("{");
          state = "q_key";
          action = "PUSH { → enter object";
        } else if (token === "[") {
          stack.push("[");
          state = "q_value";
          action = "PUSH [ → enter array";
        } else {
          valid = false;
          error = `Expected { or [ at start, got ${token}`;
          state = "q_error";
          action = `ERROR: ${error}`;
        }
        break;

      // ===== OBJECT STATES =====
      case "q_key": // expecting key or }
        if (token === "}") {
          if (top() !== "{") {
            valid = false;
            error = `Mismatched }`;
            state = "q_error";
            action = `ERROR: ${error}`;
          } else {
            stack.pop();
            action = "POP } → exit object";
            state = stack.length
              ? (top() === "[" ? "q_next_arr" : "q_next_obj")
              : "q_accept";
          }
        } else if (/^".*"$/.test(token)) {
          state = "q_colon";
          action = `READ key ${token}`;
        } else {
          valid = false;
          error = `Expected key or }, got ${token}`;
          state = "q_error";
          action = `ERROR: ${error}`;
        }
        break;

      case "q_colon":
        if (token === ":") {
          state = "q_value";
          action = "READ :";
        } else {
          valid = false;
          error = `Expected :, got ${token}`;
          state = "q_error";
          action = `ERROR: ${error}`;
        }
        break;

      case "q_value":
        if (token === "{") {
          stack.push("{");
          state = "q_key";
          action = "PUSH { → enter nested object";
        } else if (token === "[") {
          stack.push("[");
          state = "q_value";
          action = "PUSH [ → enter nested array";
        } else if (isPrimitive(token)) {
          state = top() === "{" ? "q_next_obj" : "q_next_arr";
          action = `READ value ${token}`;
        } else {
          valid = false;
          error = `Invalid value: ${token}`;
          state = "q_error";
          action = `ERROR: ${error}`;
        }
        break;

      // ===== AFTER VALUE STATES =====
      case "q_next_obj":
        if (token === ",") {
          state = "q_key";
          action = "READ , → next key";
        } else if (token === "}") {
          if (top() !== "{") {
            valid = false;
            error = `Mismatched }`;
            state = "q_error";
            action = `ERROR: ${error}`;
          } else {
            stack.pop();
            action = "POP } → exit object";
            state = stack.length
              ? (top() === "[" ? "q_next_arr" : "q_next_obj")
              : "q_accept";
          }
        } else {
          valid = false;
          error = `Expected , or }, got ${token}`;
          state = "q_error";
          action = `ERROR: ${error}`;
        }
        break;

      case "q_next_arr":
        if (token === ",") {
          state = "q_value";
          action = "READ , → next array value";
        } else if (token === "]") {
          if (top() !== "[") {
            valid = false;
            error = `Mismatched ]`;
            state = "q_error";
            action = `ERROR: ${error}`;
          } else {
            stack.pop();
            action = "POP ] → exit array";
            state = stack.length
              ? (top() === "[" ? "q_next_arr" : "q_next_obj")
              : "q_accept";
          }
        } else {
          valid = false;
          error = `Expected , or ], got ${token}`;
          state = "q_error";
          action = `ERROR: ${error}`;
        }
        break;
    }

    recordTransition(token, prevState, state, stackBefore, action, valid ? null : error);
    if (state === "q_error") break;
  }

  // ===== Final validation =====
  if (stack.length > 0 && state !== "q_error") {
    valid = false;
    error = "Unclosed braces/brackets detected at end of input";
  }

  // ===== Return result =====
  return {
    valid: valid && state === "q_accept",
    transitions,
    error: valid ? null : error,
  };
};
