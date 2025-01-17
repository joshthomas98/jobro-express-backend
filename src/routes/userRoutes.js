const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  userSignIn,
  uploadCV,
} = require("../controllers/UserController");

// User routes
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/new-user-signup", createUser);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);
router.post("/sign-in", userSignIn);

// Upload CV route
router.post("/uploadCV", uploadCV);

module.exports = router;
