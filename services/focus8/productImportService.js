const mongoose = require('mongoose');
const axios = require('axios');
const { fetchProductsFromFocus8, loginToFocus8 } = require('./focus8Service');


const BASE_URL = process.env.FOCUS8_BASE_URL;

const syncProductsFromFocus8 = async () => {

  const focusProducts = await fetchProductsFromFocus8();

  if (!focusProducts.length) {
    return { added: 0, markedPosted: 0 };
  }

  const unsynced = focusProducts.filter(
    p => p.IsPosted === "No" && p.sCode && p.iMasterId
  );

  if (!unsynced.length) {
    return { added: 0, markedPosted: 0 };
  }

  const collection = mongoose.connection.collection('focus8_products');


  const existing = await collection.find({}, { projection: { sCode: 1 } }).toArray();
  const existingCodes = new Set(existing.map(p => p.sCode));


  const newProducts = unsynced.filter(p => !existingCodes.has(p.sCode));


  if (newProducts.length) {
    await collection.insertMany(newProducts);
  }

  const sessionId = await loginToFocus8();

  const headers = {
    'Content-Type': 'application/json',
    fSessionId: sessionId
  };

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
      await axios.post(
        `${BASE_URL}/Focus8API/Masters/Core__Product`,
        payload,
        { headers, timeout: 120000 }
      );
      console.log(`Synced batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} products`);
    } catch (error) {
      console.error(`Failed to sync batch starting at index ${i}:`, error.message);
    }
  }

  return {
    added: newProducts.length,
    markedPosted: unsynced.length
  };
};

module.exports = { syncProductsFromFocus8 };