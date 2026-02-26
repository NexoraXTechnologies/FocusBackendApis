const { focus8List, loginToFocus8, axiosFocus } = require("./focus8Client");
const mongoose = require("mongoose");

const getProducts = async () => {
    const data = await focus8List("/Focus8API/List/Masters/Core__Product?fields=sCode,sName,IsPosted,iDefaultBaseUnit,iProductType,iMasterId");

    const fgProducts = data.filter(p =>
        p.iProductType &&
        p.iProductType.toLowerCase().includes("finished")
    );

    return fgProducts;
};

const fetchProductsFromFocus8 = async () =>
    focus8List("/Focus8API/List/Masters/Core__Product?fields=sCode,sName,IsPosted,iDefaultBaseUnit,iProductType,iMasterId");

const fetchAndStoreProducts = async () => {
    const products = await fetchProductsFromFocus8();

    if (products && products.length > 0) {
        const collection = mongoose.connection.collection("focus8_products");
        await collection.insertMany(products);
        return { success: true, count: products.length };
    }

    return { success: true, count: 0 };
};

const updateProductMaster = async (payload) => {
    try {
        const loginRes = await loginToFocus8();
        const sessionId = loginRes?.data?.[0]?.fSessionId;

        if (!sessionId) {
            throw new Error("Unable to obtain Focus8 session ID for product update");
        }

        const response = await axiosFocus.post(
            "/Focus8API/Masters/Core__Product",
            payload,
            {
                headers: {
                    fSessionId: sessionId,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.data || response.data.result !== 1) {
            throw new Error(response.data?.message || "Focus8 Product update failed");
        }

        return response.data;

    } catch (err) {
        console.error("Product Update Error:", err.response?.data || err.message);
        throw err;
    }
};

const createProductMaster = async (payload) => {
    try {
        const loginRes = await loginToFocus8();
        const sessionId = loginRes?.data?.[0]?.fSessionId;

        if (!sessionId) {
            throw new Error("Unable to obtain Focus8 session ID for product creation");
        }

        const response = await axiosFocus.post(
            "/Focus8API/Masters/Core__Product",
            payload,
            {
                headers: {
                    fSessionId: sessionId,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.data || response.data.result !== 1) {
            throw new Error(response.data?.message || "Focus8 Product creation failed");
        }

        return response.data;

    } catch (err) {
        console.error("Product Create Error:", err.response?.data || err.message);
        throw err;
    }
};

module.exports = {
    getProducts,
    fetchProductsFromFocus8,
    fetchAndStoreProducts,
    updateProductMaster,
    createProductMaster
};
