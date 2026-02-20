const axios = require("axios");
const https = require("https");

const BASE_URL = process.env.FOCUS8_BASE_URL;

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    keepAlive: true,
    checkServerIdentity: () => undefined
});

const axiosFocus = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
    httpsAgent: httpsAgent,
    proxy: false,
    maxRedirects: 0,
    validateStatus: (status) => status >= 200 && status < 400,
    headers: {
        "Content-Type": "application/json"
    }
});

/* ======================================================
    FOCUS 8 LOGIN - RETURNS SESSION ID
====================================================== */

const loginToFocus8 = async (credentials) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    try { require("https").globalAgent.options.rejectUnauthorized = false; } catch (e) { }

    const username = credentials?.username || process.env.FOCUS8_USERNAME;
    const password = credentials?.password || process.env.FOCUS8_PASSWORD;
    const companyId = credentials?.companyId || process.env.FOCUS8_COMPANY;

    console.log(`[Focus8] Attempting login to ${BASE_URL}/Focus8API/login for company ${companyId}`);

    const response = await axiosFocus.post("/Focus8API/login", {
        data: [
            {
                Username: username,
                password: password,
                CompanyId: companyId
            }
        ],
        result: 1,
        message: ""
    }, {
        timeout: 20000,
        httpsAgent
    });

    const loginData = response.data;
    const sessionId = loginData?.data?.[0]?.fSessionId;
    console.log(`[Focus8] Login response received. SessionId present: ${!!sessionId}`);

    if (!sessionId) throw new Error("Focus8 login failed: No Session ID returned");

    return loginData;
};

/* ======================================================
    FOCUS 8 GENERIC LIST FETCHER
====================================================== */

const focus8List = async (endpoint) => {
    const loginRes = await loginToFocus8();
    const sessionId = loginRes.data[0].fSessionId;

    const response = await axiosFocus.get(endpoint, {
        headers: { fSessionId: sessionId }
    });

    if (response.data?.result === 1) return response.data.data || [];
    if (!("result" in response.data) || response.data.result === 0) return response.data;

    throw new Error(response.data?.message || "Focus8 API failed");
};

module.exports = {
    axiosFocus,
    BASE_URL,
    loginToFocus8,
    focus8List
};
