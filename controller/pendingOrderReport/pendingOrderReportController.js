const { asyncHandler } = require('../../utils/ResponseHandlers');
const {ApiResponse} = require('../../utils/ResponseHandlers');
const service = require('../../services/pendingOrderReport/pendingOrderReportService');

/* CREATE */
const createPendingOrderReport = asyncHandler(async (req, res) => {
  const data = await service.createPendingOrderReport(req.body);

  return new ApiResponse({
    statusCode: 201,
    success: true,
    message: 'Pending Order Report created successfully',
    data
  }).send(res);
});

/* GET ALL */
const getAllPendingOrderReports = asyncHandler(async (req, res) => {
  const { limit, offset, search } = req.query;

  const result = await service.getAllPendingOrderReports(
    {},
    { limit, skip: offset, search }
  );

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Pending Order Reports fetched',
    data: result.reports,
    pagination: {
      total: result.total,
      limit: result.limit,
      offset: result.offset
    }
  }).send(res);
});

/* GET BY ID */
const getPendingOrderReportById = asyncHandler(async (req, res) => {
  const data = await service.getPendingOrderReportById(req.params.id);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Pending Order Report fetched',
    data
  }).send(res);
});

/* UPDATE */
const updatePendingOrderReport = asyncHandler(async (req, res) => {
  const data = await service.updatePendingOrderReport(req.params.id, req.body);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Pending Order Report updated successfully',
    data
  }).send(res);
});

/* DELETE */
const deletePendingOrderReport = asyncHandler(async (req, res) => {
  const result = await service.deletePendingOrderReport(req.params.id);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: result.alreadyDeleted
      ? 'Pending Order Report already deleted'
      : 'Pending Order Report deleted successfully',
    data: result.report
  }).send(res);
});

module.exports = {
  createPendingOrderReport,
  getAllPendingOrderReports,
  getPendingOrderReportById,
  updatePendingOrderReport,
  deletePendingOrderReport
};
