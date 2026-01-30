const Joi = require('joi');

/* CREATE */
const createPendingOrderReportSchema = Joi.object({
  pendingOrderReportGeneratedDateTime: Joi.date().required(),
  pendingOrderReportGeneratedBy: Joi.string().trim().required(),
  isActive: Joi.boolean().optional()
});

/* UPDATE */
const updatePendingOrderReportSchema = Joi.object({
  pendingOrderReportGeneratedDateTime: Joi.date().optional(),
  pendingOrderReportGeneratedBy: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional()
}).min(1);

module.exports = {
  createPendingOrderReportSchema,
  updatePendingOrderReportSchema
};
