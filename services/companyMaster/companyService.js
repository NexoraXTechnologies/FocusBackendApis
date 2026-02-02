const mongoose = require('mongoose');
const Company = require('../../models/companyMasterModel');
const { ApiError, errorCodes } = require('../../utils/ResponseHandlers');

/* ===============================
   CREATE COMPANY
================================ */
const createCompany = async (payload) => {
  // ★ isActive default safety (ONLY CHANGE)
  if (payload.isActive === undefined) {
    payload.isActive = true;
  }

  const company = new Company(payload);
  return await company.save();
};

/* ===============================
   LIST COMPANIES
================================ */
const listCompanies = async (filter = {}, options = {}) => {
  const { skip = 0, limit = 50, search = '', isActive } = options;

  const baseFilter = {
    ...filter,
    isDeleted: false
  };

  // ✅ DEFAULT: active only
  if (isActive === 'false' || isActive === false) {
    baseFilter.isActive = false;
  } else {
    // covers isActive === 'true', true, or undefined
    baseFilter.isActive = true;
  }

  // 🔍 search logic
  if (search) {
    const q = escapeRegex(search);
    baseFilter.$or = [
      { companyName: { $regex: q, $options: 'i' } },
      { companyCode: { $regex: q, $options: 'i' } },
      { companyType: { $regex: `^${q}$`, $options: 'i' } }
    ];
  }

  const [companies, total] = await Promise.all([
    Company.find(baseFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec(),
    Company.countDocuments(baseFilter).exec()
  ]);

  return {
    companies,
    total,
    limit,
    offset: skip
  };
};



/* ===============================
   GET COMPANY BY ID
================================ */
const getCompanyById = async (id) => {
  if (!id) return null;

  if (mongoose.Types.ObjectId.isValid(id)) {
    const byObjectId = await Company.findById(id);
    if (byObjectId && !byObjectId.isDeleted) return byObjectId;
  }

  return Company.findOne({
    companyId: id,
    isDeleted: false
  });
};

/* ===============================
   UPDATE COMPANY
================================ */
const updateCompany = async (id, payload) => {
  if (!id) {
    throw new ApiError(400, 'Company ID is required', errorCodes.INVALID_PAYLOAD);
  }

  if (!payload || Object.keys(payload).length === 0) {
    throw new ApiError(400, 'No update payload provided', errorCodes.INVALID_PAYLOAD);
  }

  const existing = await Company.findById(id);
  if (!existing) throw new ApiError(404, 'Company not found', errorCodes.NOT_FOUND);

  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      payload,          // ★ isActive allowed naturally
      { new: true }
    );

    if (!updatedCompany) {
      throw new ApiError(404, 'Company not found', errorCodes.NOT_FOUND);
    }

    return { alreadyUpdated: false, company: updatedCompany };
  } catch (err) {
    if (err?.code === 11000) {
      throw new ApiError(409, 'Duplicate resource', errorCodes.DUPLICATE_RESOURCE);
    }
    throw err;
  }
};

/* ===============================
   DELETE Company
================================ */
const deleteCompany = async (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid company ID', errorCodes.INVALID_PAYLOAD);
  }

  const existing = await Company.findById(id);
  if (!existing) throw new ApiError(404, 'Company not found', errorCodes.NOT_FOUND);

  if (existing.isDeleted) {
    return { alreadyDeleted: true, company: existing };
  }

  const deleted = await Company.findByIdAndUpdate(
    id,
    {
      $set: {
        isDeleted: true,
        isActive: false,        
        deletedOn: new Date(),
        deletedBy: null,
        updatedBy: null
      }
    },
    { new: true }
  );

  return {
    alreadyDeleted: false,
    company: deleted
  };
};

module.exports = {
  createCompany,
  listCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
