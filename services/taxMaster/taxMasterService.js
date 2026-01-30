const mongoose = require('mongoose');
const TaxMaster = require('../../models/taxMasterModel');
const { ApiError, errorCodes } = require('../../utils/ResponseHandlers');

/* ===============================
   CREATE TAX MASTER
================================ */
const createTaxMaster = async (payload) => {
  if (!payload || Object.keys(payload).length === 0) {
    throw new ApiError(400, 'Tax data is required', errorCodes.INVALID_PAYLOAD);
  }

 
  if (payload.isActive === undefined) {
    payload.isActive = true;
  }

  const taxMaster = new TaxMaster(payload);
  return await taxMaster.save();
};

/* ===============================
   GET ALL TAX MASTERS
================================ */
const getAllTaxMasters = async (filter = {}, options = {}) => {
  const { skip = 0, limit = 50, search = '' } = options;

  const searchFilter = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { group: { $regex: search, $options: 'i' } }
        ]
      }
    : {};

  const baseFilter = {
    $and: [
      { isDeleted: false },        
      searchFilter,
      filter
    ]
  };

  const [taxMasters, total] = await Promise.all([
    TaxMaster.find(baseFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    TaxMaster.countDocuments(baseFilter)
  ]);

  return {
    taxMasters,
    total,
    limit,
    offset: skip
  };
};

/* ===============================
   GET TAX MASTER BY ID
================================ */
const getTaxMasterById = async (id) => {
  if (!id) {
    throw new ApiError(400, 'Tax Master ID is required', errorCodes.INVALID_PAYLOAD);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid Tax Master ID', errorCodes.INVALID_PAYLOAD);
  }

  const taxMaster = await TaxMaster.findOne({
    _id: id,
    isDeleted: false
  });

  if (!taxMaster) {
    throw new ApiError(404, 'Tax Master not found', errorCodes.NOT_FOUND);
  }

  return taxMaster;
};

/* ===============================
   UPDATE TAX MASTER
================================ */
const updateTaxMaster = async (id, payload) => {
  if (!id) {
    throw new ApiError(400, 'Tax Master ID is required', errorCodes.INVALID_PAYLOAD);
  }

  if (!payload || Object.keys(payload).length === 0) {
    throw new ApiError(400, 'No update payload provided', errorCodes.INVALID_PAYLOAD);
  }

  const updated = await TaxMaster.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: payload },          
    { new: true }
  );

  if (!updated) {
    throw new ApiError(
      404,
      'Tax Master not found or already deleted',
      errorCodes.NOT_FOUND
    );
  }

  return updated;
};

/* ===============================
   DELETE TAX MASTER
================================ */
const deleteTaxMaster = async (id) => {
  if (!id) {
    throw new ApiError(400, 'Tax Master ID is required', errorCodes.INVALID_PAYLOAD);
  }

  const taxMaster = await TaxMaster.findOne({ _id: id });

  if (!taxMaster) {
    throw new ApiError(404, 'Tax Master not found', errorCodes.NOT_FOUND);
  }

  if (taxMaster.isDeleted === true) {
    return {
      alreadyDeleted: true,
      data: taxMaster
    };
  }

  taxMaster.isDeleted = true;
  taxMaster.isActive = false;   
  taxMaster.deletedOn = new Date();

  await taxMaster.save();

  return {
    alreadyDeleted: false,
    data: taxMaster
  };
};

module.exports = {
  createTaxMaster,
  getAllTaxMasters,
  getTaxMasterById,
  updateTaxMaster,
  deleteTaxMaster
};
