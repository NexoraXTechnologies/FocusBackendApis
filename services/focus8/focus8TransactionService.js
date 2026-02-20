const { focus8List, axiosFocus, loginToFocus8 } = require("./focus8Client");

const getPayments = async () =>
    focus8List("/Focus8API/List/Transactions/Payments");

const getSalesOrders = async () =>
    focus8List("/Focus8API/List/Transactions/CSS%20Order");

const getCssOrders = async () =>
    focus8List("/Focus8API/List/Transactions/CSS%20Order");

const getPaymentByDocNo = async (docNo) => {
    const loginRes = await loginToFocus8();
    const sessionId = loginRes.data[0].fSessionId;

    const response = await axiosFocus.get(
        `/Focus8API/Screen/Transactions/Payments/${encodeURIComponent(docNo)}`,
        { headers: { fSessionId: sessionId } }
    );

    if (response.data?.result !== 1)
        throw new Error(response.data?.message || "Focus8 Single Payment API failed");

    return response.data;
};

const postCssOrder = async (payload) => {
    const loginRes = await loginToFocus8();
    const sessionId = loginRes.data[0].fSessionId;

    const response = await axiosFocus.post(
        "/Focus8API/Transactions/CSS%20Order",
        payload,
        { headers: { fSessionId: sessionId } }
    );

    return response.data;
};

const getSalesOrderByDocNo = async (docNo) => {
    const loginRes = await loginToFocus8();
    const sessionId = loginRes.data[0].fSessionId;

    const response = await axiosFocus.get(
        `/Focus8API/Screen/Transactions/CSS%20Order/${encodeURIComponent(docNo)}`,
        { headers: { fSessionId: sessionId } }
    );

    if (response.data?.result !== 1)
        throw new Error(response.data?.message || "Focus8 Single Sales Order API failed");

    return response.data;
};

module.exports = {
    getPayments,
    getSalesOrders,
    getCssOrders,
    getPaymentByDocNo,
    getSalesOrderByDocNo,
    postCssOrder
};
