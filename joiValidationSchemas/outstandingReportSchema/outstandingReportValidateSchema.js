const Joi = require('joi');

/* CREATE */
const createOutstandingReportSchema = Joi.object({
  outstandingReportGeneratedDateTime: Joi.date().required(),
  outstandingReportGeneratedBy: Joi.string().trim().required(),
  isActive: Joi.boolean().optional()
});

/* UPDATE */
const updateOutstandingReportSchema = Joi.object({
  outstandingReportGeneratedDateTime: Joi.date().optional(),
  outstandingReportGeneratedBy: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional()
}).min(1);

module.exports = {
  createOutstandingReportSchema,
  updateOutstandingReportSchema
};
