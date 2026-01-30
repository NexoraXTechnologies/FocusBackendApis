const express = require('express');
const router = express.Router();
const controller = require('../controller/taxMaster/taxMasterController');

const {
  validateBody,
  validateQuery,
  validateParams,
  validateUpdateBody
} = require ('../utils/middlewares/ValidateRequest');

const {
  taxMasterValidationSchema,
  updateTaxMasterSchema
} = require('../joiValidationSchemas/taxMasterSchema/taxMasterValidateSchema');

const paginationQuerySchema =
  require   ('../joiValidationSchemas/CommonPaginationSchema/CommonPaginationValidation')
    .paginationQuerySchema;

const { idParamSchema } = require('../joiValidationSchemas/commonIdSchema/idParamSchema');


/* ===============================
   CREATE TAX MASTER
================================ */
router.post(
  '/save',
  validateBody(taxMasterValidationSchema),
  controller.createTaxMaster
);

/* ===============================
   LIST TAX MASTERS (PAGINATED)
================================ */
router.get(
  '/getAll',
  validateQuery(paginationQuerySchema),
  controller.getAllTaxMasters
);

/* ===============================
   GET TAX MASTER BY ID
================================ */
router.get(
  '/getById/:id',
  validateParams(idParamSchema),
  controller.getTaxMasterById
);

/* ===============================
   UPDATE TAX MASTER
================================ */
router.put(
  '/update/:id',
  validateParams(idParamSchema),
  validateUpdateBody(updateTaxMasterSchema),
  controller.updateTaxMaster
);

/* ===============================
   DELETE TAX MASTER (SOFT)
================================ */
router.delete(
  '/delete/:id',
  validateParams(idParamSchema),
  controller.deleteTaxMaster
);

module.exports = router;
