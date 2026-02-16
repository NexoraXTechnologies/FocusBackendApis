const express = require('express');
const router = express.Router();
const controller = require('../controller/autoPost/autoPostController');

router.post('/sync', controller.syncAutoPostProducts);

module.exports = router;