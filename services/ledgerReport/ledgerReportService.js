const mongoose = require('mongoose');
const LedgerReport = require('../../models/ledgerReportModel');
const { ApiError, errorCodes } = require('../../utils/ResponseHandlers');

/* CREATE */
const createLedgerReport = async (payload) => {
  if (payload.isActive === undefined) {
    payload.isActive = true;
  }

  const report = new LedgerReport(payload);
  return await report.save();
};

const getAllLedgerReports = async (filter = {}, options = {}) => {
  const { skip = 0, limit = 50, search = '' } = options;

  const baseFilter = {
    ...filter,
    isDeleted: false,
    isActive: true
  };

  if (search) {
    baseFilter.$or = [
      { ledgerReportGeneratedBy: { $regex: search, $options: 'i' } }
    ];
  }
  const [reports, total] = await Promise.all([
    LedgerReport.find(baseFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    LedgerReport.countDocuments(baseFilter)
  ]);

  return {
    reports,
    total,
    limit,
    offset: skip
  };
};

/* GET BY ID */
const getLedgerReportById = async (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid Ledger Report ID', errorCodes.INVALID_PAYLOAD);
  }

  const report = await LedgerReport.findOne({
    _id: id,
    isDeleted: false
  });

  if (!report) {
    throw new ApiError(404, 'Ledger Report not found', errorCodes.NOT_FOUND);
  }

  return report;
};

/* UPDATE */
const updateLedgerReport = async (id, payload) => {
  if (!payload || Object.keys(payload).length === 0) {
    throw new ApiError(400, 'No update payload provided', errorCodes.INVALID_PAYLOAD);
  }

  const updated = await LedgerReport.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: payload },
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new ApiError(404, 'Ledger Report not found', errorCodes.NOT_FOUND);
  }

  return updated;
};

/* DELETE (SOFT) */
const deleteLedgerReport = async (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid Ledger Report ID', errorCodes.INVALID_PAYLOAD);
  }

  const report = await LedgerReport.findById(id);
  if (!report) {
    throw new ApiError(404, 'Ledger Report not found', errorCodes.NOT_FOUND);
  }

  if (report.isDeleted) {
    return { alreadyDeleted: true, report };
  }

  report.isDeleted = true;
  report.isActive = false;
  report.deletedOn = new Date();

  await report.save();

  return { alreadyDeleted: false, report };
};

module.exports = {
  createLedgerReport,
  getAllLedgerReports,
  getLedgerReportById,
  updateLedgerReport,
  deleteLedgerReport
};
