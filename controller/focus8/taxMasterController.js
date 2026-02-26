const { getTaxMasters, createTaxMaster, updateTaxMaster, deleteTaxMaster } = require('../../services/focus8/taxMasterService');

/*=========================================
            TAX MASTER CONTROLLERS         
=========================================*/
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

const createTaxMasterController = async (req, res, next) => {
    try {
        const payload = req.body;
        const result = await createTaxMaster(payload);

        return res.status(200).json({
            success: true,
            message: "Tax master created successfully",
            data: result
        });

    } catch (err) {
        next(err);
    }
};

const updateTaxMasterController = async (req, res, next) => {
    try {
        const payload = req.body;
        const result = await updateTaxMaster(payload);

        return res.status(200).json({
            success: true,
            message: "Tax master updated successfully",
            data: result
        });

    } catch (err) {
        next(err);
    }
};

const deleteTaxMasterController = async (req, res, next) => {
    try {
        const payload = req.body;
        const result = await deleteTaxMaster(payload);

        return res.status(200).json({
            success: true,
            message: "Tax master deleted successfully",
            data: result
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getTaxMastersController,
    createTaxMasterController,
    updateTaxMasterController,
    deleteTaxMasterController
};
