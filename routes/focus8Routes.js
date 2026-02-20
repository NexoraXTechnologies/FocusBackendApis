const express = require('express');
const router = express.Router();

const productImportController = require('../controller/focus8/productImportController');
const { generatePdfController } = require("../controller/focus8/paymentPdfController");
const { updateAccounts, updateProducts } = require("../controller/focus8/updateIsPostedController");
const { loginToFocus8Controller } = require("../controller/focus8/focus8AuthController");
const {
    getCompaniesController,
    getAccountsController,
    getProductsController,
    getTaxMastersController,
    getSalesOrdersController,
    getVoucherTypesController,
    fetchCssOrdersController,
    postCssOrderController
} = require("../controller/focus8/focus8MasterController");

// Import products from Focus8 (Just call and store)
router.post('/products/import', productImportController.importProducts);

// Sync products (Update IsPosted in Focus8 and store in local DB)
router.post('/products/sync', productImportController.syncProducts);

// Generate Payment PDF
router.get("/generate-pdf/:docNo/:itemIndex", generatePdfController);

// Update Accounts Is Posted
router.post("/updateAccountsIsPosted", updateAccounts);

// Update Products Is Posted (Reset to No)
router.post("/updateProductsIsPosted", updateProducts);

// Login to Focus8 
router.post("/login", loginToFocus8Controller);

// Get Company Master
router.get("/companies", getCompaniesController);

// Get Account Master
router.get("/accounts", getAccountsController);

// Get Product Master
router.get("/products", getProductsController);

// Get Tax Master
router.get("/tax-masters", getTaxMastersController);

// Get Sales Orders (Transactions)
router.get("/sales-orders", getSalesOrdersController);

// Get Voucher Types
router.get("/voucher-types", getVoucherTypesController);

// Get CSS Orders (Sync to DB)
router.get("/getCssOrders", fetchCssOrdersController);

// Post CSS Order to Focus8
router.post("/postCssOrder", postCssOrderController);

module.exports = router;