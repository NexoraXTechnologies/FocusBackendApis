const { getCompanies, getAccounts, getProducts, getTaxMasters, getTransactions, getVoucherTypes } = require('../../services/focus8/focus8Service');
const { ApiResponse, ApiError } = require('../../utils/ResponseHandlers');

/* ======================================================
   GET COMPANY MASTER
====================================================== */
const getCompaniesController = async (req, res, next) => {
    try {
        const companies = await getCompanies();

        return new ApiResponse({
            message: "Company list fetched successfully",
            data: companies
        }).send(res);

    } catch (err) {
        next(err);
    }
};

/* ======================================================
   GET ACCOUNT MASTER
====================================================== */
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

/* ======================================================
   GET PRODUCT MASTER
====================================================== */
const getProductsController = async (req, res, next) => {
    try {
        const products = await getProducts();

        return new ApiResponse({
            message: "Product master list fetched successfully",
            data: products
        }).send(res);

    } catch (err) {
        next(err);
    }
};

/* =============== =======================================
   GET TAX MASTER
====================================================== */
const getTaxMastersController = async (req, res, next) => {
    try {
        const taxes = await getTaxMasters();

        return new ApiResponse({
            message: "Tax master list fetched successfully",
            data: taxes
        }).send(res);

    } catch (err) {
        next(err);
    }
};

/* ======================================================
   GET TRANSACTIONS 
====================================================== */
const getTransactionsController = async (req, res, next) => {
    try {
        const transactions = await getTransactions();

        return new ApiResponse({
            message: "Transaction list fetched successfully",
            data: transactions
        }).send(res);

    } catch (err) {
        next(err);
    }
};

/* ======================================================
   GET VOUCHER TYPES
====================================================== */
const getVoucherTypesController = async (req, res, next) => {
    try {
        const voucherTypes = await getVoucherTypes();

        return new ApiResponse({
            message: "Voucher types fetched successfully",
            data: voucherTypes
        }).send(res);

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getCompaniesController,
    getAccountsController,
    getProductsController,
    getTaxMastersController,
    getTransactionsController,
    getVoucherTypesController
};
