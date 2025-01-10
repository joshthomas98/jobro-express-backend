const mongoose = require("mongoose");

const JobListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  requirements: { type: String },
  postedDate: { type: Date, default: Date.now },
  link: { type: String }, // Link to the job listing
  tags: [String], // Keywords like "remote", "full-time", etc.
});

module.exports = mongoose.model("JobListing", JobListingSchema);
