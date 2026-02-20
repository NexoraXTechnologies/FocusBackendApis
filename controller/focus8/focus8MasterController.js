const { ApiResponse, ApiError } = require('../../utils/ResponseHandlers');
const mongoose = require('mongoose');

const {
    getCompanies,
    getAccounts,
    getProducts,
    getTaxMasters } = require('../../services/focus8/focus8MasterService');

const {
    getSalesOrders,
    getVoucherTypes,
    getCssOrders,
    postCssOrder } = require('../../services/focus8/focus8TransactionService');

/* ======================================================
   GET COMPANY MASTER
====================================================== */
const getCompaniesController = async (req, res, next) => {
    try {
        const companies = await getCompanies();

        return new ApiResponse({
            message: "Company master list fetched successfully",
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
        ApiError
    } catch (err) {
        next(err);
    }
};

/* ======================================================
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
   GET SALES ORDERS
====================================================== */
const getSalesOrdersController = async (req, res, next) => {
    try {
        const salesOrders = await getSalesOrders();

        return new ApiResponse({
            message: "Sales orders fetched successfully",
            data: salesOrders
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
/* ======================================================
   FETCH CSS ORDERS FROM FOCUS8
====================================================== */

const fetchCssOrdersController = async (req, res, next) => {
    try {
        console.log("Fetching CSS Orders from Focus8...");

        const orders = await getCssOrders();

        console.log(`Received ${orders.length} orders`);

        const collection = mongoose.connection.collection("css_orders");

        if (!orders.length) {
            return new ApiResponse({
                message: "No CSS Orders found",
                data: { count: 0 }
            }).send(res);
        }
        const bulkOps = orders.map(
            order => ({
                updateOne: {
                    filter: { DocNo: order.DocNo },
                    update: { $set: order },
                    upsert: true
                }
            }));

        const result = await collection.bulkWrite(bulkOps);

        return new ApiResponse({
            message: "CSS Orders fetched and stored successfully",
            data: {
                totalFetched: orders.length,
                inserted: result.upsertedCount,
                updated: result.modifiedCount
            }
        }).send(res);

    } catch (err) {
        console.error("CSS Orders Fetch Error:", err.message);
        next(err);
    }
};


/* ======================================================
   POST CSS ORDER TO FOCUS8
====================================================== */

const postCssOrderController = async (req, res, next) => {
    try {
        const payload = req.body;

        if (!payload || !Array.isArray(payload.data)) {
            throw new ApiError(400, "Invalid CSS Order payload format.");
        }

        console.log("Posting CSS Order to Focus8...");
        const result = await postCssOrder(payload);

        return new ApiResponse({
            message: "CSS Order posted successfully",
            data: result
        }).send(res);

    } catch (err) {
        console.error("CSS Order Post Error:", err.message);
        next(err);
    }
};


module.exports = {
    getCompaniesController,
    getAccountsController,
    getProductsController,
    getTaxMastersController,
    getSalesOrdersController,
    getVoucherTypesController,
    fetchCssOrdersController,
    postCssOrderController
};
