const taxMasterService = require('../../services/taxMaster/taxMasterService');
const {ApiResponse} = require('../../utils/ResponseHandlers');
const { asyncHandler } = require('../../utils/ResponseHandlers');
const {buildPaginationMeta} = require('../../utils/pagination/paginationUtil');

/* ===============================
   CREATE TAX MASTER
================================ */
const createTaxMaster = asyncHandler(async (req, res) => {
  const created = await taxMasterService.createTaxMaster(req.body);

  return new ApiResponse({
    statusCode: 201,
    success: true,
    message: 'Tax Master created successfully',
    data: created,
  }).send(res);
});

/* ===============================
   GET ALL TAX MASTERS
================================ */
const getAllTaxMasters = asyncHandler(async (req, res) => {
  const { limit, offset, search, isActive } = req.query;

  const limitVal = Number.isFinite(Number(limit)) ? Number(limit) : 20;
  const offsetVal = Number.isFinite(Number(offset)) ? Number(offset) : 0;

  const filter = {};

  const result = await taxMasterService.getAllTaxMasters(filter, {
    skip: offsetVal,
    limit: limitVal,
    search,
    isActive
  });

  // ✅ USE PAGINATION UTILITY
      const pagination = buildPaginationMeta({
        total: result.total,
        limit: result.limit,
        offset: result.offset
      });

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Tax Masters fetched',
    data: result.taxMasters,
    pagination
  }).send(res);
});

/* ===============================
   GET TAX MASTER BY ID
================================ */
const getTaxMasterById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const taxMaster = await taxMasterService.getTaxMasterById(id);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Tax Master fetched',
    data: taxMaster,
  }).send(res);
});

/* ===============================
   UPDATE TAX MASTER
================================ */
const updateTaxMaster = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updated = await taxMasterService.updateTaxMaster(id, req.body);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Tax Master updated successfully',
    data: updated,
  }).send(res);
});

/* ===============================
   DELETE TAX MASTER (SOFT)
================================ */
const deleteTaxMaster = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await taxMasterService.deleteTaxMaster(id);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: result.alreadyDeleted
      ? 'Tax Master already deleted'
      : 'Tax Master deleted successfully',
    data: result.data
  }).send(res);
});


module.exports = {
  createTaxMaster,
  getAllTaxMasters,
  getTaxMasterById,
  updateTaxMaster,
  deleteTaxMaster,
};
