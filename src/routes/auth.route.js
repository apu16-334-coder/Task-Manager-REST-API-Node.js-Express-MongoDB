const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware.js");
const { signUp, logIn, changePassword } = require("../controllers/auth.controller.js");

// ----------------------
// Auth Routes
// ----------------------

// Signup a new user
// POST /api/v1/auth/signup
router.post("/signup", signUp);

// Login existing user
// POST /api/v1/auth/login
router.post("/login", logIn);

// Change password for logged-in user
// PATCH /api/v1/auth/change-password
// Protected route: user must be authenticated
router.patch("/change-password", protect, changePassword);

module.exports = router;