const { updateAllAccountsIsPostedNo } = require('../../services/focus8/focus8Service');

const updateAccounts = async (req, res) => {
  // Start the update process in the background
  updateAllAccountsIsPostedNo()
    .then((result) => {
      console.log("Backgroud Account Update Completed:", result);
    })
    .catch((error) => {
      console.error("Background Account Update Failed:", error);
    });

  // Return immediate response
  return res.status(202).json({
    success: true,
    message: "Account update process started in the background. Check server logs for progress."
  });
};

module.exports = { updateAccounts };  