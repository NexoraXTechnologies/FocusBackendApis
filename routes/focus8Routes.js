const express = require('express');
const router = express.Router();

const productImportController = require('../controller/focus8/productImportController');
const { generatePdfController } = require("../controller/focus8/paymentPdfController");
const { updateAccounts, updateProducts } = require("../controller/focus8/updateIsPostedController");
const { loginToFocus8Controller } = require("../controller/focus8/focus8AuthController");

// Import products from Focus8
router.post('/products/import', productImportController.syncProducts);

// Generate Payment PDF
router.get("/generate-pdf/:docNo/:itemIndex", generatePdfController);

// Update Accounts Is Posted
router.post("/updateAccountsIsPosted", updateAccounts);

// Update Products Is Posted (Reset to No)
router.post("/updateProductsIsPosted", updateProducts);

// Login to Focus8 (for frontend use)
router.post("/login", loginToFocus8Controller);

module.exports = router;