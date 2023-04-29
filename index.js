const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB !"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));
app.listen(8800, () => {
  console.log("Backend is running");
});
