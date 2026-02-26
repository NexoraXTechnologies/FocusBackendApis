const express = require('express');
const router = express.Router();

router.use('/companiesMaster', require('./companyRoutes'));
router.use('/taxMaster', require('./taxMasterRoutes'));
router.use('/ipCredential', require('./ipCredentialRoutes'));
router.use('/productMaster', require('./productRoutes'));
router.use('/ledgerReport', require('./ledgerReportRoutes'));
router.use('/outstandingReport', require('./outstandingReportRoutes'));
router.use('/pendingOrderReport', require('./pendingOrderReportRoutes'));
router.use('/silrReport', require('./silrReportRoutes'));
router.use('/notification', require('./notificationRoutes'));
router.use('/outstandingReport', require('./outstandingReportRoutes'));


// focus8 grouped routes (kept paths unchanged)
router.use('/focus8', require('./focus8/productRoutes'));
router.use('/focus8', require('./focus8/salesRoutes'));
router.use('/focus8', require('./focus8/accountRoutes'));
router.use('/focus8', require('./focus8/taxRoutes'));
router.use('/focus8', require('./focus8/branchRoutes'));
router.use('/focus8', require('./focus8/loginRoutes'));
router.use('/autoPost', require('./autoPostRoutes'));



module.exports = router;
