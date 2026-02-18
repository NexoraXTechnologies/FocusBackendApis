const { getCompanies, getAccounts, getProducts, getTaxMasters, getSalesOrders, getVoucherTypes, getCssOrders } = require('../../services/focus8/focus8Service');
const { ApiResponse, ApiError } = require('../../utils/ResponseHandlers');
const mongoose = require('mongoose');

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
   GET CSS ORDERS & SYNC TO DB
====================================================== */
const getCssOrdersController = async (req, res, next) => {
    try {
        console.log("📥 Fetching CSS Orders from Focus8...");
        const orders = await getCssOrders();
        console.log(`📦 Received ${orders?.length || 0} CSS Orders from Focus8`);

        let syncInfo = {
            syncedCount: 0,
            status: "No data"
        };

        if (orders && Array.isArray(orders)) {
            const collection = mongoose.connection.collection('css_orders');

            console.log("🧹 Clearing existing CSS Orders in database...");
            await collection.deleteMany({});

            if (orders.length > 0) {
                console.log(`💾 Inserting ${orders.length} CSS Orders into database...`);
                await collection.insertMany(orders);
                syncInfo.syncedCount = orders.length;
                syncInfo.status = "Success";
                console.log("✅ CSS Orders Sync completed successfully");
            }
        }

        return new ApiResponse({
            message: "CSS Orders sync completed",
            data: syncInfo
        }).send(res);

    } catch (err) {
        console.error("❌ CSS Orders Sync failed:", err.message);
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
    getCssOrdersController
};
