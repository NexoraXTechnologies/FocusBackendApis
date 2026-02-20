const mongoose = require('mongoose');
const axios = require('axios');
const { loginToFocus8 } = require('./focus8Client');
const { fetchProductsFromFocus8 } = require('./focus8MasterService');


const BASE_URL = process.env.FOCUS8_BASE_URL;

/**
 * IMPORT: Simple fetch and store all products from Focus 8
 */
const importProductsFromFocus8 = async () => {
  const focusProducts = await fetchProductsFromFocus8();

  if (!focusProducts || !focusProducts.length) {
    return { success: true, message: "No products found in Focus 8", count: 0 };
  }

  const collection = mongoose.connection.collection('focus8_products');

  // Clear existing if needed? Usually additive for sync logs
  await collection.insertMany(focusProducts);

  return {
    success: true,
    count: focusProducts.length,
    message: `Imported ${focusProducts.length} products to local DB.`
  };
};

/**
 * SYNC: Fetch products, update 'IsPosted' status in Focus 8, and store in local DB
 */
const syncProductsFromFocus8 = async () => {
  const focusProducts = await fetchProductsFromFocus8();

  if (!focusProducts || !focusProducts.length) {
    return { success: true, message: "No products found in Focus 8", syncedCount: 0 };
  }

  // Filter products that haven't been posted yet
  const unsynced = focusProducts.filter(p => p.IsPosted === "No" && p.iMasterId);

  if (unsynced.length === 0) {
    return { success: true, message: "No new products to sync", syncedCount: 0 };
  }

  const loginRes = await loginToFocus8();
  const sessionId = loginRes.data[0].fSessionId;
  const headers = {
    'Content-Type': 'application/json',
    fSessionId: sessionId
  };

  // 1. Update Focus 8 database: Set IsPosted to "Yes"
  const BATCH_SIZE = 50;
  for (let i = 0; i < unsynced.length; i += BATCH_SIZE) {
    const batch = unsynced.slice(i, i + BATCH_SIZE);
    const payload = {
      data: batch.map(p => ({
        iMasterId: p.iMasterId,
        sCode: p.sCode,
        IsPosted: "Yes"
      }))
    };

    try {
      await axios.post(`${BASE_URL}/Focus8API/Masters/Core__Product`, payload, { headers, timeout: 60000 });
      console.log(`Updated Focus 8 batch: ${batch.length} products`);
    } catch (error) {
      console.error(`Failed to update Focus 8 batch: ${error.message}`);
    }
  }

  // 2. Add updated products to local MongoDB
  const collection = mongoose.connection.collection('focus8_products');
  const productsToStore = unsynced.map(p => ({
    ...p,
    IsPosted: "Yes", // Reflecting the updated status in Mongo
    syncedAt: new Date()
  }));

  if (productsToStore.length > 0) {
    await collection.insertMany(productsToStore);
  }

  return {
    success: true,
    syncedCount: unsynced.length,
    message: `Successfully synced ${unsynced.length} products to both Focus 8 and local DB.`
  };
};

module.exports = {
  importProductsFromFocus8,
  syncProductsFromFocus8
};