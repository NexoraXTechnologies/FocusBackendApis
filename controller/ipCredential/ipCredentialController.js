const {ApiResponse} = require('../../utils/ResponseHandlers');
const ipCredentialService = require('../../services/ipCredential/ipCredentialService');
const {asyncHandler} = require('../../utils/ResponseHandlers');
const {buildPaginationMeta} = require('../../utils/pagination/paginationUtil');

/* ===============================
   CREATE IP CREDENTIAL
================================ */
const createIpCredential = asyncHandler(async (req, res) => {
  const payload = req.body;

  const data = await ipCredentialService.createIpCredential(payload);

  return new ApiResponse({
    statusCode: 201,
    success: true,
    message: 'IP Credential created successfully',
    data
  }).send(res);
});

/* ===============================
   GET ALL IP CREDENTIALS
================================ */
const getAllIpCredentials = asyncHandler(async (req, res) => {
  const {
    limit,
    offset,
    search,
    isActive
  } = req.query;

  const limitVal = Number.isFinite(Number(limit)) ? Number(limit) : 50;
  const offsetVal = Number.isFinite(Number(offset)) ? Number(offset) : 0;

  const filter = {};

  const result = await ipCredentialService.getAllIpCredentials(
    filter,
    { limit: limitVal, skip: offsetVal, search: typeof search === 'string' ? search.trim() : '', isActive }
  );

  // ✅ USE PAGINATION UTILITY
    const pagination = buildPaginationMeta({
      total: result.total,
      limit: result.limit,
      offset: result.offset
    });

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'IP Credentials fetched',
    data: result.data,
    pagination
  }).send(res);
});

/* ===============================
   GET IP CREDENTIAL BY ID
================================ */
const getIpCredentialById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const data = await ipCredentialService.getIpCredentialById(id);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'IP Credential fetched',
    data
  }).send(res);
});

/* ===============================
   UPDATE IP CREDENTIAL
================================ */
const updateIpCredential = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const data = await ipCredentialService.updateIpCredential(id, payload);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'IP Credential updated successfully',
    data
  }).send(res);
});

/* ===============================
   DELETE IP CREDENTIAL (SOFT)
================================ */
const deleteIpCredential = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await ipCredentialService.deleteIpCredential(id);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: result.alreadyDeleted
      ? 'IP Credential already deleted'
      : 'IP Credential deleted successfully',
    data: result.data
  }).send(res);
});

module.exports = {
  createIpCredential,
  getAllIpCredentials,
  getIpCredentialById,
  updateIpCredential,
  deleteIpCredential
};
