const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdf = require("pdf-parse");

// Create storage settings for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads/cvs");
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure the directory exists
    cb(null, uploadPath); // Use the correct path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
  },
});

// Initialize multer with the storage settings
const upload = multer({ storage: storage });

// Function to extract text from the CV PDF
exports.extractTextFromCV = async (cvPath) => {
  try {
    const dataBuffer = fs.readFileSync(cvPath);
    const data = await pdf(dataBuffer);
    return data.text; // Extracted text from the PDF
  } catch (error) {
    throw new Error("Error parsing CV PDF");
  }
};

// Routes

// Upload route for user CV
// Use upload.single('cvFile') to handle file upload
exports.uploadCV = [
  upload.single("cvFile"), // Multer middleware for handling file uploads
  async (req, res) => {
    try {
      const userId = req.body.userId; // Make sure this is passed correctly (e.g., via token)

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const extractedText = await exports.extractTextFromCV(req.file.path);
      user.baseCV = {
        fileUrl: req.file.path,
        content: extractedText,
        uploadedAt: new Date(),
      };

      await user.save();

      res.status(200).json({
        message: "CV uploaded successfully!",
        baseCV: user.baseCV,
      });
    } catch (error) {
      console.error("Error uploading CV:", error);
      res.status(500).json({ error: "Error uploading CV." });
    }
  },
];

// Fetch all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

// Fetch a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "Error creating user" });
  }
};

// Update a user by ID
exports.updateUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "Error updating user" });
  }
};

// Delete a user by ID
exports.deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

// User sign-in
exports.userSignIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase(), password });
    if (!user) return res.status(404).json({ error: "Invalid credentials" });
    res.json({ id: user._id });
  } catch (error) {
    res.status(500).json({ error: "Error signing in" });
  }
};
