const User = require("../models/User");

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
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch {
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
    res.status(204);
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

// User sign-in
exports.userSignIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      email: email.toLowerCase(),
      password,
    });
    if (!user) return res.status(404).json({ error: "Invalid credentials" });
    res.json({ id: user._id });
  } catch (error) {
    res.status(500).json({ error: "Error signing in" });
  }
};
