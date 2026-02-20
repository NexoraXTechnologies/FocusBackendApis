const { axiosFocus, loginToFocus8 } = require("./focus8Client");

/* ======================================================
    BULK UPDATE FOCUS 8 MASTERS TO SET ISPOSTED TO NO
====================================================== */

const updateAllAccountsIsPostedNo = async () => {
    const loginRes = await loginToFocus8();
    const sessionId = loginRes.data[0].fSessionId;
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

        if (i > 0 && i % 500 === 0) {
            const lr = await loginToFocus8();
            headers.fSessionId = lr.data[0].fSessionId;
        }
    }

    return { success: true, message: `Updated ${updatedCount} accounts.` };
};

/* ======================================================
    BULK UPDATE FOCUS 8 PRODUCTS TO SET ISPOSTED TO NO
====================================================== */

const updateAllProductsIsPostedNo = async () => {
    const loginRes = await loginToFocus8();
    const sessionId = loginRes.data[0].fSessionId;
    const headers = {
        fSessionId: sessionId,
        "Content-Type": "application/json"
    };

    console.log("[Focus8] Fetching products to reset IsPosted to No...");
    const listRes = await axiosFocus.get(
        "/Focus8API/List/Masters/Core__Product?fields=IsPosted,iMasterId,sCode",
        { headers }
    );

    if (listRes.data?.result !== 1) {
        console.error("[Focus8] Failed to fetch products:", listRes.data?.message);
        throw new Error("Failed to fetch products");
    }

    const products = listRes.data.data || [];
    const toUpdate = products.filter((p) => p.IsPosted === "Yes" && p.iMasterId);

    console.log(`[Focus8] Found ${toUpdate.length} products with IsPosted=Yes. Starting batch update...`);

    const batchSize = 100;
    let updatedCount = 0;

    for (let i = 0; i < toUpdate.length; i += batchSize) {
        const batch = toUpdate.slice(i, i + batchSize);
        const payload = {
            data: batch.map((p) => ({
                iMasterId: p.iMasterId,
                sCode: p.sCode,
                IsPosted: "No"
            }))
        };

        try {
            const res = await axiosFocus.post("/Focus8API/Masters/Core__Product", payload, { headers, timeout: 120000 });
            if (res.data?.result === 1) {
                updatedCount += batch.length;
                console.log(`[Focus8] Reset batch ${Math.floor(i / batchSize) + 1} (${batch.length} products)`);
            } else {
                console.warn(`[Focus8] Warning in batch reset: ${res.data?.message}`);
            }
        } catch (error) {
            console.error(`[Focus8] Batch reset failed at index ${i}:`, error.message);
        }

        if (i > 0 && i % 500 === 0) {
            console.log("[Focus8] Refreshing session for large update...");
            const lr = await loginToFocus8();
            headers.fSessionId = lr.data[0].fSessionId;
        }
    }

    console.log(`[Focus8] Completed resetting ${updatedCount} products.`);
    return { success: true, message: `Updated ${updatedCount} products to IsPosted=No.` };
};

module.exports = {
    updateAllAccountsIsPostedNo,
    updateAllProductsIsPostedNo
};
