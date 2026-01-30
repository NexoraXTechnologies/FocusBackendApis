const express = require('express');
const router = express.Router();

const controller = require('../controller/ledgerReport/ledgerReportController');

const {
  validateBody,
  validateQuery,
  validateParams
} = require('../utils/middlewares/ValidateRequest');

const {
  createLedgerReportSchema,
  updateLedgerReportSchema
} = require('../joiValidationSchemas/ledgerReportValidationSchema/ledgerReportValidateSchema');

const { paginationQuerySchema } = require(
  '../joiValidationSchemas/CommonPaginationSchema/CommonPaginationValidation'
);

const { idParamSchema } = require(
  '../joiValidationSchemas/commonIdSchema/idParamSchema'
);

router.post(
  '/save',
  validateBody(createLedgerReportSchema),
  controller.createLedgerReport
);

router.get(
  '/getAll',
  validateQuery(paginationQuerySchema),
  controller.getAllLedgerReports
);

router.get(
  '/getById/:id',
  validateParams(idParamSchema),
  controller.getLedgerReportById
);

router.put(
  '/update/:id',
  validateParams(idParamSchema),
  validateBody(updateLedgerReportSchema),
  controller.updateLedgerReport
);

router.delete(
  '/delete/:id',
  validateParams(idParamSchema),
  controller.deleteLedgerReport
);

module.exports = router;
