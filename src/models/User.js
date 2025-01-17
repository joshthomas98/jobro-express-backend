const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  baseCV: {
    fileUrl: { type: String, default: "" }, // Path or URL to the base CV
    content: { type: String, default: "" }, // Parsed text content of the CV
    uploadedAt: { type: Date, default: Date.now },
  },
  customisedCVs: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CustomisedCV" },
  ],
  isProUser: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
