exports.tokenize = function (jsonObj) {
  const jsonStr = JSON.stringify(jsonObj);
  const tokens = jsonStr.match(/[{}\[\]:,]|[a-zA-Z0-9_"]+/g);
  return tokens;
};
