const mongoose = require('mongoose');
const IpCredential = require('../../models/ipCredentialModel');
const {ApiError, errorCodes} = require('../../utils/ResponseHandlers');

const createIpCredential = async (payload) => {
  const { ipAddress, domain, isActive = false } = payload;

  if (isActive === true) {
    const activeExists = await IpCredential.findOne({
      ipAddress,
      domain,
      isActive: true,
      isDeleted: false
    });

    if (activeExists) {
      throw new ApiError(
        400,
        'An active IP credential already exists for this IP and domain', errorCodes.INVALID_PAYLOAD
      );
    }
  }

  return await IpCredential.create({
    ipAddress,
    domain,
    isActive
  });
};

const getAllIpCredentials = async (filter = {}, options = {}) => {
  const { skip = 0, limit = 50, search, isActive } = options;

  const baseFilter = {
    ...filter,
    isDeleted: false
  };

  // ✅ FIXED isActive handling (string + boolean)
  if (isActive === true || isActive === 'true') {
    baseFilter.isActive = true;
  } else if (isActive === false || isActive === 'false') {
    baseFilter.isActive = false;
  } else {
    baseFilter.isActive = true; // default behavior
  }

  // search filter
  const searchFilter = search
    ? {
        $or: [
          { ipAddress: { $regex: search, $options: 'i' } },
          { domain: { $regex: search, $options: 'i' } }
        ]
      }
    : {};

  Object.assign(baseFilter, searchFilter);

  const [data, total] = await Promise.all([
    IpCredential.find(baseFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    IpCredential.countDocuments(baseFilter)
  ]);

  return {
    data,
    total,
    limit,
    offset: skip
  };
};




const getIpCredentialById = async (id) => {
  if (!id) {
    throw new ApiError(400, 'IP Credential ID is required', errorCodes.INVALID_PAYLOAD);
  }

  const record = await IpCredential.findOne({
    _id: id,
    isDeleted: false
  });

  if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(
        400,
        'Invalid IP Credential ID',
        errorCodes.INVALID_PAYLOAD
      );
    }

  if (!record) {
    throw new ApiError(404, 'IP Credential not found', errorCodes.NOT_FOUND);
  }

  return record;
};


const updateIpCredential = async (id, payload) => {
  if (!id) {
    throw new ApiError(400, 'IP Credential ID is required');
  }

  const record = await IpCredential.findOne({
    _id: id,
    isDeleted: false
  });

  if (!record) {
    throw new ApiError(404, 'IP Credential not found');
  }

  const nextIpAddress =
    payload.ipAddress !== undefined ? payload.ipAddress : record.ipAddress;

  const nextDomain =
    payload.domain !== undefined ? payload.domain : record.domain;

  const nextIsActive =
    payload.isActive !== undefined ? payload.isActive : record.isActive;

  if (nextIsActive === true) {
    const activeExists = await IpCredential.findOne({
      _id: { $ne: id },                 
      ipAddress: nextIpAddress,
      domain: nextDomain,
      isActive: true,
      isDeleted: false
    });

    if (activeExists) {
      throw new ApiError(
        400,
          'To activate this IP credential, the existing active credential must be set to falsee' , errorCodes.INVALID_PAYLOAD
      );
    }
  }

  Object.assign(record, payload);
  await record.save();

  return record;
};


const deleteIpCredential = async (id) => {
  const record = await IpCredential.findOne({ _id: id });

  if (!record) {
    throw new ApiError(404, 'IP Credential not found', errorCodes.NOT_FOUND);
  }

  if (record.isDeleted) {
    return {
      alreadyDeleted: true,
      data: record
    };
  }

  record.isDeleted = true;
  record.isActive = false;
  record.deletedOn = new Date();

  await record.save();

  return {
    alreadyDeleted: false,
    data: record
  };
};

module.exports = {
  createIpCredential,
  getAllIpCredentials,
  getIpCredentialById,
  updateIpCredential,
  deleteIpCredential
};