const express = require('express');
const router = express.Router();

const { generatePdfController } = require('../../controller/focus8/paymentPdfController');
const {
    getSalesOrdersController,
    fetchCssOrdersController,
    getSalesOrderByDocNoController,
    postCssOrderController,
    updateCssOrderController,
    deleteCssOrderController
} = require('../../controller/focus8/salesOrderController');

// Generate Payment PDF
router.get('/generate-pdf/:docNo/:itemIndex', generatePdfController);

// Get Sales Orders (Transactions)
router.get('/sales-orders', getSalesOrdersController);

// Get Sales CSS Orders (Sync to DB)
router.get('/getCssOrders', fetchCssOrdersController);

// Post Sales CSS Order to Focus8
router.post('/postCssOrder', postCssOrderController);

// Update Sales CSS Order in Focus8 (fetch + merge + post)
router.post('/updateCssOrder/:docNo', updateCssOrderController);

// Delete Sales CSS Order in Focus8 by DocNo
router.delete('/deleteCssOrder/:docNo', deleteCssOrderController);

// Get Single Sales Order Detail by DocNo
router.get('/sales-order/:docNo', getSalesOrderByDocNoController);

module.exports = router;
