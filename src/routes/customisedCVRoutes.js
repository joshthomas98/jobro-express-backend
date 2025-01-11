const express = require("express");
const router = express.Router();
const {
  getCustomisedCVs,
  getCustomisedCVById,
  createCustomisedCV,
  updateCustomisedCVById,
  deleteCustomisedCVById,
} = require("../controllers/CustomisedCVController");
const { route } = require("./userRoutes");

// Customised CV routes
router.get("/", getCustomisedCVs);
router.get("/:id", getCustomisedCVById);
router.post("/", createCustomisedCV);
router.put("/:id", updateCustomisedCVById);
router.delete("/:id", deleteCustomisedCVById);

module.exports = router;
