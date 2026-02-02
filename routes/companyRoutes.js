const express = require('express');
const router = express.Router();
const controller = require('../controller/companyMaster/companyController');

const {
  validateBody,
  validateQuery,
  validateParams,
  validateUpdateBody
} = require('../utils/middlewares/ValidateRequest');

const {
  companyValidationSchema,
  updateCompanySchema
} = require('../joiValidationSchemas/companySchema/companyMasterValidateSchema');

const paginationQuerySchema =
  require('../joiValidationSchemas/CommonPaginationSchema/CommonPaginationValidation')
    .paginationQuerySchema;

const { idParamSchema } = require('../joiValidationSchemas/commonIdSchema/idParamSchema');

router.post(
  '/save',
  validateBody(companyValidationSchema),
  controller.createCompany
);

router.get(
  '/getAll',
  validateQuery(paginationQuerySchema),
  controller.getAllCompanies
);

router.get(
  '/getById/:id',
  validateParams(idParamSchema),
  controller.getCompany
);

router.put(
  '/update/:id',
  validateParams(idParamSchema),
  validateUpdateBody(updateCompanySchema),
  controller.updateCompany
);

router.delete(
  '/delete/:id',
  validateParams(idParamSchema),
  controller.deleteCompany
);

module.exports = router;
