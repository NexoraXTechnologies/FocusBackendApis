const { asyncHandler } = require('../../utils/ResponseHandlers');
const {ApiResponse} = require('../../utils/ResponseHandlers');
const service = require('../../services/outstandingReport/outstandingReportService');
const {buildPaginationMeta} = require('../../utils/pagination/paginationUtil');

/* CREATE */
const createOutstandingReport = asyncHandler(async (req, res) => {
  const data = await service.createOutstandingReport(req.body);

  return new ApiResponse({
    statusCode: 201,
    success: true,
    message: 'Outstanding Report created successfully',
    data
  }).send(res);
});

/* GET ALL */
const getAllOutstandingReports = asyncHandler(async (req, res) => {
  const { limit, offset, search, isActive } = req.query;

  const limitVal = Number.isFinite(Number(limit)) ? Number(limit) : 50;
  const offsetVal = Number.isFinite(Number(offset)) ? Number(offset) : 0;

  const result = await service.getAllOutstandingReports({}, { limit: limitVal, skip: offsetVal, search: typeof search === 'string' ? search.trim() : '', isActive });

  // ✅ USE PAGINATION UTILITY
    const pagination = buildPaginationMeta
    ({
      total: result.total,
      limit: result.limit,
      offset: result.offset
    });

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Outstanding Reports fetched',
    data: result.reports,
    pagination
  }).send(res);
});

/* GET BY ID */
const getOutstandingReportById = asyncHandler(async (req, res) => {
  const data = await service.getOutstandingReportById(req.params.id);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Outstanding Report fetched',
    data
  }).send(res);
});

/* UPDATE */
const updateOutstandingReport = asyncHandler(async (req, res) => {
  const data = await service.updateOutstandingReport(req.params.id, req.body);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Outstanding Report updated successfully',
    data
  }).send(res);
});

/* DELETE */
const deleteOutstandingReport = asyncHandler(async (req, res) => {
  const result = await service.deleteOutstandingReport(req.params.id);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: result.alreadyDeleted
      ? 'Outstanding Report already deleted'
      : 'Outstanding Report deleted successfully',
    data: result.report
  }).send(res);
});

module.exports = {
  createOutstandingReport,
  getAllOutstandingReports,
  getOutstandingReportById,
  updateOutstandingReport,
  deleteOutstandingReport
};
