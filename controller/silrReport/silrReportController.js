const { asyncHandler } = require('../../utils/ResponseHandlers');
const {ApiResponse} = require('../../utils/ResponseHandlers');
const service = require('../../services/silrReport/silrReportService');
const {buildPaginationMeta} = require('../../utils/pagination/paginationUtil');

/* CREATE */
const createSILRReport = asyncHandler(async (req, res) => {
  const data = await service.createSILRReport(req.body);

  return new ApiResponse({
    statusCode: 201,
    success: true,
    message: 'SILR Report created successfully',
    data
  }).send(res);
});

/* GET ALL */
const getAllSILRReports = asyncHandler(async (req, res) => {
  const { limit, offset, search, isActive } = req.query;

  const result = await service.getAllSILRReports(
    {},
    { limit, skip: offset, search, isActive }
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
    message: 'SILR Reports fetched',
    data: result.reports,
    pagination
  }).send(res);
});

/* GET BY ID */
const getSILRReportById = asyncHandler(async (req, res) => {
  const data = await service.getSILRReportById(req.params.id);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'SILR Report fetched',
    data
  }).send(res);
});

/* UPDATE */
const updateSILRReport = asyncHandler(async (req, res) => {
  const data = await service.updateSILRReport(req.params.id, req.body);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'SILR Report updated successfully',
    data
  }).send(res);
});

/* DELETE */
const deleteSILRReport = asyncHandler(async (req, res) => {
  const result = await service.deleteSILRReport(req.params.id);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: result.alreadyDeleted
      ? 'SILR Report already deleted'
      : 'SILR Report deleted successfully',
    data: result.report
  }).send(res);
});

module.exports = {
  createSILRReport,
  getAllSILRReports,
  getSILRReportById,
  updateSILRReport,
  deleteSILRReport
};
