const express = require('express');
const router = express.Router();

const productImportController = require('../controller/focus8/productImportController');
const { generatePdfController } = require("../controller/focus8/paymentPdfController");
const { updateAccounts } = require("../controller/focus8/updateIsPostedController");

// Import products from Focus8
router.post('/products/import', productImportController.syncProducts);

// Generate Payment PDF
router.get("/generate-pdf/:docNo/:itemIndex", generatePdfController);

// Update Accounts Is Posted
router.post("/updateAccountsIsPosted", updateAccounts);

module.exports = router; express