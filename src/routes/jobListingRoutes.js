const express = require("express");
const router = express.Router();
const {
  getJobListings,
  getJobListingById,
  createJobListing,
  updateJobListingById,
  deleteJobListingById,
  receiveJobListingText,
} = require("../controllers/JobListingController");

// Job listing routes
router.get("/", getJobListings);
router.get("/:id", getJobListingById);
router.post("/", createJobListing);
router.put("/:id", updateJobListingById);
router.delete("/:id", deleteJobListingById);

router.post("/create-new-optimised-cv/:userId", receiveJobListingText);

module.exports = router;
