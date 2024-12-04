const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
// mongoose.set("debug", true);

const connectDatabase = async () => {
  mongoose.connect(process.env.DB_LOCAL_URL).then((con) => {
    console.log(
      `MongoDB connected with HOST: ${con.connection.host} and PORT: ${con.connection.port}`
    );
  });
};

module.exports = connectDatabase;
