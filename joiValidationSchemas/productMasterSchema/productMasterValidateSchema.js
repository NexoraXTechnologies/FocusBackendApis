const Joi = require('joi');

/* ===============================
   CREATE PRODUCT
================================ */
const createProductSchema = Joi.object({
  productName: Joi.string().trim().required(),
  productCode: Joi.string().trim().required(),
  productDescription: Joi.string().trim().optional().allow(''),
  unit: Joi.string().trim().required(),
  productType: Joi.string().trim().required(),
  isActive: Joi.boolean().optional()
});

/* ===============================
   UPDATE PRODUCT
================================ */
const updateProductSchema = Joi.object({
  productName: Joi.string().trim().optional(),
  productCode: Joi.string().trim().optional(),
  productDescription: Joi.string().trim().optional().allow(''),
  unit: Joi.string().trim().optional(),
  productType: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional()
}).min(1);

module.exports = {
  createProductSchema,
  updateProductSchema
};
