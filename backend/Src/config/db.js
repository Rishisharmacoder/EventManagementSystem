const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose.connect(process.env.DB_CONNECT_STRING);
    // console.log("MongoDB Connected");
  } catch (err) {
    console.log("MongoDB Error:" + err);
  }
}

module.exports = main;
