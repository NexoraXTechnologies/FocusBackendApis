const axios = require('axios');
const { ApiError, errorCodes } = require('../../utils/ResponseHandlers');
const notificationLogSchema = require('../../models/notificationLogModel');

const ONESIGNAL_URL = process.env.ONESIGNAL_URL;

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`
};

/* ===============================
   SEND TO ALL USERS
================================ */
const sendToAllUsers = async ({ title, message, data = {} }) => {
  console.log(`[OneSignal] Sending to ALL. AppID: ${process.env.ONESIGNAL_APP_ID}`);
  const payload = {
    app_id: process.env.ONESIGNAL_APP_ID,
    included_segments: ['All'],
    headings: { en: title },
    contents: { en: message },
    data
  };

  const response = await axios.post(ONESIGNAL_URL, payload, { headers });

  // ✅ STORE IN DB
  const notificationLog = await notificationLogSchema.create({
    title,
    message,
    targetType: 'ALL',
    oneSignalNotificationId: response.data?.id || null,
    delivered: true,
    errors: response.data?.errors || [],
    data
  });

  return notificationLog;
};

/* ===============================
   SEND TO PARTICULAR USER
================================ */
const sendToUser = async ({ externalUserId, title, message, data = {} }) => {
  console.log(`[OneSignal] Sending to User: ${externalUserId}. AppID: ${process.env.ONESIGNAL_APP_ID}`);
  if (!externalUserId) {
    throw new ApiError(
      400,
      'External User ID is required',
      errorCodes.INVALID_PAYLOAD
    );
  }

  const payload = {
    app_id: process.env.ONESIGNAL_APP_ID,
    include_external_user_ids: [externalUserId],
    headings: { en: title },
    contents: { en: message },
    data
  };

  const response = await axios.post(ONESIGNAL_URL, payload, { headers });

  // ✅ STORE IN DB (NO RESPONSE CHANGE)
  const notificationLog = await notificationLogSchema.create({
    title,
    message,
    targetType: 'USER',
    externalUserId,
    oneSignalNotificationId: response.data?.id || null,
    delivered: !(
      response.data?.errors &&
      response.data.errors.includes('All included players are not subscribed')
    ),
    errors: response.data?.errors || [],
    data
  });

  return notificationLog;
};

/* ===============================
   GET ALL NOTIFICATIONS
================================ */
const getNotifications = async () => {
  return await notificationLogSchema.find().sort({ createdAt: -1 });
};

module.exports = {
  sendToAllUsers,
  sendToUser,
  getNotifications
};