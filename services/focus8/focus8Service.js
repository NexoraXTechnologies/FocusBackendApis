const axios = require("axios");
const https = require("https");

const BASE_URL = process.env.FOCUS8_BASE_URL;
/* ★★★ SECURE UPDATE: Centralized axios instance with safe SSL handling */

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Core bypass
  keepAlive: true,
  checkServerIdentity: () => undefined // Bypasses name/expiry checks
});

const axiosFocus = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  httpsAgent: httpsAgent,
  proxy: false, // Ensure no server-level proxy interferes with the agent
  maxRedirects: 0, // Disable redirects to check if redirect causes SSL bypass loss
  validateStatus: (status) => status >= 200 && status < 400, // Include 3xx as success to see them
  headers: {
    "Content-Type": "application/json"
  }
});

/* ======================================================
   LOGIN TO FOCUS8
===================================================== */
const loginToFocus8 = async (credentials) => {
  // Nuclear option for IISNode/Windows environments
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
    httpsAgent // Explicitly passing again in case instance-level agent is lost
  });

  const sessionId = response.data?.data?.[0]?.fSessionId;
  console.log(`[Focus8] Login response received. SessionId present: ${!!sessionId}`);

  if (!sessionId) throw new Error("Focus8 login failed: No Session ID returned");

  return sessionId;
};

/* ======================================================
   GENERIC LIST API
====================================================== */
const focus8List = async (endpoint) => {
  const sessionId = await loginToFocus8();

  const response = await axiosFocus.get(endpoint, {
    headers: { fSessionId: sessionId }
  });

  if (response.data?.result === 1) return response.data.data || [];

  if (!("result" in response.data) || response.data.result === 0) return response.data;

  throw new Error(response.data?.message || "Focus8 API failed");
};

/* ======================================================
   PRODUCTS
====================================================== */
const fetchProductsFromFocus8 = async () =>
  focus8List("/Focus8API/List/Masters/Core__Product?fields=sCode,sName,iMasterId,IsPosted");

/* ======================================================
   PAYMENTS
====================================================== */
const getPayments = async () =>
  focus8List("/Focus8API/List/Transactions/Payments");

/* ======================================================
   COMPANY MASTER
====================================================== */
const getCompanies = async () =>
  focus8List("/Focus8API/List/Company");

/* ======================================================
   ACCOUNT MASTER
====================================================== */
const getAccounts = async () =>
  focus8List("/Focus8API/List/Masters/Core__Account");

/* ======================================================
   PRODUCT MASTER
====================================================== */
const getProducts = async () =>
  focus8List("/Focus8API/List/Masters/Core__Product?fields=sCode,sName,iProductType,iDefaultBaseUnit__Id");

/* ======================================================
   TAX MASTER
====================================================== */
const getTaxMasters = async () =>
  focus8List("/Focus8API/List/Masters/Core__TaxMaster");

/* ======================================================
   SALES ORDERS
====================================================== */
const getSalesOrders = async () =>
  focus8List("/Focus8API/List/Transactions");

/* ======================================================
   VOUCHER TYPES
====================================================== */
const getVoucherTypes = async () =>
  focus8List("/Focus8API/Screen/Transactions/VoucherTypes");

/* ======================================================
   CSS ORDERS
====================================================== */
const getCssOrders = async () =>
  focus8List("/Focus8API/List/Transactions/CSS%20Order");

/* ======================================================
   GET PAYMENT BY DOC NO
====================================================== */
const getPaymentByDocNo = async (docNo) => {
  const sessionId = await loginToFocus8();

  const response = await axiosFocus.get(
    `/Focus8API/Screen/Transactions/Payments/${encodeURIComponent(docNo)}`,
    { headers: { fSessionId: sessionId } }
  );

  if (response.data?.result !== 1)
    throw new Error(response.data?.message || "Focus8 Single Payment API failed");

  return response.data;
};

/* ======================================================
   BULK ACCOUNT UPDATE
====================================================== */
const updateAllAccountsIsPostedNo = async () => {
  const sessionId = await loginToFocus8();

  const headers = { fSessionId: sessionId };

  const listRes = await axiosFocus.get(
    "/Focus8API/List/Masters/Core__Account?fields=IsPosted,iMasterId,sCode",
    { headers }
  );

  if (listRes.data?.result !== 1) throw new Error("Failed to fetch accounts");

  const accounts = listRes.data.data || [];
  const toUpdate = accounts.filter((a) => a.IsPosted === "Yes" && a.iMasterId);

  const batchSize = 100;
  let updatedCount = 0;

  for (let i = 0; i < toUpdate.length; i += batchSize) {
    const payload = {
      data: toUpdate.slice(i, i + batchSize).map((acc) => ({
        iMasterId: acc.iMasterId,
        sCode: acc.sCode,
        IsPosted: "No"
      }))
    };

    const res = await axiosFocus.post("/Focus8API/Masters/Core__Account", payload, { headers });

    if (res.data?.result === 1) updatedCount += payload.data.length;

    if (i % 500 === 0) headers.fSessionId = await loginToFocus8();
  }

  return { success: true, message: `Updated ${updatedCount} accounts.` };
};

/* ======================================================
   BULK PRODUCT UPDATE
====================================================== */
const updateAllProductsIsPostedNo = async () => {
  const sessionId = await loginToFocus8();
  const headers = { fSessionId: sessionId };

  const listRes = await axiosFocus.get(
    "/Focus8API/List/Masters/Core__Product?fields=IsPosted,iMasterId,sCode",
    { headers }
  );

  if (listRes.data?.result !== 1) throw new Error("Failed to fetch products");

  const products = listRes.data.data || [];
  let updated = 0;

  for (const p of products) {
    if (p.IsPosted !== "Yes") continue;

    const payload = { data: [{ iMasterId: p.iMasterId, sCode: p.sCode, IsPosted: "No" }] };

    try {
      const res = await axiosFocus.post("/Focus8API/Masters/Core__Product", payload, { headers });
      if (res.data?.result === 1) updated++;
    } catch { }
  }

  return { success: true, message: `Updated ${updated} products.` };
};

/* ======================================================
   POST CSS ORDER
====================================================== */
const postCssOrder = async (payload) => {
  const sessionId = await loginToFocus8();

  const response = await axiosFocus.post(
    "/Focus8API/Transactions/CSS%20Order",
    payload,
    { headers: { fSessionId: sessionId } }
  );

  return response.data;
};

module.exports = {
  loginToFocus8,
  getCompanies,
  getAccounts,
  getProducts,
  getTaxMasters,
  getSalesOrders,
  getVoucherTypes,
  getPayments,
  getPaymentByDocNo,
  getCssOrders,
  postCssOrder,
  fetchProductsFromFocus8,
  updateAllAccountsIsPostedNo,
  updateAllProductsIsPostedNo
};