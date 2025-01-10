const CustomisedCV = require("../models/CustomisedCV");

// Fetch all customized CVs
exports.getCustomisedCVs = async (req, res) => {
  try {
    const customisedCVs = await CustomisedCV.find();
    res.json(customisedCVs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching customized CVs" });
  }
};

// Fetch a single customized CV by ID
exports.getCustomisedCVById = async (req, res) => {
  try {
    const customisedCV = await CustomisedCV.findById(req.params.id);
    if (!customisedCV)
      return res.status(404).json({ error: "Customized CV not found" });
    res.json(customisedCV);
  } catch (error) {
    res.status(500).json({ error: "Error fetching customized CV" });
  }
};

// Create a new customized CV
exports.createCustomisedCV = async (req, res) => {
  try {
    const customisedCV = new CustomisedCV(req.body);
    await customisedCV.save();
    res.status(201).json(customisedCV);
  } catch (error) {
    res.status(400).json({ error: "Error creating customized CV" });
  }
};

// Update a customized CV by ID
exports.updateCustomisedCVById = async (req, res) => {
  const { id } = req.params;
  try {
    const customisedCV = await CustomisedCV.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!customisedCV)
      return res.status(404).json({ error: "Customized CV not found" });
    res.json(customisedCV);
  } catch (error) {
    res.status(400).json({ error: "Error updating customized CV" });
  }
};

// Delete a customized CV by ID
exports.deleteCustomisedCVById = async (req, res) => {
  const { id } = req.params;
  try {
    const customisedCV = await CustomisedCV.findByIdAndDelete(id);
    if (!customisedCV)
      return res.status(404).json({ error: "Customized CV not found" });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Error deleting customized CV" });
  }
};
