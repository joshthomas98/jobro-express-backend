const express = require("express");
const cors = require("cors");
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

app.get("/", (req, res) => res.send("Express on Vercel"));

// Routes
app.use("/users", userRoutes);
app.use("/customisedcvs", customisedCVRoutes);
app.use("/joblistings", jobListingRoutes);

// Set the port, using the environment variable if available (for Elastic Beanstalk compatibility)
const PORT = process.env.PORT || 8000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
