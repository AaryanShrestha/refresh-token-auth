const express = require("express");
const {
  adminCreate,
  adminLogin,
  adminGetMe,
  adminLogout,
} = require("../controller/authController");
const { isAdminAuthenticated } = require("../middleware/auth");
const { refreshToken } = require("../controller/tokenRefresh");

const router = express.Router();

router.route("/createAdmin").post(adminCreate);
router.route("/login").post(adminLogin);
router.route("/getme").get(isAdminAuthenticated, adminGetMe);
router.route("/logout").get(isAdminAuthenticated, adminLogout);
router.route("/refresh").get(refreshToken);

module.exports = router;
