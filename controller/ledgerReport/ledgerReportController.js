const { asyncHandler } = require('../../utils/ResponseHandlers');
const {ApiResponse} = require('../../utils/ResponseHandlers');
const service = require('../../services/ledgerReport/ledgerReportService');

/* CREATE */
const createLedgerReport = asyncHandler(async (req, res) => {
  const data = await service.createLedgerReport(req.body);

  return new ApiResponse({
    statusCode: 201,
    success: true,
    message: 'Ledger Report created successfully',
    data
  }).send(res);
});

/* GET ALL */
const getAllLedgerReports = asyncHandler(async (req, res) => {
  const { limit, offset, search } = req.query;

  const limitVal = Number.isFinite(Number(limit)) ? Number(limit) : 50;
  const offsetVal = Number.isFinite(Number(offset)) ? Number(offset) : 0;


  const result = await service.getAllLedgerReports({}, { limit: limitVal, skip: offsetVal, search: typeof search === 'string' ? search.trim() : '' });

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Ledger Reports fetched',
    data: result.reports,
    pagination: {
      total: result.total,
      limit: result.limit,
      offset: result.offset
    }
  }).send(res);
});

/* GET BY ID */
const getLedgerReportById = asyncHandler(async (req, res) => {
  const data = await service.getLedgerReportById(req.params.id);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Ledger Report fetched',
    data
  }).send(res);
});

/* UPDATE */
const updateLedgerReport = asyncHandler(async (req, res) => {
  const data = await service.updateLedgerReport(req.params.id, req.body);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Ledger Report updated successfully',
    data
  }).send(res);
});

/* DELETE */
const deleteLedgerReport = asyncHandler(async (req, res) => {
  const result = await service.deleteLedgerReport(req.params.id);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: result.alreadyDeleted
      ? 'Ledger Report already deleted'
      : 'Ledger Report deleted successfully',
    data: result.report
  }).send(res);
});

module.exports = {
  createLedgerReport,
  getAllLedgerReports,
  getLedgerReportById,
  updateLedgerReport,
  deleteLedgerReport
};
