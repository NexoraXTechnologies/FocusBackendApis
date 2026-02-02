const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true
    },

    message: {
      type: String,
      trim: true
    },

    targetType: {
      type: String,
      enum: ['ALL', 'USER'],
      required: true
    },

    externalUserId: {
      type: String,
      default: null
    },

    oneSignalNotificationId: {
      type: String,
      default: null
    },

    delivered: {
      type: Boolean,
      default: false
    },

    errors: {
      type: [String],
      default: []
    },

    data: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('NotificationLog', notificationLogSchema);