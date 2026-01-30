const express = require('express');
const router = express.Router();

const controller = require(
  '../controller/productMaster/productMasterController'
);

const {
  validateBody,
  validateQuery,
  validateParams
} = require('../utils/middlewares/ValidateRequest');

const {
  createProductSchema,
  updateProductSchema
} = require ('../joiValidationSchemas/productMasterSchema/productMasterValidateSchema');  

const { paginationQuerySchema } = require(
  '../joiValidationSchemas/CommonPaginationSchema/CommonPaginationValidation'
);

const { idParamSchema } = require(
  '../joiValidationSchemas/commonIdSchema/idParamSchema'
);

/* ===============================
   CREATE PRODUCT
================================ */
router.post(
  '/save',
  validateBody(createProductSchema),
  controller.createProduct
);

/* ===============================
   GET ALL PRODUCTS
================================ */
router.get(
  '/getAll',
  validateQuery(paginationQuerySchema),
  controller.getAllProducts
);

/* ===============================
   GET PRODUCT BY ID
================================ */
router.get(
  '/getById/:id',
  validateParams(idParamSchema),
  controller.getProductById
);

/* ===============================
   UPDATE PRODUCT
================================ */
router.put(
  '/update/:id',
  validateParams(idParamSchema),
  validateBody(updateProductSchema),
  controller.updateProduct
);

/* ===============================
   DELETE PRODUCT (SOFT)
================================ */
router.delete(
  '/delete/:id',
  validateParams(idParamSchema),
  controller.deleteProduct
);

module.exports = router;
