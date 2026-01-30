const mapJoiError = require("../joiErrorMapper/joiErrorMapper");

/**
 * Validate request body
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    if (!schema || typeof schema.validate !== 'function') return next();

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) return next(mapJoiError(error));

    req.body = value;
    next();
  };
};

/**
 * Validate request body For Update
 */
const validateUpdateBody = (schema) => {
  return (req, res, next) => {
    // console.log("👉 RAW BODY IN UPDATE VALIDATOR:", req.body);

    if (!schema || typeof schema.validate !== 'function') return next();

    try {
      let schemaToUse = schema;
      if (typeof schema.describe === 'function') {
        const described = schema.describe();
        const keys = described && described.keys ? Object.keys(described.keys) : [];
        if (keys.length) schemaToUse = schema.fork(keys, (s) => s.optional());
      }

      const { error, value } = schemaToUse.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) return next(mapJoiError(error));

      req.body = value;
      next();
    } catch (err) {
      return next(err);
    }
  };
};

/**
 * Validate request query
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next(mapJoiError(error));
    }

    req.query = value;
    next();
  };
};

/**
 * Validate request params
 */
function validateParams(schema) {
  // Allow either: validateParams(schema) OR using validateParams directly as middleware
  // If called directly by Express (args are req,res,next) then schema will be req object
  if (arguments.length >= 3 && schema && typeof schema.params !== 'undefined' && typeof schema.method !== 'undefined') {
    const next = arguments[2];
    return next();
  }

  return (req, res, next) => {
    if (!schema || typeof schema.validate !== 'function') return next();

    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) return next(mapJoiError(error));

    req.params = value;
    next();
  };
}

module.exports = {
  validateBody,
  validateQuery,
  validateUpdateBody,
  validateParams,
};
