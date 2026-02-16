const axios = require('axios');

const BASE_URL = process.env.FOCUS8_BASE_URL;

/* ======================================================
   LOGIN TO FOCUS8
====================================================== */
const loginToFocus8 = async () => {
  const response = await axios.post(
    `${BASE_URL}/focus8api/login`,
    {
      data: [
        {
          Username: process.env.FOCUS8_USERNAME,
          password: process.env.FOCUS8_PASSWORD,
          CompanyId: process.env.FOCUS8_COMPANY
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
  return await focus8List('/Focus8API/List/Masters/Core__Product?fields=sCode,sName,Status');
};

/* ======================================================
   PAYMENTS
====================================================== */
const getPayments = async () => {
  return await focus8List(
    '/Focus8API/List/Transactions/Payments'
  );
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



module.exports = {
  loginToFocus8,
  getPayments,
  getPaymentByDocNo,
  fetchProductsFromFocus8,
  updateAllAccountsIsPostedNo
};