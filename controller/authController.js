const Admin = require("../Model/Admin");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendAdminToken = require("../utils/adminToken");

// Create a new admin  => /api/createAdmin
exports.adminCreate = catchAsyncErrors(async (req, res, next) => {
  const { adminName, email, password, confirmPassword } = req.body;

  const existingAdmin = await Admin.findOne({ email: email });
  if (existingAdmin) {
    return res.status(400).json({
      success: false,
      message: "Admin with the email already exists",
    });
  }

  if (password != confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password and confirm password does not match",
    });
  }

  const admin = await Admin.create({
    adminName,
    email,
    password,
  });
  sendAdminToken(admin, 200, "Admin created successfully", res);
});

exports.adminLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin || !(await admin.comparePassword(password))) {
    // console.log(admin.password);
    // console.log(password);

    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  sendAdminToken(admin, 200, "Admin logged in successfully", res);
});

// Gives admin profile
exports.adminGetMe = catchAsyncErrors(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id);

  res.status(200).json({
    success: true,
    admin: admin,
  });
});

exports.adminLogout = catchAsyncErrors(async (req, res, next) => {
  const admin = req.admin;
  admin.refreshToken = null; // Clear refresh token from DB
  await admin.save();

  res.cookie("refreshToken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Admin logged out successfully",
  });
});
