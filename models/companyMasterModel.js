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
      minlength: [2, 'companyName must be at least 2 characters long'],
      maxlength: [100, 'companyName cannot exceed 100 characters'],
    },

    companyCode: {
      type: String,
      trim: true,
      uppercase: true,
      minlength: [2, 'companyCode must be at least 2 characters long'],
      maxlength: [20, 'companyCode cannot exceed 20 characters'],
      match: [
        /^[A-Z0-9_-]+$/,
        'companyCode can only contain letters, numbers, underscores, and hyphens',
      ],
      index: true,
    },

    companyId: {
      type: String,
      trim: true,
      minlength: [5, 'companyId must be at least 5 characters long'],
      maxlength: [50, 'companyId cannot exceed 50 characters'],
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
