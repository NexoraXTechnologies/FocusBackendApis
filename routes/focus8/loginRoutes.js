const express = require('express');
const router = express.Router();

const { loginToFocus8Controller } = require('../../controller/focus8/focus8AuthController');

// Login to Focus8
router.post('/login', loginToFocus8Controller);

module.exports = router;
