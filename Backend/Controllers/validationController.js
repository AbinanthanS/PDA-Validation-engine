const { json } = require('express');
const { runPDA } = require('../PDA-engine/pdaEngine');
const { tokenize } = require('../Utils/tokenizer');

exports.validatePayload = (req, res) => {
  try {
    const rawJson = req.body;
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
