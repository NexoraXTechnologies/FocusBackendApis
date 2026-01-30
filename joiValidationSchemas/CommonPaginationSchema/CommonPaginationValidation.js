const Joi = require("joi");

exports.escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");


exports.paginationQuerySchema = Joi.object({
   limit: Joi.any()
    .optional()
    .empty(['', null]),


  offset: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      "number.base": "offset must be a number",
      "number.integer": "offset must be an integer",
      "number.min": "offset must be 0 or greater",
    }),

  search: Joi.string()
    .trim()
    .allow("")
    .optional()
    .messages({
      "string.base": "search must be a string",
    }),
});
