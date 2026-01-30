const express = require('express');
const router = express.Router();

const controller = require('../controller/outstandingReport/outstandingReportController');

const {
  validateBody,
  validateQuery,
  validateParams
} = require('../utils/middlewares/ValidateRequest');

const {
  createOutstandingReportSchema,
  updateOutstandingReportSchema
} = require('../joiValidationSchemas/outstandingReportSchema/outstandingReportValidateSchema');

const { paginationQuerySchema } = require(
  '../joiValidationSchemas/CommonPaginationSchema/CommonPaginationValidation'
);

const { idParamSchema } = require(
  '../joiValidationSchemas/commonIdSchema/idParamSchema'
);

router.post(
  '/save',
  validateBody(createOutstandingReportSchema),
  controller.createOutstandingReport
);

router.get(
  '/getAll',
  validateQuery(paginationQuerySchema),
  controller.getAllOutstandingReports
);

router.get(
  '/getById/:id',
  validateParams(idParamSchema),
  controller.getOutstandingReportById
);

router.put(
  '/update/:id',
  validateParams(idParamSchema),
  validateBody(updateOutstandingReportSchema),
  controller.updateOutstandingReport
);

router.delete(
  '/delete/:id',
  validateParams(idParamSchema),
  controller.deleteOutstandingReport
);

module.exports = router;
