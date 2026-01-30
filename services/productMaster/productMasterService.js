const mongoose = require('mongoose');
const Product = require('../../models/productMasterModel');
const { ApiError, errorCodes } = require('../../utils/ResponseHandlers');

/* ===============================
   CREATE PRODUCT
================================ */
const createProduct = async (payload) => {
  if (!payload || Object.keys(payload).length === 0) {
    throw new ApiError(400, 'Product data is required', errorCodes.INVALID_PAYLOAD);
  }

  if (payload.isActive === undefined) {
    payload.isActive = true;
  }

  const product = new Product(payload);
  return await product.save();
};

/* ===============================
   GET ALL PRODUCTS
================================ */
const getAllProducts = async (filter = {}, options = {}) => {
  const { skip = 0, limit = 50, search } = options;

  const searchFilter = search
    ? {
        $or: [
          { productName: { $regex: search, $options: 'i' } },
          { productDescription: { $regex: search, $options: 'i' } },
          { productCode: { $regex: search, $options: 'i' } }
        ]
      }
    : {};

  const baseFilter = {
    ...filter,
    isDeleted: false,
    isActive: true,
    ...searchFilter
  };

  const [products, total] = await Promise.all([
    Product.find(baseFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Product.countDocuments(baseFilter)
  ]);

  return {
    products,
    total,
    limit,
    offset: skip
  };
};

/* ===============================
   GET PRODUCT BY ID
================================ */
const getProductById = async (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid Product ID', errorCodes.INVALID_PAYLOAD);
  }

  const product = await Product.findOne({
    _id: id,
    isDeleted: false
  });

  if (!product) {
    throw new ApiError(404, 'Product not found', errorCodes.NOT_FOUND);
  }

  return product;
};

/* ===============================
   UPDATE PRODUCT
================================ */
const updateProduct = async (id, payload) => {
  if (!id) {
    throw new ApiError(400, 'Product ID is required', errorCodes.INVALID_PAYLOAD);
  }

  if (!payload || Object.keys(payload).length === 0) {
    throw new ApiError(400, 'No update payload provided', errorCodes.INVALID_PAYLOAD);
  }

  const updated = await Product.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: payload },
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new ApiError(404, 'Product not found or already deleted', errorCodes.NOT_FOUND);
  }

  return updated;
};

/* ===============================
   DELETE PRODUCT 
================================ */
const deleteProduct = async (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid Product ID', errorCodes.INVALID_PAYLOAD);
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found', errorCodes.NOT_FOUND);
  }

  if (product.isDeleted) {
    return { alreadyDeleted: true, product };
  }

  product.isDeleted = true;
  product.isActive = false;
  product.deletedOn = new Date();

  await product.save();

  return { alreadyDeleted: false, product };
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
