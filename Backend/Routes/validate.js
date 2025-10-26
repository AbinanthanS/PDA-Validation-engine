const express = require('express');
const router = express.Router();
const decrypt = require('../middleware/decrypt');
const { validatePayload } = require('../controllers/validationController');

router.post('/', decrypt, validatePayload);

module.exports = router;
