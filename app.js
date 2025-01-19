const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
require("dotenv").config();

const userRoutes = require("./src/routes/userRoutes");
const customisedCVRoutes = require("./src/routes/customisedCVRoutes");
const jobListingRoutes = require("./src/routes/jobListingRoutes");

const connectDB = require("./src/config/db");

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/customisedcvs", customisedCVRoutes);
app.use("/joblistings", jobListingRoutes);

// Export the app wrapped with serverless-http
module.exports.handler = serverless(app);
