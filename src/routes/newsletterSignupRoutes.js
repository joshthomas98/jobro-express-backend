const express = require("express");
const router = express.Router();
const {
  getAllNewsletterSignups,
  getNewsletterSignupById,
  createNewNewsletterSignup,
  updateNewsletterSignupById,
  deleteNewsletterSignupById,
} = require("../controllers/NewsletterController");

// User routes
router.get("/", getAllNewsletterSignups);
router.get("/:id", getNewsletterSignupById);
router.post("/new-user-signup", createNewNewsletterSignup);
router.put("/:id", updateNewsletterSignupById);
router.delete("/:id", deleteNewsletterSignupById);

module.exports = router;
