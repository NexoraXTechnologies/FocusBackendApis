const axios = require('axios');

const BASE_URL = process.env.FOCUS8_BASE_URL;

/* ======================================================
   LOGIN TO FOCUS8
==========================================array.forEach(element => {
  
});=========== */
const loginToFocus8 = async (credentials) => {
  const username = credentials?.username || process.env.FOCUS8_USERNAME;
  const password = credentials?.password || process.env.FOCUS8_PASSWORD;
  const companyId = credentials?.companyId || process.env.FOCUS8_COMPANY;

  const response = await axios.post(
    `${BASE_URL}/focus8api/login`,
    {
      data: [
        {
          Username: username,
          password: password,
          CompanyId: companyId
        }
      ],
      result: 1,
      message: ""
    },
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );

  if (!response.data?.data?.[0]?.fSessionId) {
    throw new Error('Focus8 login failed');
  }

  return response.data.data[0].fSessionId;
};


/* ======================================================
   GENERIC GET LIST API
====================================================== */
const focus8List = async (endpoint) => {
  const sessionId = await loginToFocus8();

  const response = await axios.get(
    `${BASE_URL}${endpoint}`,
    {
      headers: {
        'Content-Type': 'application/json',
        fSessionId: sessionId
      }
    }
  );

  if (response.data?.result !== 1) {
    throw new Error(response.data?.message || 'Focus8 API failed');
  }

  return response.data.data || [];
};

/* ======================================================
   PRODUCTS
====================================================== */
const fetchProductsFromFocus8 = async () => {
  return await focus8List('/Focus8API/List/Masters/Core__Product?fields=sCode,sName,iMasterId,IsPosted');
};

/* ======================================================
   PAYMENTS
====================================================== */
const getPayments = async () => {
  return await focus8List(
    '/Focus8API/List/Transactions/Payments'
  );
};

/* ======================================================
   List Of Company Master
====================================================== */
const getCompanies = async () => {
  return await focus8List('/Focus8API/List/Company');
};

/* ======================================================
   List Of Account Master
====================================================== */
const getAccounts = async () => {
  return await focus8List('/Focus8API/List/Masters/Core__Account');
};

/* ======================================================
   PRODUCT MASTER
====================================================== */
const getProducts = async () => {
  return await focus8List('/Focus8API/List/Masters/Core__Product');
};

/* ======================================================
   TAX MASTER
====================================================== */
const getTaxMasters = async () => {
  return await focus8List('/Focus8API/List/Masters/Core__TaxMaster');
};

const getPaymentByDocNo = async (docNo) => {
  const sessionId = await loginToFocus8();
  // URL-encode the docNo to handle special characters like slashes (e.g. 25-26/ABPI/6250)
  const encodedDocNo = encodeURIComponent(docNo);
  const response = await axios.get(
    `${BASE_URL}/Focus8API/Screen/Transactions/Payments/${encodedDocNo}`,
    {
      headers: {
        'Content-Type': 'application/json',
        fSessionId: sessionId
      }
    }
  );

  if (response.data?.result !== 1) {
    throw new Error(response.data?.message || 'Focus8 Single Payment API failed');
  }

  return response.data;
};


/* ======================================================
   FAST BULK UPDATE → SET IsPosted = "No"
====================================================== */
const updateAllAccountsIsPostedNo = async () => {
  const sessionId = await loginToFocus8();

  const headers = {
    'Content-Type': 'application/json',
    fSessionId: sessionId
  };

  console.log("Fetching account list...");

  // Step 1: Fetch all accounts WITH masterId
  const listRes = await axios.get(
    `${BASE_URL}/Focus8API/List/Masters/Core__Account?fields=IsPosted,iMasterId,sCode`,
    { headers }
  );

  if (listRes.data?.result !== 1) {
    throw new Error(listRes.data?.message || 'Failed to fetch accounts');
  }

  const accounts = listRes.data.data || [];

  console.log("Total Accounts:", accounts.length);

  // Step 2: Filter only IsPosted = Yes
  const toUpdate = accounts.filter(a => a.IsPosted === "Yes" && a.iMasterId);

  console.log("Records needing update:", toUpdate.length);

  if (toUpdate.length === 0) {
    return { success: true, message: "No records to update." };
  }

  // Step 3: Prepare batch updates
  const batchSize = 100;
  let updatedCount = 0;

  for (let i = 0; i < toUpdate.length; i += batchSize) {
    const batch = toUpdate.slice(i, i + batchSize);

    console.log(`Updating batch ${i / batchSize + 1}...`);

    // Step 4: Prepare payload
    const payload = {
      data: batch.map(acc => ({
        iMasterId: acc.iMasterId,
        sCode: acc.sCode,
        IsPosted: "No"
      }))
    };

    // Step 5: Call bulk update API
    const updateRes = await axios.post(
      `${BASE_URL}/Focus8API/Masters/Core__Account`,
      payload,
      { headers, timeout: 300000 }
    );

    if (updateRes.data?.result === 1) {
      updatedCount += batch.length;
      console.log(`Batch updated: ${batch.length}`);

    } else {
      console.warn("Batch failed:", updateRes.data?.message);
    }

    // Refresh session every few batches
    if ((i / batchSize) % 5 === 0) {
      headers.fSessionId = await loginToFocus8();
    }
  }

  return {
    success: true,
    message: `Bulk update completed. Updated ${updatedCount} records.`
  };
};

/* ======================================================
   FAST BULK UPDATE PRODUCT → SET IsPosted = "No"
====================================================== */
const updateAllProductsIsPostedNo = async () => {
  const sessionId = await loginToFocus8();

  const headers = {
    'Content-Type': 'application/json',
    fSessionId: sessionId
  };

  console.log("Fetching product list...");

  // Step 1: Fetch all products WITH masterId
  const listRes = await axios.get(
    `${BASE_URL}/Focus8API/List/Masters/Core__Product?fields=IsPosted,iMasterId,sCode,sName`,
    { headers }
  );

  if (listRes.data?.result !== 1) {
    throw new Error(listRes.data?.message || 'Failed to fetch products');
  }

  const products = listRes.data.data || [];

  console.log("Total Products:", products.length);

  // Step 2: Filter only IsPosted = Yes
  const toUpdate = products.filter(p => p.IsPosted === "Yes" && p.iMasterId);

  console.log("Products needing update:", toUpdate.length);

  // Step 3: Iterate one by one to handle stuck records
  // We use batchSize = 1 and a short timeout to skip problematic records quickly
  const batchSize = 1;
  let updatedCount = 0;
  let failedCount = 0;

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  for (let i = 0; i < toUpdate.length; i += batchSize) {
    const batch = toUpdate.slice(i, i + batchSize);
    const item = batch[0]; // Single item

    console.log(`Updating product ${i + 1}/${toUpdate.length}: ${item.sCode} (${item.iMasterId})...`);

    // Payload with all fields to satisfy "Mandatory" checks, but prevent "Unique" checks if possible
    // Note: If "Code Is Unique" error persists, this record might be a duplicate in Focus8
    const payload = {
      data: [{
        iMasterId: item.iMasterId,
        sCode: item.sCode,
        sName: item.sName,
        IsPosted: "No"
      }]
    };

    try {
      const updateRes = await axios.post(
        `${BASE_URL}/Focus8API/Masters/Core__Product`,
        payload,
        {
          headers,
          // Short timeout (10s) to avoid hanging on locked records
          timeout: 10000
        }
      );

      if (updateRes.data?.result === 1) {
        updatedCount++;
        console.log(`✔ Success: ${item.sCode}`);
      } else {
        failedCount++;
        console.warn(`✖ Failed: ${item.sCode} - ${updateRes.data?.message}`);
      }

    } catch (err) {
      failedCount++;
      console.error(`✖ Error for ${item.sCode}: ${err.message}`);
    }

    // Small delay between requests
    await sleep(500);

    // Refresh session every 20 items
    if (i > 0 && i % 20 === 0) {
      headers.fSessionId = await loginToFocus8();
    }
  }

  return {
    success: true,
    message: `Bulk product update completed. Updated ${updatedCount} products.`
  };
};

module.exports = {
  loginToFocus8,
  getCompanies,
  getAccounts,
  getProducts,
  getTaxMasters,
  getPayments,
  getPaymentByDocNo,
  fetchProductsFromFocus8,
  updateAllAccountsIsPostedNo,
  updateAllProductsIsPostedNo
};