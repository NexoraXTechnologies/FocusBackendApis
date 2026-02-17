const { getCompanies, getAccounts, getProducts, getTaxMasters } = require('../../services/focus8/focus8Service');
const { ApiResponse, ApiError } = require('../../utils/ResponseHandlers');

/* ======================================================
   GET COMPANY LIST
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
   GET ACCOUNT LIST
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
   GET PRODUCT LIST
   Endpoint: GET /api/v1/focus8/products
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

/* ======================================================
   GET TAX MASTER LIST
   Endpoint: GET /api/v1/focus8/tax-masters
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

module.exports = { getCompaniesController, getAccountsController, getProductsController, getTaxMastersController };
