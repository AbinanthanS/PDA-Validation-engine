const express = require('express');
const router = express.Router();
const decrypt = require('../middleware/decrypt.js');
const { validatePayload } = require('../Controllers/validationController.js');

router.post('/', decrypt, validatePayload);

module.exports = router;
