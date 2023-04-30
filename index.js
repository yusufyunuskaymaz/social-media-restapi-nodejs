const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB !"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));


app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

app.get("/",(req,res)=>{
    res.send("welcome to main page")
})

app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)


app.listen(8800, () => {
  console.log("Backend is running");
});
