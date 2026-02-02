const axios = require('axios');
const { ApiError, errorCodes } = require('../../utils/ResponseHandlers');
const notificationLogSchema = require('../../models/notificationLogModel'); 

const ONESIGNAL_URL = 'https://onesignal.com/api/v1/notifications';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`
};

/* ===============================
   SEND TO ALL USERS
================================ */
const sendToAllUsers = async ({ title, message, data = {} }) => {
  const payload = {
    app_id: process.env.ONESIGNAL_APP_ID,
    included_segments: ['All'],
    headings: { en: title },
    contents: { en: message },
    data
  };

  const response = await axios.post(ONESIGNAL_URL, payload, { headers });

  // ✅ STORE IN DB
  await notificationLogSchema.create({
    title,
    message,
    targetType: 'ALL',
    oneSignalNotificationId: response.data?.id || null,
    delivered: true,
    errors: response.data?.errors || [],
    data
  });

  return response.data;
};

/* ===============================
   SEND TO PARTICULAR USER
================================ */
const sendToUser = async ({ externalUserId, title, message, data = {} }) => {
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
  await notificationLogSchema.create({
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

  return response.data;
};

module.exports = {
  sendToAllUsers,
  sendToUser
};