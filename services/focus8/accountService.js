const { focus8List, loginToFocus8, axiosFocus } = require("./focus8Client");

/*=========================================
            ACCOUNT MASTER SERVICE         
=========================================*/
const getAccounts = async () =>
    focus8List("Focus8API/List/Masters/Core__Account?fields=IsPosted,sCode,sName,iAccountType,iStatus,iMasterId,iCreditDays,Branch");

const createAccountMaster = async (payload) => {
    try {
        const loginRes = await loginToFocus8();
        const sessionId = loginRes?.data?.[0]?.fSessionId;

        if (!sessionId) {
            throw new Error("Unable to obtain Focus8 session ID for account creation");
        }

        const response = await axiosFocus.post(
            "/Focus8API/Masters/Core__Account",
            payload,
            {
                headers: {
                    fSessionId: sessionId,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.data || response.data.result !== 1) {
            throw new Error(response.data?.message || "Focus8 Account creation failed");
        }

        return response.data;

    } catch (err) {
        console.error("Account Create Error:", err.response?.data || err.message);
        throw err;
    }
};

const updateAccountMaster = async (payload) => {
    try {
        const loginRes = await loginToFocus8();
        const sessionId = loginRes?.data?.[0]?.fSessionId;

        if (!sessionId) {
            throw new Error("Unable to obtain Focus8 session ID for account update");
        }

        const response = await axiosFocus.post(
            "/Focus8API/Masters/Core__Account",
            payload,
            {
                headers: {
                    fSessionId: sessionId,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.data || response.data.result !== 1) {
            throw new Error(response.data?.message || "Focus8 Account update failed");
        }

        return response.data;

    } catch (err) {
        console.error("Account Update Error:", err.response?.data || err.message);
        throw err;
    }
};

const deleteAccountMaster = async (payload) => {
    try {
        const loginRes = await loginToFocus8();
        const sessionId = loginRes?.data?.[0]?.fSessionId;

        if (!sessionId) {
            throw new Error("Unable to obtain Focus8 session ID for account deletion");
        }

        const response = await axiosFocus.post(
            "/Focus8API/Masters/Core__Account",
            payload,
            {
                headers: {
                    fSessionId: sessionId,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.data || response.data.result !== 1) {
            throw new Error(response.data?.message || "Focus8 Account deletion failed");
        }

        return response.data;

    } catch (err) {
        console.error("Account Delete Error:", err.response?.data || err.message);
        throw err;
    }
};

module.exports = {
    getAccounts,
    createAccountMaster,
    updateAccountMaster,
    deleteAccountMaster
};
