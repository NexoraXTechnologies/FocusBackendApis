const joi = require('joi');

const taxMasterValidationSchema = joi.object({  
    name: joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages   ({
            'any.required': 'name is required',
            'string.base': 'name must be a string',
        }),

    code: joi.string()
        .trim()
        .min(2)
        .max(20)
        .required()
        .messages   ({
            'any.required': 'code is required',
            'string.base': 'code must be a string',
        }),

    isActive: joi.boolean()
        .optional(),
        
    group: joi.string()
        .trim()
        .default("All Taxes"),

    cgstPercent: joi.number()
        .min(0)
        .default(0),

    sgstPercent: joi.number()
        .min(0)
        .default(0),

    igstPercent: joi.number()
        .min(0)
        .default(0),

    cessPercent: joi.number()
        .min(0)
        .default(0)
});

const updateTaxMasterSchema = joi.object({  
    name: joi.string(),
    code: joi.string(),
    group: joi.string().trim().default("All Taxes"),
    cgstPercent: joi.number().min(0).default(0),
    sgstPercent: joi.number().min(0).default(0),
    igstPercent: joi.number().min(0).default(0),
    cessPercent: joi.number().min(0).default(0),
    isActive: joi.boolean().optional()
});

module.exports = { taxMasterValidationSchema, updateTaxMasterSchema };