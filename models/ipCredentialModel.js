const mongoose = require('mongoose');

const ipCredentialSchema = new mongoose.Schema(
  {
    ipAddress: {
      type: String,
      required: true,
      trim: true
    },

    domain: {
      type: String,
      required: true,
      trim: true
    },

    isActive: {
      type: Boolean,
      default: false
    },

    isDeleted: {
      type: Boolean,
      default: false
    },

    deletedOn: {
      type: Date,
      default: null
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model('IpCredential', ipCredentialSchema);
