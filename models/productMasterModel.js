const mongoose = require('mongoose');

const productMasterSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },

    productCode: {
      type: String,
      required: [true, 'Product code is required'],
      trim: true
    },

    productDescription: {
      type: String,
      trim: true,
      default: ''
    },

    unit: {
      type: String,
      trim: true
    },

    productType: {
      type: String,
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

module.exports = mongoose.model('Product Master', productMasterSchema);
