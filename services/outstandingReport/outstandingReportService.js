const mongoose = require('mongoose');
const OutstandingReport = require('../../models/outstandingReportModel');
const { ApiError, errorCodes } = require('../../utils/ResponseHandlers');


const createOutstandingReport = async (payload) => {
  if (payload.isActive === undefined) {
    payload.isActive = true;
  }

  const report = new OutstandingReport(payload);
  return await report.save();
};


const getAllOutstandingReports = async (filter = {}, options = {}) => {
  const { skip = 0, limit = 50, search } = options;

  const baseFilter = {
    ...filter,
    isDeleted: false,
    isActive: true
  };

  // existing string search
  const searchFilter =
    search && isNaN(new Date(search).getTime())
      ? {
          $or: [
            { outstandingReportGeneratedBy: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

  Object.assign(baseFilter, searchFilter);

    // date search
  if (search) {
  let startDate = null;
  let endDate = null;

  // YEAR search (e.g. 2026)
  if (/^\d{4}$/.test(search)) {
    startDate = new Date(`${search}-01-01T00:00:00.000Z`);
    endDate = new Date(`${search}-12-31T23:59:59.999Z`);
  }

  // YEAR-MONTH search (e.g. 2026-01)
  else if (/^\d{4}-\d{2}$/.test(search)) {
    const [year, month] = search.split('-');
    startDate = new Date(Date.UTC(year, Number(month) - 1, 1, 0, 0, 0));
    endDate = new Date(Date.UTC(year, Number(month), 0, 23, 59, 59, 999));
  }

  // FULL DATE search (e.g. 2026-01-30)
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
    baseFilter.outstandingReportGeneratedDateTime = {
      $gte: startDate,
      $lte: endDate
    };
  }
}


  const [reports, total] = await Promise.all([
    OutstandingReport.find(baseFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    OutstandingReport.countDocuments(baseFilter)
  ]);

  return {
    reports,
    total,
    limit,
    offset: skip
  };
};

const getOutstandingReportById = async (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid Outstanding Report ID', errorCodes.INVALID_PAYLOAD);
  }

  const report = await OutstandingReport.findOne({
    _id: id,
    isDeleted: false
  });

  if (!report) {
    throw new ApiError(404, 'Outstanding Report not found', errorCodes.NOT_FOUND);
  }

  return report;
};


const updateOutstandingReport = async (id, payload) => {
  if (!payload || Object.keys(payload).length === 0) {
    throw new ApiError(400, 'No update payload provided', errorCodes.INVALID_PAYLOAD);
  }

  const updated = await OutstandingReport.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: payload },
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new ApiError(404, 'Outstanding Report not found', errorCodes.NOT_FOUND);
  }

  return updated;
};


const deleteOutstandingReport = async (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid Outstanding Report ID', errorCodes.INVALID_PAYLOAD);
  }

  const report = await OutstandingReport.findById(id);
  if (!report) {
    throw new ApiError(404, 'Outstanding Report not found', errorCodes.NOT_FOUND);
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
  createOutstandingReport,
  getAllOutstandingReports,
  getOutstandingReportById,
  updateOutstandingReport,
  deleteOutstandingReport
};
