const { ApiResponse, ApiError } = require('../../utils/ResponseHandlers');
const mongoose = require('mongoose');

const {
    getSalesOrders,
    getCssOrders,
    getSalesOrderByDocNo,
    postCssOrder,
    updateCssOrder,
    deleteCssOrder
} = require('../../services/focus8/salesOrderService');

/*=========================================
            SALES ORDER CONTROLLERS         
=========================================*/
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

/*=========================================
            CSS ORDER CONTROLLERS         
=========================================*/
const fetchCssOrdersController = async (req, res, next) => {
    try {
        const orders = await getCssOrders();
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
        next(err);
    }
};

/*=========================================
            POST CSS ORDER IN FOCUS8         
=========================================*/
const postCssOrderController = async (req, res, next) => {
    try {
        const payload = req.body;

        if (!payload || !Array.isArray(payload.data)) {
            throw new ApiError(400, "Invalid CSS Order payload format.");
        }

        const result = await postCssOrder(payload);

        return new ApiResponse({
            message: "CSS Order posted successfully",
            data: result
        }).send(res);

    } catch (err) {
        next(err);
    }
};

/*=========================================
            UPDATE CSS ORDER IN FOCUS8         
=========================================*/
const updateCssOrderController = async (req, res, next) => {
    try {
        const { docNo } = req.params;

        if (!docNo) {
            throw new ApiError(400, "DocNo is required for update.");
        }

        const changes = req.body;
        if (!changes || Object.keys(changes).length === 0) {
            throw new ApiError(400, "Update payload is required.");
        }

        // Fetch existing order
        const existingRes = await getSalesOrderByDocNo(docNo);

        // Normalize to object with data array when possible
        let existingPayload = null;
        if (existingRes?.data && Array.isArray(existingRes.data) && existingRes.data.length) {
            if (existingRes.data[0]?.data && Array.isArray(existingRes.data[0].data)) {
                existingPayload = existingRes.data[0];
            } else {
                existingPayload = { data: existingRes.data };
            }
        } else if (existingRes?.data && existingRes.data.data && Array.isArray(existingRes.data.data)) {
            existingPayload = existingRes.data;
        } else if (Array.isArray(existingRes)) {
            existingPayload = { data: existingRes };
        } else {
            existingPayload = existingRes;
        }

        if (!existingPayload) {
            throw new ApiError(400, "Unable to fetch existing order payload");
        }

        // Merge changes into matching data item
        let mergedPayload;
        if (Array.isArray(changes.data)) {
            mergedPayload = changes;
        } else if (Array.isArray(existingPayload.data) && existingPayload.data.length) {
            const mergedData = existingPayload.data.map(item => {
                if (item.DocNo && docNo && item.DocNo.toString() === docNo.toString()) {
                    return { ...item, ...changes };
                }
                return item;
            });

            if (!mergedData.some(d => d.DocNo && docNo && d.DocNo.toString() === docNo.toString())) {
                mergedData[0] = { ...mergedData[0], ...changes };
            }

            mergedPayload = { ...existingPayload, data: mergedData };
        } else {
            mergedPayload = { ...existingPayload, ...changes };
        }

        if (!Array.isArray(mergedPayload.data) || mergedPayload.data.length === 0) {
            throw new ApiError(400, "Merged payload has no 'data' array. Provide a full 'data' array or ensure the fetched order contains it.");
        }

        const result = await updateCssOrder(mergedPayload);

        return new ApiResponse({
            message: "CSS Order updated successfully",
            data: result
        }).send(res);

    } catch (err) {
        next(err);
    }
};

/*=========================================
            DELETE CSS ORDER IN FOCUS8         
=========================================*/
const deleteCssOrderController = async (req, res, next) => {
    try {
        const { docNo } = req.params;

        if (!docNo) {
            throw new ApiError(400, "DocNo is required for delete.");
        }

        const result = await deleteCssOrder(docNo);

        return new ApiResponse({
            message: "CSS Order deleted successfully",
            data: result
        }).send(res);

    } catch (err) {
        next(err);
    }
};

/*=========================================
            GET SALES ORDER BY DOCNO        
=========================================*/
const getSalesOrderByDocNoController = async (req, res, next) => {
    try {
        const { docNo } = req.params;

        if (!docNo) {
            throw new ApiError(400, "DocNo is required.");
        }

        const result = await getSalesOrderByDocNo(docNo);

        return new ApiResponse({
            message: "Sales Order details fetched successfully",
            data: result
        }).send(res);

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getSalesOrdersController,
    fetchCssOrdersController,
    postCssOrderController,
    updateCssOrderController,
    deleteCssOrderController,
    getSalesOrderByDocNoController
};
