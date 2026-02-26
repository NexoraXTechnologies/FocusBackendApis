const express = require('express');
const router = express.Router();

const { getTaxMastersController, createTaxMasterController, updateTaxMasterController, deleteTaxMasterController } = require('../../controller/focus8/taxMasterController');

// Get Tax Master
router.get('/tax-masters', getTaxMastersController);

// Create Tax Master
router.post('/create/tax-masters', createTaxMasterController);

// Update Tax Master
router.post('/update/tax-masters', updateTaxMasterController);

// Delete Tax Master
router.post('/delete/tax-masters', deleteTaxMasterController);

module.exports = router;
