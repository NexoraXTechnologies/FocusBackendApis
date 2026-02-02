const Joi = require('joi');

/* CREATE */
const createSILRReportSchema = Joi.object({
  silrReportGeneratedDateTime: Joi.date().required(),
  silrReportGeneratedBy: Joi.string().trim().required(),
  isActive: Joi.boolean().optional()
});

/* UPDATE */
const updateSILRReportSchema = Joi.object({
  silrReportGeneratedDateTime: Joi.date().optional(),
  silrReportGeneratedBy: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional()
}).min(1);

module.exports = {
  createSILRReportSchema,
  updateSILRReportSchema
};
