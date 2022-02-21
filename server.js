// require packages
const express = require("express");
const mongoose = require("mongoose");
require("colors");
require("dotenv").config();

// declare variables
const app = express();
const port = process.env.PORT;
const mongo_uri = process.env.MONGO_URI;
const cookieParser = require("cookie-parser");

// import routes
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");

// Connect app to mongoDB using mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(mongo_uri);
    console.log("connected to mongoDB database".cyan.bold.underline);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);

// Call the function to connect to mongoDB
connectDB();

//start the server
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
