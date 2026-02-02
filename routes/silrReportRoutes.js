const express = require('express');
const router = express.Router();

const controller = require('../controller/silrReport/silrReportController');

const {
  validateBody,
  validateQuery,
  validateParams
} = require('../utils/middlewares/ValidateRequest');

const {
  createSILRReportSchema,
  updateSILRReportSchema
} = require('../joiValidationSchemas/silrReportSchema/silrReportValidateSchema');

const { paginationQuerySchema } = require(
  '../joiValidationSchemas/CommonPaginationSchema/CommonPaginationValidation'
);

const { idParamSchema } = require(
  '../joiValidationSchemas/commonIdSchema/idParamSchema'
);

router.post(
  '/save',
  validateBody(createSILRReportSchema),
  controller.createSILRReport
);

router.get(
  '/getAll',
  validateQuery(paginationQuerySchema),
  controller.getAllSILRReports
);

router.get(
  '/getById/:id',
  validateParams(idParamSchema),
  controller.getSILRReportById
);

router.put(
  '/update/:id',
  validateParams(idParamSchema),
  validateBody(updateSILRReportSchema),
  controller.updateSILRReport
);

router.delete(
  '/delete/:id',
  validateParams(idParamSchema),
  controller.deleteSILRReport
);

module.exports = router;
