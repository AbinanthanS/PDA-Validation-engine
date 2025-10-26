exports.tokenize = function (jsonObj) {
  const jsonStr = typeof jsonObj === "string" ? jsonObj : JSON.stringify(jsonObj);

  const tokens = [];
  let i = 0;

  while (i < jsonStr.length) {
    const char = jsonStr[i];

    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Single-char tokens
    if ("{}[]:,".includes(char)) {
      tokens.push(char);
      i++;
      continue;
    }

    // String tokens
    if (char === '"') {
      let str = '"';
      i++;
      while (i < jsonStr.length) {
        const c = jsonStr[i];
        str += c;
        i++;
        if (c === '"' && str[str.length - 2] !== "\\") break; // handle escaped quotes
      }
      tokens.push(str);
      continue;
    }

    // Numbers, true, false, null
    let value = "";
    while (i < jsonStr.length && /[^\s{}\[\]:,",]/.test(jsonStr[i])) {
      value += jsonStr[i];
      i++;
    }
    if (value) tokens.push(value);
  }

  return tokens;
};
