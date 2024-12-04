const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const Admin = require("../Model/Admin");

exports.isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Your are not logged in!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = await Admin.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Token expired or invalid",
    });
  }
});
