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

module.exports = router;