const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path"); // Import the path module

const userRoutes = require("./src/routes/userRoutes");
const customisedCVRoutes = require("./src/routes/customisedCVRoutes");
const jobListingRoutes = require("./src/routes/jobListingRoutes");
const newsletterSignupRoutes = require("./src/routes/newsletterSignupRoutes");

const connectDB = require("./src/config/db");

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Express on Vercel"));

// Download CV route
app.get("/download-cv", (req, res) => {
  // Path to the generated CV PDF file
  const filePath = path.join(__dirname, "generated_cv.pdf");

  // Send the PDF as a download response
  res.download(filePath, "GeneratedCV.pdf", (err) => {
    if (err) {
      console.error("File download error:", err);
      res.status(500).send("Error downloading the file");
    }
  });
});

// Routes
app.use("/users", userRoutes);
app.use("/customisedcvs", customisedCVRoutes);
app.use("/joblistings", jobListingRoutes);
app.use("/newslettersignups", newsletterSignupRoutes);

// Set the port, using the environment variable if available (for Elastic Beanstalk compatibility)
const PORT = process.env.PORT || 8000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
