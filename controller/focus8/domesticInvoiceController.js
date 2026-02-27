const { ApiResponse } = require('../../utils/ResponseHandlers');
const {
    getDomesticInvoices,
    getDomesticInvoiceByDocNo,
    updateDomesticInvoice
} = require('../../services/focus8/domesticInvoiceService');

/*=========================================
      DOMESTIC INVOICE CONTROLLERS         
=========================================*/

/**
 * Get Domestic Invoice List
 */
const getDomesticInvoicesController = async (req, res, next) => {
    try {
        const invoices = await getDomesticInvoices();

        return new ApiResponse({
            message: "Domestic invoice list fetched successfully",
            data: invoices
        }).send(res);
    } catch (err) {
        next(err);
    }
};

/**
 * Get Single Domestic Invoice by Doc No
 */
const getDomesticInvoiceByDocNoController = async (req, res, next) => {
    try {
        const { docNo } = req.params;
        const result = await getDomesticInvoiceByDocNo(docNo);

        return new ApiResponse({
            message: "Domestic invoice record fetched successfully",
            data: result
        }).send(res);
    } catch (err) {
        next(err);
    }
};

/**
 * Update Domestic Invoice
 */
const updateDomesticInvoiceController = async (req, res, next) => {
    try {
        const payload = req.body;
        const result = await updateDomesticInvoice(payload);

        return new ApiResponse({
            message: "Domestic invoice updated successfully",
            data: result
        }).send(res);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getDomesticInvoicesController,
    getDomesticInvoiceByDocNoController,
    updateDomesticInvoiceController
};
