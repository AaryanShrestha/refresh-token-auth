const { JsonWebTokenError } = require("jsonwebtoken");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Admin = require("../Model/Admin");
const jwt = require("jsonwebtoken");

exports.refreshToken = catchAsyncErrors(async (req, res, next) => {
  if (!req.cookies.refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }
  const refreshToken = req.cookies.refreshToken;
  const admin = await Admin.findOne({ refreshToken });
  if (!admin) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid refresh token" });
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Generate new tokens
    const accessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const newRefreshToken = jwt.sign(
      { id: admin._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "14d",
      }
    );

    await Admin.findOneAndUpdate(
      { refreshToken: refreshToken },
      {
        refreshToken: newRefreshToken,
      }
    );

    // Send tokens
    res
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 14 * 24 * 60 * 60 * 1000,
      })
      .json({ success: true, accessToken });
  } catch (error) {
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }
});
