const express = require('express');
const router = express.Router();
const {
    getDomesticInvoicesController,
    getDomesticInvoiceByDocNoController,
    updateDomesticInvoiceController
} = require('../../controller/focus8/domesticInvoiceController');

// Route for Domestic Invoice List
router.get('/getDomesticInvoice', getDomesticInvoicesController);

// Route for Single Domestic Invoice Record
router.get('/getDomesticInvoice/:docNo', getDomesticInvoiceByDocNoController);

// Route for Update Domestic Invoice
router.post('/updateDomesticInvoice', updateDomesticInvoiceController);

module.exports = router;
