const express = require('express');
const router = express.Router();

const { getBranchController, createBranchController, updateBranchController, deleteBranchController } = require('../../controller/focus8/branchController');

// Get Branch
router.get('/getBranch', getBranchController);

// Create Branch
router.post('/createBranch', createBranchController);

// Update Branch
router.post('/updateBranch', updateBranchController);

// Delete Branch
router.post('/deleteBranch', deleteBranchController);

module.exports = router;
