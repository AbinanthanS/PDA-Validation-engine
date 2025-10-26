const { runPDA } = require('../PDA-engine/pdaEngine');
const { tokenize } = require('../Utils/tokenizer');

exports.validatePayload = (req, res) => {
  try {
    const payload = req.decryptedPayload;
    const tokens = tokenize(payload);
    const result = runPDA(tokens);

    res.json(result);
  } catch (err) {
    res.status(500).json({ result });
  }
};
