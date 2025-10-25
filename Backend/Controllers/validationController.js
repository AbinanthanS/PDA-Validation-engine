/*
exports.validate = (req, res) => {
  const payload = req.decryptedPayload;

  if (!payload) {
    return res.status(400).json({ ok: false, reason: 'No payload provided' });
  }

  const type = typeof payload;
  if (type !== 'object' && type !== 'string') {
    return res.status(400).json({ ok: false, reason: 'Payload must be JSON object or JSON string' });
  }

  return res.status(200).json({
    ok: true,
    message: 'Payload received by validation controller',
    meta: req._meta,
    sample: (type === 'object') ? Object.keys(payload).slice(0, 10) : undefined
  });
};
*/
const { runPDA } = require('../PDA-engine/pdaEngine');
const { tokenize } = require('../Utils/tokenizer');

exports.validatePayload = (req, res) => {
  try {
    const payload = req.decryptedPayload;
    const tokens = tokenize(payload);
    const result = runPDA(tokens);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
