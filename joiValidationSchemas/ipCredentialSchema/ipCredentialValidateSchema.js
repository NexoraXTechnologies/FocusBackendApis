const Joi = require('joi');

const ipCredentialCreateSchema = Joi.object({
  ipAddress: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'ipAddress is required',
      'string.base': 'ipAddress must be a string'
    }),

  domain: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'domain is required',
      'string.base': 'domain must be a string'
    }),

  isActive: Joi.boolean()
    .optional()
});

const ipCredentialUpdateSchema = Joi.object({
  ipAddress: Joi.string()
    .trim()
    .optional(),

  domain: Joi.string()
    .trim()
    .optional(),

  isActive: Joi.boolean()
    .optional()
}).min(1); // ensure at least one field is updated

module.exports = {
  ipCredentialCreateSchema,
  ipCredentialUpdateSchema
};
