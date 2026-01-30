const mongoose = require('mongoose');

const ledgerReportSchema = new mongoose.Schema(
  {
    ledgerReportGeneratedDateTime: {
      type: Date,
      required: true
    },

    ledgerReportGeneratedBy: {
      type: String,
      required: true,
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isDeleted: {
      type: Boolean,
      default: false
    },

    deletedOn: {
      type: Date,
      default: null
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('LedgerReport', ledgerReportSchema);
