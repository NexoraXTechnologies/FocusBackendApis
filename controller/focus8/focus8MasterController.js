const { ApiResponse, ApiError } = require('../../utils/ResponseHandlers');
const mongoose = require('mongoose');

const {
    getAccounts,
    getProducts,
    getTaxMasters,
    getBranch } = require('../../services/focus8/focus8MasterService');

const {
    getSalesOrders,
    getCssOrders,
    getSalesOrderByDocNo,
    postCssOrder } = require('../../services/focus8/focus8TransactionService');

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
   GET BRANCH
====================================================== */
const getBranchController = async (req, res, next) => {
    try {
        const branch = await getBranch();

        return new ApiResponse({
            message: "Branch fetched successfully",
            data: branch
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

        // Basic validation
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


/* ======================================================
   GET SINGLE SALES ORDER BY DOC NO
====================================================== */
const getSalesOrderByDocNoController = async (req, res, next) => {
    try {
        const { docNo } = req.params;

        if (!docNo) {
            throw new ApiError(400, "DocNo is required.");
        }

        console.log(`Fetching Sales Order Detail for DocNo: ${docNo}...`);
        const result = await getSalesOrderByDocNo(docNo);

        return new ApiResponse({
            message: "Sales Order details fetched successfully",
            data: result
        }).send(res);

    } catch (err) {
        console.error("Sales Order Detail Fetch Error:", err.message);
        next(err);
    }
};

module.exports = {
    getAccountsController,
    getProductsController,
    getTaxMastersController,
    getBranchController,
    getSalesOrdersController,
    fetchCssOrdersController,
    getSalesOrderByDocNoController,
    postCssOrderController
};
