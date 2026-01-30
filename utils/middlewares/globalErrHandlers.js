const { ApiError, errorCodes } = require("../ResponseHandlers/index");


const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Normalize unknown / system errors
  if (!(err instanceof ApiError)) {
    error = new ApiError(
      500,
      "Something went wrong",
      errorCodes.INTERNAL_ERROR
    );
  }

  const response = {
    success: false,
    message: error.message,
    code: error.code,
  };

  // Attach validation / custom details if present
  if (error.details) {
    response.details = error.details;
  }

  // Stack trace only in non-production
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(error.statusCode).json(response);
};

module.exports = {errorMiddleware};


