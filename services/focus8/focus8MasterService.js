const { focus8List } = require("./focus8Client");
const mongoose = require("mongoose");

const getAccounts = async () =>
    focus8List("Focus8API/List/Masters/Core__Account?fields=IsPosted,sCode,sName,iAccountType");

const getProducts = async () => {
    const data = await focus8List("/Focus8API/List/Masters/Core__Product?fields=sCode,sName,IsPosted,iDefaultBaseUnit,iProductType");
    
    const fgProducts = data.filter(p =>
        p.iProductType &&
        p.iProductType.toLowerCase().includes("finished")
    );
    
    return fgProducts;
};

const getTaxMasters = async () =>
    focus8List("/Focus8API/List/Masters/Core__TaxMaster?fields=sCode,sName");

const getBranch = async () =>
    focus8List("/Focus8API/List/Masters/Core__Branch");

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
    getAccounts,
    getProducts,
    getTaxMasters,
    getBranch,
    fetchProductsFromFocus8,
    fetchAndStoreProducts
};
