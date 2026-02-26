const { focus8List, loginToFocus8, axiosFocus } = require("./focus8Client");

/*=========================================
            BRANCH MASTER SERVICE         
=========================================*/
const getBranch = async () =>
    focus8List("/Focus8API/List/Masters/Core__Branch");

const createBranch = async (payload) => {
    try {
        const loginRes = await loginToFocus8();
        const sessionId = loginRes?.data?.[0]?.fSessionId;

        if (!sessionId) {
            throw new Error("Unable to obtain Focus8 session ID for branch creation");
        }

        const response = await axiosFocus.post(
            "/Focus8API/Masters/Core__Branch",
            payload,
            {
                headers: {
                    fSessionId: sessionId,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.data || response.data.result !== 1) {
            throw new Error(response.data?.message || "Focus8 Branch creation failed");
        }

        return response.data;

    } catch (err) {
        console.error("Branch Create Error:", err.response?.data || err.message);
        throw err;
    }
};

const updateBranch = async (payload) => {
    try {
        const loginRes = await loginToFocus8();
        const sessionId = loginRes?.data?.[0]?.fSessionId;

        if (!sessionId) {
            throw new Error("Unable to obtain Focus8 session ID for branch update");
        }

        const response = await axiosFocus.post(
            "/Focus8API/Masters/Core__Branch",
            payload,
            {
                headers: {
                    fSessionId: sessionId,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.data || response.data.result !== 1) {
            throw new Error(response.data?.message || "Focus8 Branch update failed");
        }

        return response.data;

    } catch (err) {
        console.error("Branch Update Error:", err.response?.data || err.message);
        throw err;
    }
};

const deleteBranch = async (payload) => {
    try {
        const loginRes = await loginToFocus8();
        const sessionId = loginRes?.data?.[0]?.fSessionId;

        if (!sessionId) {
            throw new Error("Unable to obtain Focus8 session ID for branch deletion");
        }

        const response = await axiosFocus.post(
            "/Focus8API/Masters/Core__Branch",
            payload,
            {
                headers: {
                    fSessionId: sessionId,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.data || response.data.result !== 1) {
            throw new Error(response.data?.message || "Focus8 Branch deletion failed");
        }

        return response.data;

    } catch (err) {
        console.error("Branch Delete Error:", err.response?.data || err.message);
        throw err;
    }
};

module.exports = {
    getBranch,
    createBranch,
    updateBranch,
    deleteBranch
};
