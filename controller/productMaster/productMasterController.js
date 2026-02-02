const { asyncHandler } = require('../../utils/ResponseHandlers');
const {ApiResponse} = require('../../utils/ResponseHandlers');
const productService = require('../../services/productMaster/productMasterService');
const {buildPaginationMeta} = require('../../utils/pagination/paginationUtil');

/* ===============================
   CREATE
================================ */
const createProduct = asyncHandler(async (req, res) => {
  const data = await productService.createProduct(req.body);

  return new ApiResponse({
    statusCode: 201,
    success: true,
    message: 'Product created successfully',
    data
  }).send(res);
});

/* ===============================
   GET ALL
================================ */
const getAllProducts = asyncHandler(async (req, res) => {
  const { limit, offset , search, isActive } = req.query;

  const limitVal = Number.isFinite(Number(limit)) ? Number(limit) : 50;
  const offsetVal = Number.isFinite(Number(offset)) ? Number(offset) : 0;

  const filter = {};

  const result = await productService.getAllProducts(
    filter,
    { limit: limitVal, skip: offsetVal, search: typeof search === 'string' ? search.trim() : '', isActive }
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
    message: 'Products fetched',
    data: result.products,
    pagination
  }).send(res);
});

/* ===============================
   GET BY ID
================================ */
const getProductById = asyncHandler(async (req, res) => {
  const data = await productService.getProductById(req.params.id);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Product fetched',
    data
  }).send(res);
});

/* ===============================
   UPDATE
================================ */
const updateProduct = asyncHandler(async (req, res) => {
  const data = await productService.updateProduct(req.params.id, req.body);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Product updated successfully',
    data
  }).send(res);
});

/* ===============================
   DELETE
================================ */
const deleteProduct = asyncHandler(async (req, res) => {
  const result = await productService.deleteProduct(req.params.id);

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: result.alreadyDeleted
      ? 'Product already deleted'
      : 'Product deleted successfully',
    data: result.product
  }).send(res);
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
