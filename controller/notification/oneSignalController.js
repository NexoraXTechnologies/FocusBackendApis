const { asyncHandler} = require('../../utils/ResponseHandlers');
const oneSignalService = require('../../services/notification/oneSignalService');
const {ApiResponse} = require('../../utils/ResponseHandlers');

/* ===============================
   SEND TO ALL
================================ */
const sendNotificationToAll = asyncHandler(async (req, res) => {
  const { title, message, data } = req.body;

  const result = await oneSignalService.sendToAllUsers({
    title,
    message,
    data
  });
  

  res.status(200).json(new ApiResponse(200, {
    success: true,
    message: 'Notification sent to all users',
    result
  }));
});

/* ===============================
   SEND TO USER
================================ */
const sendNotificationToUser = asyncHandler(async (req, res) => {
  const { externalUserId, title, message, data } = req.body;

  const result = await oneSignalService.sendToUser({
    externalUserId,
    title,
    message,
    data
  });

  res.status(200).json(new ApiResponse(200, {
    success: true,
    message: 'Notification sent to user',
    result
  }));
});

module.exports = {
  sendNotificationToAll,
  sendNotificationToUser
};