const mongoose = require("mongoose");

const CustomisedCVSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "JobListing" }, // Optional: Linked to a job listing
  fileUrl: { type: String }, // Path or URL to the customised CV
  content: { type: String }, // Parsed text content of the customised CV
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CustomisedCV", CustomisedCVSchema);
