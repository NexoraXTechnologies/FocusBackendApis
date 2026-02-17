const Joi = require('joi');

const companyValidationSchema = Joi.object({
  companyType: Joi.string()
    .required(),

  companyName: Joi.string()
    .trim()
    .required(),

  companyCode: Joi.string()
    .trim()
    .required(),

  companyId: Joi.string()
    .trim()
    .required(),

});

const updateCompanySchema = Joi.object({
  companyType: Joi.string(),
  companyName: Joi.string(),
  companyCode: Joi.string(),
  companyId: Joi.string(),
  isActive: Joi.boolean()

});

module.exports = { companyValidationSchema, updateCompanySchema };