const { updateAllAccountsIsPostedNo, updateAllProductsIsPostedNo } = require('../../services/focus8/focus8BulkService');

const updateAccounts = async (req, res) => {
  updateAllAccountsIsPostedNo()
    .then((result) => {
      console.log("Backgroud Account Update Completed:", result);
    })
    .catch((error) => {
      console.error("Background Account Update Failed:", error);
    });

  return res.status(202).json({
    success: true,
    message: "Account update process started in the background. Check server logs for progress."
  });
};

const updateProducts = async (req, res) => {
  updateAllProductsIsPostedNo()
    .then((result) => {
      console.log("Background Product Update Completed:", result);
    })
    .catch((error) => {
      console.error("Background Product Update Failed:", error);
    });

  return res.status(202).json({
    success: true,
    message: "Product IsPosted reset (to No) started in background."
  });
};

module.exports = { updateAccounts, updateProducts };  