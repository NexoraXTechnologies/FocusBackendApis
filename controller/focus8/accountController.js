const { ApiResponse, ApiError } = require('../../utils/ResponseHandlers');
const { getAccounts, createAccountMaster, updateAccountMaster, deleteAccountMaster } = require('../../services/focus8/accountService');

/*=========================================
            ACCOUNT MASTER CONTROLLERS         
=========================================*/

const getAccountsController = async (req, res, next) => {
    try {
        const accounts = await getAccounts();

        return new ApiResponse({
            message: "Account master list fetched successfully",
            data: accounts
        }).send(res);

    } catch (err) {
        next(err);
    }
};

const createAccountMasterController = async (req, res, next) => {
    try {
        const payload = req.body;
        const result = await createAccountMaster(payload);

        return res.status(200).json({
            success: true,
            message: "Account master created successfully",
            data: result
        });

    } catch (err) {
        next(err);
    }
};

const updateAccountMasterController = async (req, res, next) => {
    try {
        const payload = req.body;
        const result = await updateAccountMaster(payload);

        return res.status(200).json({
            success: true,
            message: "Account master updated successfully",
            data: result
        });

    } catch (err) {
        next(err);
    }
};

const deleteAccountMasterController = async (req, res, next) => {
    try {
        const payload = req.body;
        const result = await deleteAccountMaster(payload);

        return res.status(200).json({
            success: true,
            message: "Account master deleted successfully",
            data: result
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAccountsController,
    createAccountMasterController,
    updateAccountMasterController,
    deleteAccountMasterController
};
