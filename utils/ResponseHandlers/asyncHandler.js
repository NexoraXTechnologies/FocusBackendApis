const asyncHandler = (fn) => {
  if (typeof fn !== "function") {
    throw new TypeError("asyncHandler expects a function");
  }

  return function (req, res, next) {
    try {
      const result = fn(req, res, next);

      if (result && typeof result.catch === "function") {
        result.catch((error) => {
          if (!res.headersSent) {
            next(error);
          }
        });
      }
    } catch (error) {
      if (!res.headersSent) {
        next(error);
      }
    }
  };
};

module.exports = asyncHandler;
