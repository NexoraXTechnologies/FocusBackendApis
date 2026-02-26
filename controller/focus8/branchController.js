const { ApiResponse, ApiError } = require('../../utils/ResponseHandlers');
const { getBranch, createBranch, updateBranch, deleteBranch } = require('../../services/focus8/branchService');


/*=========================================
            BRANCH CONTROLLERS         
=========================================*/
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

const createBranchController = async (req, res, next) => {
    try {
        const payload = req.body;
        const result = await createBranch(payload);

        return res.status(200).json({
            success: true,
            message: "Branch created successfully",
            data: result
        });

    } catch (err) {
        next(err);
    }
};

const updateBranchController = async (req, res, next) => {
    try {
        const payload = req.body;
        const result = await updateBranch(payload);

        return res.status(200).json({
            success: true,
            message: "Branch updated successfully",
            data: result
        });

    } catch (err) {
        next(err);
    }
};

const deleteBranchController = async (req, res, next) => {
    try {
        const payload = req.body;
        const result = await deleteBranch(payload);

        return res.status(200).json({
            success: true,
            message: "Branch deleted successfully",
            data: result
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getBranchController,
    createBranchController,
    updateBranchController,
    deleteBranchController
};
