const express = require('express');
const router = express.Router();

const { getAccountsController, createAccountMasterController, updateAccountMasterController, deleteAccountMasterController } = require('../../controller/focus8/accountController');
const { updateAccounts } = require('../../controller/focus8/updateIsPostedController');

// Get Account Master
router.get('/accounts', getAccountsController);

// Create Account Master
router.post('/accounts/create', createAccountMasterController);

// Update Account Master
router.post('/accounts/update', updateAccountMasterController);

// Delete Account Master
router.post('/accounts/delete', deleteAccountMasterController);

// Update Accounts Is Posted
router.post('/updateAccountsIsPosted', updateAccounts);

module.exports = router;
