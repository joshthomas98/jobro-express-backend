const JobListing = require("../models/JobListing");

// Fetch all job listings
exports.getJobListings = async (req, res) => {
  try {
    const jobListings = await JobListing.find();
    res.json(jobListings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching job listings" });
  }
};

// Fetch a single job listing by ID
exports.getJobListingById = async (req, res) => {
  try {
    const jobListing = await JobListing.findById(req.params.id);
    if (!jobListing)
      return res.status(404).json({ error: "Job listing not found" });
    res.json(jobListing);
  } catch (error) {
    res.status(500).json({ error: "Error fetching job listing" });
  }
};

// Create a new job listing
exports.createJobListing = async (req, res) => {
  try {
    const jobListing = new JobListing(req.body);
    await jobListing.save();
    res.status(201).json(jobListing);
  } catch (error) {
    res.status(400).json({ error: "Error creating job listing" });
  }
};

// Update a job listing by ID
exports.updateJobListingById = async (req, res) => {
  const { id } = req.params;
  try {
    const jobListing = await JobListing.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!jobListing)
      return res.status(404).json({ error: "Job listing not found" });
    res.json(jobListing);
  } catch (error) {
    res.status(400).json({ error: "Error updating job listing" });
  }
};

// Delete a job listing by ID
exports.deleteJobListingById = async (req, res) => {
  const { id } = req.params;
  try {
    const jobListing = await JobListing.findByIdAndDelete(id);
    if (!jobListing)
      return res.status(404).json({ error: "Job listing not found" });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Error deleting job listing" });
  }
};
