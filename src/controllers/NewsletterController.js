const Newsletter = require("../models/Newsletter");

// Fetch all newsletter signups
exports.getAllNewsletterSignups = async (req, res) => {
  try {
    const newsletterSignups = await Newsletter.find();
    res.json(newsletterSignups);
  } catch (error) {
    res.status(500).json({ error: "Error fetching newsletter signups" });
  }
};

// Fetch a single newsletter signup by ID
exports.getNewsletterSignupById = async (req, res) => {
  try {
    const newsletterSignup = await Newsletter.findById(req.params.id);
    if (!newsletterSignup) {
      return res.status(404).json({ error: "Newsletter signup not found" });
    }
    res.json(newsletterSignup);
  } catch (error) {
    res.status(500).json({ error: "Error fetching newsletter signup" });
  }
};

// Create a new newsletter signup
exports.createNewNewsletterSignup = async (req, res) => {
  try {
    const newsletterSignup = new Newsletter(req.body);
    await newsletterSignup.save();
    res.status(201).json(newsletterSignup);
  } catch (error) {
    res.status(400).json({ error: "Error creating newsletter signup" });
  }
};

// Update a newsletter signup by ID
exports.updateNewsletterSignupById = async (req, res) => {
  const { id } = req.params;
  try {
    const newsletterSignup = await Newsletter.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!newsletterSignup)
      return res.status(404).json({ error: "Newsletter signup not found" });
    res.json(newsletterSignup);
  } catch (error) {
    res.status(400).json({ error: "Error updating newsletter signup" });
  }
};

// Delete a newsletter signup by ID
exports.deleteNewsletterSignupById = async (req, res) => {
  const { id } = req.params;
  try {
    const newsletterSignup = await Newsletter.findByIdAndDelete(id);
    if (!newsletterSignup)
      return res.status(404).json({ error: "Newsletter signup not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting newsletter signup" });
  }
};
