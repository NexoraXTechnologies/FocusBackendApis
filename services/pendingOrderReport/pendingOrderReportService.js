const mongoose = require('mongoose');
const PendingOrderReport = require('../../models/pendingOrderReportModel');
const { ApiError, errorCodes } = require('../../utils/ResponseHandlers');

/* CREATE */
const createPendingOrderReport = async (payload) => {
  if (payload.isActive === undefined) {
    payload.isActive = true;
  }

  const report = new PendingOrderReport(payload);
  return await report.save();
};

/* GET ALL (ONLY ACTIVE + NOT DELETED + SEARCH) */
const getAllPendingOrderReports = async (filter = {}, options = {}) => {
  const { skip = 0, limit = 50, search } = options;

  const baseFilter = {
    ...filter,
    isDeleted: false,
    isActive: true
  };

  // text search (only if NOT date)
  const searchFilter =
    search && isNaN(new Date(search).getTime())
      ? {
          pendingOrderReportGeneratedBy: {
            $regex: search,
            $options: 'i'
          }
        }
      : {};

  Object.assign(baseFilter, searchFilter);

  // date / month / year search
  if (search) {
    let startDate = null;
    let endDate = null;

    // year (2026)
    if (/^\d{4}$/.test(search)) {
      startDate = new Date(`${search}-01-01T00:00:00.000Z`);
      endDate = new Date(`${search}-12-31T23:59:59.999Z`);
    }
    // year-month (2026-01)
    else if (/^\d{4}-\d{2}$/.test(search)) {
      const [year, month] = search.split('-');
      startDate = new Date(Date.UTC(year, Number(month) - 1, 1, 0, 0, 0));
      endDate = new Date(Date.UTC(year, Number(month), 0, 23, 59, 59, 999));
    }
    // full date
    else {
      const parsedDate = new Date(search);
      if (!isNaN(parsedDate.getTime())) {
        startDate = new Date(parsedDate);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(parsedDate);
        endDate.setHours(23, 59, 59, 999);
      }
    }

    if (startDate && endDate) {
      baseFilter.pendingOrderReportGeneratedDateTime = {
        $gte: startDate,
        $lte: endDate
      };
    }
  }

  const [reports, total] = await Promise.all([
    PendingOrderReport.find(baseFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    PendingOrderReport.countDocuments(baseFilter)
  ]);

  return {
    reports,
    total,
    limit,
    offset: skip
  };
};

/* GET BY ID */
const getPendingOrderReportById = async (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid Pending Order Report ID', errorCodes.INVALID_PAYLOAD);
  }

  const report = await PendingOrderReport.findOne({
    _id: id,
    isDeleted: false
  });

  if (!report) {
    throw new ApiError(404, 'Pending Order Report not found', errorCodes.NOT_FOUND);
  }

  return report;
};

/* UPDATE */
const updatePendingOrderReport = async (id, payload) => {
  if (!payload || Object.keys(payload).length === 0) {
    throw new ApiError(400, 'No update payload provided', errorCodes.INVALID_PAYLOAD);
  }

  const updated = await PendingOrderReport.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: payload },
    { new: true }
  );

  if (!updated) {
    throw new ApiError(404, 'Pending Order Report not found', errorCodes.NOT_FOUND);
  }

  return updated;
};

/* DELETE (SOFT) */
const deletePendingOrderReport = async (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid Pending Order Report ID', errorCodes.INVALID_PAYLOAD);
  }

  const report = await PendingOrderReport.findById(id);
  if (!report) {
    throw new ApiError(404, 'Pending Order Report not found', errorCodes.NOT_FOUND);
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
  createPendingOrderReport,
  getAllPendingOrderReports,
  getPendingOrderReportById,
  updatePendingOrderReport,
  deletePendingOrderReport
};
