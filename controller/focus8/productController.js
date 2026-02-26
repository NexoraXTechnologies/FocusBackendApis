const { ApiResponse, ApiError } = require('../../utils/ResponseHandlers');
const { getProducts, updateProductMaster, createProductMaster, fetchProductsFromFocus8 } = require('../../services/focus8/productService');
const { updateAllAccountsIsPostedNo } = require('../../services/focus8/focus8BulkService');

/*=========================================
            PRODUCT MASTER CONTROLLERS         
=========================================*/
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
   UPDATE PRODUCT MASTER
====================================================== */
const updateProductMasterController = async (req, res, next) => {
    try {
        const payload = req.body;
        const result = await updateProductMaster(payload);

        return res.status(200).json({
            success: true,
            message: "Product master updated successfully",
            data: result
        });

    } catch (err) {
        next(err);
    }
};

/* ======================================================
   CREATE PRODUCT MASTER
====================================================== */
const createProductMasterController = async (req, res, next) => {
    try {
        const payload = req.body;
        const result = await createProductMaster(payload);

        return res.status(200).json({
            success: true,
            message: "Product master created successfully",
            data: result
        });

    } catch (err) {
        next(err);
    }
};

/* ======================================================
   DELETE (INACTIVATE) PRODUCT MASTER
====================================================== */
const deleteProductController = async (req, res, next) => {
    try {
        const payload = req.body;
        const result = await updateProductMaster(payload);

        return res.status(200).json({
            success: true,
            message: "Product master deleted successfully",
            data: result
        });

    } catch (err) {
        next(err);
    }
};


module.exports = {
    getProductsController,
    updateProductMasterController,
    createProductMasterController,
    deleteProductController
};
