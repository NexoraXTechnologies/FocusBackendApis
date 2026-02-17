const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema(
  {
    companyType: {
      type: String,
      enum: {
        values: ['VENUS', 'DISTRIBUTOR'],
        message: 'companyType must be either VENUS or DISTRIBUTOR',
      },
    },

    companyName: {
      type: String,
      required: [true, 'companyName is required'],
      trim: true,
    },

    companyCode: {
      type: String,
      trim: true,
      uppercase: true,
      index: true,
    },

    companyId: {
      type: String,
      trim: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedOn: {
      type: Date,
      default: null
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


module.exports = mongoose.model('Company', CompanySchema);
