const { runPDA } = require('../PDA-engine/pdaEngine.js');
const { tokenize } = require('../Utils/tokenizer.js');

exports.validatePayload = (req, res) => {
  try {
    const rawJson = req.decryptedData || req.body;
    const tokens = tokenize(rawJson);
    const result = runPDA(tokens);

    res.json(result);
  } catch (err) {
    res.status(200).json({ 
      valid: false,
      transitions: [],
      error: err.message || 'Invalid JSON payload'
    });
  }
};
