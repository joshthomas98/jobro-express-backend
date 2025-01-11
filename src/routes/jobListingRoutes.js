const express = require("express");
const router = express.Router();
const {
  getJobListings,
  getJobListingById,
  createJobListing,
  updateJobListingById,
  deleteJobListingById,
} = require("../controllers/JobListingController");

// Job listing routes
router.get("/", getJobListings);
router.get("/:id", getJobListingById);
router.post("/", createJobListing);
router.put("/:id", updateJobListingById);
router.delete("/:id", deleteJobListingById);

module.exports = router;
