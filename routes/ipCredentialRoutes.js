const express = require('express');
const router = express.Router();

const controller = require(
  '../controller/ipCredential/ipCredentialController'
);

const {
  validateBody,
  validateQuery,
  validateParams
} = require('../utils/middlewares/ValidateRequest');

const { idParamSchema } = require('../joiValidationSchemas/commonIdSchema/idParamSchema');

const paginationQuerySchema =
  require('../joiValidationSchemas/CommonPaginationSchema/CommonPaginationValidation')
    .paginationQuerySchema;

const ipCredentialValidationSchema =
  require('../joiValidationSchemas/ipCredentialValidationSchema/ipCredentialValidateSchema')
    .ipCredentialCreateSchema;
    
/* ===============================
   CREATE IP CREDENTIAL
================================ */
router.post(
  '/save',
    validateBody(ipCredentialValidationSchema),
    controller.createIpCredential
);

/* ===============================
   GET ALL IP CREDENTIALS
================================ */
router.get(
  '/getAll',
  validateQuery(paginationQuerySchema),
  controller.getAllIpCredentials
);

/* ===============================
   GET IP CREDENTIAL BY ID
================================ */
router.get(
  '/getById/:id',
  validateParams(idParamSchema),
  controller.getIpCredentialById
);

/* ===============================
   UPDATE IP CREDENTIAL
================================ */
router.put(
  '/update/:id',
  validateParams(idParamSchema),
  validateBody(ipCredentialValidationSchema),
  controller.updateIpCredential
);

/* ===============================
   DELETE IP CREDENTIAL (SOFT)
================================ */
router.delete(
  '/delete/:id',
  validateParams(idParamSchema),
  controller.deleteIpCredential
);

module.exports = router;
