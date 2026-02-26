const { focus8List, loginToFocus8, axiosFocus } = require("./focus8Client");

const getTaxMasters = async () =>
    focus8List("/Focus8API/List/Masters/Core__TaxMaster?fields=sCode,sName");

const createTaxMaster = async (payload) => {
    try {
        const loginRes = await loginToFocus8();
        const sessionId = loginRes?.data?.[0]?.fSessionId;

        if (!sessionId) {
            throw new Error("Unable to obtain Focus8 session ID for tax master creation");
        }

        const response = await axiosFocus.post(
            "/Focus8API/Masters/Core__TaxMaster",
            payload,
            {
                headers: {
                    fSessionId: sessionId,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.data || response.data.result !== 1) {
            throw new Error(response.data?.message || "Focus8 Tax Master creation failed");
        }

        return response.data;

    } catch (err) {
        console.error("Tax Master Create Error:", err.response?.data || err.message);
        throw err;
    }
};

const updateTaxMaster = async (payload) => {
    try {
        const loginRes = await loginToFocus8();
        const sessionId = loginRes?.data?.[0]?.fSessionId;

        if (!sessionId) {
            throw new Error("Unable to obtain Focus8 session ID for tax master update");
        }

        const response = await axiosFocus.post(
            "/Focus8API/Masters/Core__TaxMaster",
            payload,
            {
                headers: {
                    fSessionId: sessionId,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.data || response.data.result !== 1) {
            throw new Error(response.data?.message || "Focus8 Tax Master update failed");
        }

        return response.data;

    } catch (err) {
        console.error("Tax Master Update Error:", err.response?.data || err.message);
        throw err;
    }
};

const deleteTaxMaster = async (payload) => {
    try {
        const loginRes = await loginToFocus8();
        const sessionId = loginRes?.data?.[0]?.fSessionId;

        if (!sessionId) {
            throw new Error("Unable to obtain Focus8 session ID for tax master deletion");
        }

        const response = await axiosFocus.post(
            "/Focus8API/Masters/Core__TaxMaster",
            payload,
            {
                headers: {
                    fSessionId: sessionId,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.data || response.data.result !== 1) {
            throw new Error(response.data?.message || "Focus8 Tax Master deletion failed");
        }

        return response.data;

    } catch (err) {
        console.error("Tax Master Delete Error:", err.response?.data || err.message);
        throw err;
    }
};

module.exports = {
    getTaxMasters,
    createTaxMaster,
    updateTaxMaster,
    deleteTaxMaster
};
