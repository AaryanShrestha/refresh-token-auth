const express = require("express");
const cors = require("cors");
const app = express();
const errorMiddleware = require("./middleware/errors");
const cookieParser = require("cookie-parser");

var corsOptions = {
  origin: true,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

// Add cookie-parser middleware
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authForAdmin = require("./router/authRouter");

app.use("/adminApi/", authForAdmin);

//Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
