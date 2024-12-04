const jwt = require("jsonwebtoken");
const Admin = require("../Model/Admin");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const sendAdminToken = async (admin, statusCode, message, res) => {
  // Generate tokens
  const accessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(
    { id: admin._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "14d",
    }
  );

  await Admin.findByIdAndUpdate(admin.id, { refreshToken: refreshToken });

  // Options for cookies
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res
    .status(statusCode)
    .cookie("refreshToken", refreshToken, {
      ...options,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      accessToken,
      message,
    });
};
module.exports = sendAdminToken;
