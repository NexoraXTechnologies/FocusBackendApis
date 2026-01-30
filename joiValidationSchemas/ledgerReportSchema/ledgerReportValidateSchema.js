const Joi = require('joi');

/* ===============================
   CREATE Report
================================ */
const createLedgerReportSchema = Joi.object({
  ledgerReportGeneratedDateTime: Joi.date().required(),
  ledgerReportGeneratedBy: Joi.string().trim().required(),
  isActive: Joi.boolean().optional()
});

/* ===============================
   UPDATE Reprt
================================ */
const updateLedgerReportSchema = Joi.object({
  ledgerReportGeneratedDateTime: Joi.date().optional(),
  ledgerReportGeneratedBy: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional()
}).min(1);

module.exports = {
  createLedgerReportSchema,
  updateLedgerReportSchema
};
