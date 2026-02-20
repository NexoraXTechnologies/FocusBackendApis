const { focus8List } = require("./focus8Client");
const mongoose = require("mongoose");

const getCompanies = async () =>
    focus8List("/Focus8API/List/Company");

const getAccounts = async () =>
    focus8List("/Focus8API/List/Masters/Core__Account");

const getProducts = async () =>
    focus8List("/Focus8API/List/Masters/Core__Product?fields=sCode,sName,iProductType,iDefaultBaseUnit__Id");

const getTaxMasters = async () =>
    focus8List("/Focus8API/List/Masters/Core__TaxMaster");

const fetchProductsFromFocus8 = async () =>
    focus8List("/Focus8API/List/Masters/Core__Product?fields=sCode,sName,iMasterId,IsPosted");

const fetchAndStoreProducts = async () => {
    const products = await fetchProductsFromFocus8();

    if (products && products.length > 0) {
        const collection = mongoose.connection.collection("focus8_products");
        await collection.insertMany(products);
        return { success: true, count: products.length };
    }

    return { success: true, count: 0 };
};

module.exports = {
    getCompanies,
    getAccounts,
    getProducts,
    getTaxMasters,
    fetchProductsFromFocus8,
    fetchAndStoreProducts
};
