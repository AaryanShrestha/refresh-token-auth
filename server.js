const app = require("./app");
const connectDatabase = require("./config/databaseConfig");
const dotenv = require("dotenv");

//Handling uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("Error", err.stack);
  console.log("Uncaught Exception. Shutting down...");
  process.exit(1);
});

//Setting Config File
dotenv.config({ path: "config/config.env" });

// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is working on ` +
      process.env.LOCALHOST_URL +
      process.env.PORT +
      ` in ` +
      process.env.NODE_ENV +
      ` mode.`
  );
});

//Handle unhandled promise rejections'
process.on("unhandledRejection", (err) => {
  console.log("Error:", err.message);
  console.log("Unhandled promise rejection. Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
