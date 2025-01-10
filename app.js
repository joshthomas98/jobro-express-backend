const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 8000;

// Connect to the database
connectDB();

app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
