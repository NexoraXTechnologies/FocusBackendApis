const companyService = require('../../services/companyMaster/companyService');
const {ApiResponse} = require('../../utils/ResponseHandlers');
const { asyncHandler } = require('../../utils/ResponseHandlers');
const { escapeRegex } = require('../../joiValidationSchemas/CommonPaginationSchema/CommonPaginationValidation');
const { buildPaginationMeta } = require('../../utils/pagination/paginationUtil');

const createCompany = asyncHandler (async (req, res) => {
  try {
    const created = await companyService.createCompany(req.body);
    return new ApiResponse({
      statusCode: 201,
      success: true,
      message: 'Company created',
      data: created
    }).send(res);
  } catch (err) {
    return new ApiResponse({
      statusCode: 400,
      success: false,
      message: err.message
    }).send(res);
  }
});

const listCompanies = asyncHandler(async (req, res) => {
  try {
    const { limit, offset, search } = req.query;

    const limitVal = Number.isFinite(Number(limit)) ? Number(limit) : 20;
    const offsetVal = Number.isFinite(Number(offset)) ? Number(offset) : 0;

    const filter = {};

    if (typeof search === 'string' && search.trim().length > 0) {
      const q = escapeRegex(search.trim());
      filter.$or = [
        { companyName: { $regex: q, $options: 'i' } },
        { companyCode: { $regex: q, $options: 'i' } },
        { companyType: { $regex: `^${q}$`, $options: 'i' } },
      ];
    }

    const result = await companyService.listCompanies(filter, {
      skip: offsetVal,
      limit: limitVal,
    });

    // ⭐ UPDATED: use shared pagination utility
    const paginationMeta = buildPaginationMeta({
      total: result.total,
      limit: result.limit,
      offset: result.offset,
    });

    return new ApiResponse({
      statusCode: 200,
      success: true,
      message: 'Companies fetched',

      // ⭐ UPDATED: replace inline pagination with util output
      pagination: paginationMeta,

      data: result.companies,
    }).send(res);

  } catch (err) {
    return new ApiResponse({
      statusCode: 500,
      success: false,
      message: err.message,
    }).send(res);
  }
});





const getCompany = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const company = await companyService.getCompanyById(id);
    if (!company) return res.status(404).json({ success: false, message: 'Not found' });
    console.log("company printing",company);
    return new ApiResponse({
      statusCode: 200,
      success: true,
      message: 'Company fetched',
      data:company
    }).send(res);
  } catch (err) {
    return new ApiResponse({
      statusCode: 500,
      success: false,
      message: err.message
    }).send(res);
  }
});

const updateCompany = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await companyService.updateCompany(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
    return new ApiResponse({
      statusCode: 200,
      success: true,
      message: 'Company updated',
      data: updated

    }).send(res);
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

const deleteCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await companyService.deleteCompany(id);

  if (result.alreadyDeleted) {
    return new ApiResponse({
      statusCode: 200,
      success: true,
      message: 'Company already deleted',
      data: result.company
    }).send(res);
  }

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Company deleted successfully',
    data: result.company
  }).send(res);
});


module.exports = {
  createCompany,
  listCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
};
