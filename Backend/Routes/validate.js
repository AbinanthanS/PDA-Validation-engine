const express = require('express');
const router = express.Router();

const decryptMiddleware = require('../middleware/decrypt');
const validationController = require('../controllers/validationController');



router.post('/', decryptMiddleware, validationController.validate);

module.exports = router;