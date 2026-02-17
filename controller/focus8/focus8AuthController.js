const { loginToFocus8 } = require('../../services/focus8/focus8Service');
const { ApiResponse, ApiError } = require('../../utils/ResponseHandlers');

/* ======================================================
   LOGIN USER TO FOCUS8
====================================================== */
const loginToFocus8Controller = async (req, res, next) => {
    try {
        const { username, password, companyId } = req.body;

        if (!username || !password || !companyId) {
            throw new ApiError(400, "Username, password, and companyId are required.");
        }

        const sessionId = await loginToFocus8({ username, password, companyId });

        return new ApiResponse({
            message: "Focus8 login successful",
            data: { sessionId }
        }).send(res);

    } catch (err) {
        next(err);
    }
};


module.exports = { loginToFocus8Controller };
