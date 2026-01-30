const { ApiError, errorCodes } = require("../ResponseHandlers/index");


/**
 * Convert Joi validation error into ApiError
 */
const mapJoiError = (error) => {
  // If this is already an ApiError, forward it
  if (error instanceof ApiError) return error;

  // Defensive: ensure we have Joi-like details array
  if (!error || !Array.isArray(error.details)) {
    return new ApiError(
      400,
      error && error.message ? error.message : "Validation failed",
      errorCodes.VALIDATION_ERROR
    );
  }

  const details = error.details.map((item) => ({
    field: Array.isArray(item.path) ? item.path.join('.') : String(item.path),
    message: item.message ? item.message.replace(/"/g, "") : String(item),
  }));

  return new ApiError(400, "Validation failed", errorCodes.VALIDATION_ERROR, details);
};

module.exports = mapJoiError;
