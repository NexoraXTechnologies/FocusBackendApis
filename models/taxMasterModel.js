const mongoose = require('mongoose');

const taxMasterSchema= new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, ' name is required'],
      trim: true,
    },

    code:{
        type: String,
        required: [true, ' code is required'],
        trim: true
    },

    group:{
        type: String,
        default: "All Taxes",
    },

    cgstPercent:{
        type: Number,
        default: 0,
    },

    sgstPercent: {
        type: Number,
        default: 0,
    },

    igstPercent:{
        type: Number,
        default: 0,
    },

    cessPercent:{
        type: Number,
        default: 0,
    },  

     isActive: {
      type: Boolean,
      default: true
    },
    
    isDeleted: {
      type: Boolean,
      default: false,
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
  }
);


module.exports = mongoose.model('TaxMaster', taxMasterSchema);
