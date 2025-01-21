const mongoose = require("mongoose");

const NewsletterSignupSchema = new mongoose.Schema({
  email: { type: String, required: true },
  signedUpAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("NewsletterSignup", NewsletterSignupSchema);
