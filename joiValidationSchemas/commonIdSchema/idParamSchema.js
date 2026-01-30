// joiValidationSchemas/common/idParamSchema.js
const Joi = require("joi");

// Regular expression to match a valid MongoDB ObjectId
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

exports.idParamSchema = Joi.object({
  id: Joi.string()
    .pattern(objectIdRegex)
    .required()
    .messages({
      "string.empty": "ID is required",
      "string.pattern.base": "Invalid ObjectId",
    })
});
