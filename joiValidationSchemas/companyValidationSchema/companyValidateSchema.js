const Joi = require('joi');

const companyValidationSchema = Joi.object({
  companyType: Joi.string()
    .valid('VENUS', 'DISTRIBUTOR')
    .required()
    .messages({
      'any.required': 'companyType is required',
      'any.only': 'companyType must be either VENUS or DISTRIBUTOR',
      'string.base': 'companyType must be a string',
    }),

  companyName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'any.required': 'companyName is required',
      'string.base': 'companyName must be a string',
      'string.empty': 'companyName cannot be empty',
      'string.min': 'companyName must be at least 2 characters long',
      'string.max': 'companyName cannot exceed 100 characters',
    }),

  companyCode: Joi.string()
    .trim()
    .uppercase()
    .min(2)
    .max(20)
    .required()
    .messages({
      'any.required': 'companyCode is required',
      'string.base': 'companyCode must be a string',
      'string.empty': 'companyCode cannot be empty'
    }),

  companyId: Joi.string()
    .trim()
    .min(5)
    .max(50)
    .required()
    .messages({
      'any.required': 'companyId is required',
      'string.pattern.base': 'companyId must be a valid string',
    }),

});

const updateCompanySchema = Joi.object({
  companyType: Joi.string(),
  companyName: Joi.string(),
  companyCode: Joi.string(),
  companyId: Joi.string(),
  isActive: Joi.boolean()

});

module.exports = { companyValidationSchema, updateCompanySchema };