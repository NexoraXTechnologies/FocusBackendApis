const mongoose = require('mongoose');

const autoPostRegistrySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },

  productCode: {
    type: String,
    required: true
  },

  frequency: {
    type: String,
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'HALFYEARLY'],
    default: 'MONTHLY'
  },

  nextPostDate: {
    type: Date,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  },

  isDeleted: {
    type: Boolean,
    default: false
  },

  registeredOn: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

autoPostRegistrySchema.index(
  { productId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  'AutoPostRegistry',
  autoPostRegistrySchema
);