const express = require('express');
const router = express.Router();
const controller = require('../controller/notification/oneSignalController');

router.post('/send/all', controller.sendNotificationToAll);
router.post('/send/user', controller.sendNotificationToUser);

module.exports = router;