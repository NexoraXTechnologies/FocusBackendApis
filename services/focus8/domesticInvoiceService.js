const { focus8List, axiosFocus, loginToFocus8 } = require("./focus8Client");

/**
 * Get List of Domestic Invoices (Proforma)
 */
const getDomesticInvoices = async () => {
    return await focus8List("/Focus8API/List/Transactions/Domestic Proforma Invoice");
};

/**
 * Get Single Domestic Invoice Record by Doc No
 */
const getDomesticInvoiceByDocNo = async (docNo) => {
    const loginRes = await loginToFocus8();
    const sessionId = loginRes.data[0].fSessionId;

    const response = await axiosFocus.get(
        `/Focus8API/Screen/Transactions/Domestic Proforma Invoice/${encodeURIComponent(docNo)}`,
        { headers: { fSessionId: sessionId } }
    );

    if (response.data?.result !== 1)
        throw new Error(response.data?.message || "Focus8 Single Domestic Invoice API failed");

    return response.data;
};

/**
 * Update Domestic Invoice
 */
const updateDomesticInvoice = async (payload) => {
    const loginRes = await loginToFocus8();
    const sessionId = loginRes.data[0].fSessionId;

    const response = await axiosFocus.post(
        "/Focus8API/Transactions/Domestic Proforma Invoice",
        payload,
        { headers: { fSessionId: sessionId } }
    );

    if (response.data?.result !== 1)
        throw new Error(response.data?.message || "Focus8 Domestic Invoice update failed");

    return response.data;
};

module.exports = {
    getDomesticInvoices,
    getDomesticInvoiceByDocNo,
    updateDomesticInvoice
};
