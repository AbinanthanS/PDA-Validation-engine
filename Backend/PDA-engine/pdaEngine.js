exports.runPDA = function (tokens) {
  const stack = [];
  const transitions = [];

  for (let token of tokens) {
    let action = '';

    if (token === '{' || token === '[') {
      stack.push(token);
      action = `PUSH ${token}`;
    } else if (token === '}' || token === ']') {
      const top = stack.pop();
      if (!top || (top === '{' && token !== '}') || (top === '[' && token !== ']')) {
        return { valid: false, transitions, message: `Mismatched ${token}` };
      }
      action = `POP ${token}`;
    } else {
      action = `READ ${token}`;
    }

    transitions.push({ token, stack: [...stack], action });
  }

  const valid = stack.length === 0;
  return { valid, transitions };
};
