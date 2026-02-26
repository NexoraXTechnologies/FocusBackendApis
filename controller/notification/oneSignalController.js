const { asyncHandler } = require('../../utils/ResponseHandlers');
const oneSignalService = require('../../services/notification/oneSignalService');
const { ApiResponse } = require('../../utils/ResponseHandlers');

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


  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Notification sent to all users',
    data: result
  }).send(res);
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

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Notification sent to user',
    data: result
  }).send(res);
});

/* ===============================
   GET ALL NOTIFICATIONS
================================ */
const getNotificationsController = asyncHandler(async (req, res) => {
  const result = await oneSignalService.getNotifications();

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Notification list fetched successfully',
    data: result
  }).send(res);
});

module.exports = {
  sendNotificationToAll,
  sendNotificationToUser,
  getNotificationsController
};