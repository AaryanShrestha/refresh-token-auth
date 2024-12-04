const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const adminSchema = new mongoose.Schema(
  {
    adminName: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      minLength: 2,
      maxLength: 255,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z\s'.-]+$/.test(v);
        },
        message:
          "Full name can only contain letters, spaces, and the characters . ' -",
      },
    },
    email: {
      type: String,
      required: [true, "Please enter an email address"],
      unique: [true, "Admin with the email already exists."],
      validate: {
        validator: validator.isEmail,
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      select: false,
      validate: {
        validator: validator.isStrongPassword,
        message:
          "Min 8 characters, min 1 lowercase, min 1 uppercase, min 1 number, min 1 symbol",
      },
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now,
    },
    passwordToken: {
      type: String,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

//Encrypting the password before saving it to the database
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = bcrypt.hashSync(this.password, 14);
});

adminSchema.methods.encryptPassword = async function (password) {
  console.log("aaa", password);
  this.password = bcrypt.hash(password, 14);
  console.log(this.password);
};

//Compare User Password
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Return JWT token
adminSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

module.exports = mongoose.model("Admin", adminSchema);
