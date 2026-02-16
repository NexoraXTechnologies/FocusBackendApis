// utils/commanUtils/softDeleteHandler.js
const { ApiError } = require("../ResponseHandlers");

/**
 * Handles errors thrown by throwIfSoftDeleted
 */
function handleSoftDeleteError(res, err, defaultMessage) {
    if (err.code === "ALREADY_DELETED") {
        return res.status(err.statusCode || 410).json({
            success: false,
            code: err.code,
            message: err.message || defaultMessage
        });
    }
    throw err; // rethrow if not related to soft delete
}

module.exports = {
    handleSoftDeleteError
};
