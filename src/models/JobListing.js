const mongoose = require("mongoose");

const JobListingSchema = new mongoose.Schema({
  jobText: { type: String, required: true }, // Stores the full text
  formattedText: { type: String }, // Stores the formatted text after AI processing
  postedDate: { type: Date, default: Date.now },
  tags: [String], // Any tags for future reference
});

module.exports = mongoose.model("JobListing", JobListingSchema);
