const express = require('express');
const router = express.Router();

const controller = require('../controller/pendingOrderReport/pendingOrderReportController');

const {
  validateBody,
  validateQuery,
  validateParams
} = require('../utils/middlewares/ValidateRequest');

const {
  createPendingOrderReportSchema,
  updatePendingOrderReportSchema
} = require('../joiValidationSchemas/pendingOrderReportSchema/pendingOrderReportValidateSchema');

const { paginationQuerySchema } = require(
  '../joiValidationSchemas/CommonPaginationSchema/CommonPaginationValidation'
);

const { idParamSchema } = require(
  '../joiValidationSchemas/commonIdSchema/idParamSchema'
);

router.post(
  '/save',
  validateBody(createPendingOrderReportSchema),
  controller.createPendingOrderReport
);

router.get(
  '/getAll',
  validateQuery(paginationQuerySchema),
  controller.getAllPendingOrderReports
);

router.get(
  '/getById/:id',
  validateParams(idParamSchema),
  controller.getPendingOrderReportById
);

router.put(
  '/update/:id',
  validateParams(idParamSchema),
  validateBody(updatePendingOrderReportSchema),
  controller.updatePendingOrderReport
);

router.delete(
  '/delete/:id',
  validateParams(idParamSchema),
  controller.deletePendingOrderReport
);

module.exports = router;
