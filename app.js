const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const userRoutes = require("./src/routes/userRoutes");
const customisedCVRoutes = require("./src/routes/customisedCVRoutes");
const jobListingRoutes = require("./src/routes/jobListingRoutes");

const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 8000;

// Connect to the database
connectDB();

app.use(cors());

// Middleware
app.use(express.json());

// Routes
// Use routes
app.use("/users", userRoutes);
app.use("/customisedcvs", customisedCVRoutes);
app.use("/joblistings", jobListingRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
