const companyService = require('../../services/companyMaster/companyService');
const {ApiResponse} = require('../../utils/ResponseHandlers');
const { asyncHandler } = require('../../utils/ResponseHandlers');
const {buildPaginationMeta} = require('../../utils/pagination/paginationUtil');

/* ===============================
   CREATE
================================ */
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

/* ===============================
   GET ALL
================================ */
const getAllCompanies = asyncHandler(async (req, res) => {
  const { limit, offset, search, isActive } = req.query;

  const limitVal = Number.isFinite(Number(limit)) ? Number(limit) : 50;
  const offsetVal = Number.isFinite(Number(offset)) ? Number(offset) : 0;

  const result = await companyService.listCompanies(
    {},
    {
      limit: limitVal,
      skip: offsetVal,
      search: typeof search === 'string' ? search.trim() : '',
      isActive
    }
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
    message: 'Companies fetched',
    pagination,          // 👈 returned from util
    data: result.companies
  }).send(res);
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
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
};
