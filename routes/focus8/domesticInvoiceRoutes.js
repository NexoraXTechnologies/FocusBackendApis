const express = require('express');
const router = express.Router();
const {
    getDomesticInvoicesController,
    getDomesticInvoiceByDocNoController
} = require('../../controller/focus8/domesticInvoiceController');

// Route for Domestic Invoice List
router.get('/getDomesticInvoice', getDomesticInvoicesController);

// Route for Single Domestic Invoice Record
router.get('/getDomesticInvoice/:docNo', getDomesticInvoiceByDocNoController);

module.exports = router;
