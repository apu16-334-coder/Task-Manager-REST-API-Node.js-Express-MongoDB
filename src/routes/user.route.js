const express = require("express");
const router = express.Router();

const { protect, restrictTo } = require('../middlewares/auth.middleware.js');
const { 
    createUser, 
    getAllUsers, 
    getUser, 
    getMe, 
    updateMe, 
    updateUser, 
    resetUserPassword, 
    deleteUser 
} = require("../controllers/user.controller.js");

// ----------------------
// User Routes
// ----------------------

// Admin-only: Create new user or get all users
// POST /api/v1/users      → create user
// GET  /api/v1/users      → get all users
router.route('/')
    .post(protect, restrictTo('admin'), createUser)
    .get(protect, restrictTo('admin'), getAllUsers);

// Logged-in user: Get or update own profile
// GET  /api/v1/users/me   → get current user profile
// PATCH /api/v1/users/me  → update own profile
router.route("/me")
    .get(protect, getMe)
    .patch(protect, updateMe);

// Admin-only: Get, update, or delete specific user by ID
// GET    /api/v1/users/:id   → get user by ID
// PATCH  /api/v1/users/:id   → update user by ID
// DELETE /api/v1/users/:id   → delete user by ID
router.route("/:id")
    .get(protect, restrictTo('admin'), getUser)
    .patch(protect, restrictTo('admin'), updateUser)
    .delete(protect, restrictTo('admin'), deleteUser);

// Admin-only: Reset user password
// PATCH /api/v1/users/:id/reset-password
router.route("/:id/reset-password")
    .patch(protect, restrictTo('admin'), resetUserPassword);

module.exports = router;