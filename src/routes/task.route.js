const { protect, restrictTo } = require('../middlewares/auth.middleware.js')
const express = require ("express")
const router = express.Router()

const { 
    createTask, 
    getAllTasks, 
    getMyTasks,
    getTask, 
    updateTask, 
    deleteTask
} = require("../controllers/task.controllers.js");

// ----------------------
// Task Routes
// ----------------------

// Create new task or get all tasks 
// POST /api/v1/tasks     → Create a new task (manager & admin only)
// GET  /api/v1/tasks      → get all tasks (manager & admin only)
router.route("/")
    .post(protect, restrictTo('manager','admin'), createTask) 
    .get(protect, restrictTo('manager','admin'), getAllTasks)

// Get tasks assigned to the logged-in user
// POST /api/v1/tasks/my    → Create a new task (assigned user only)
router.route("/my")
    .get(protect, restrictTo('user'), getMyTasks)

// Get, update, or delete specific task by ID
// GET /api/v1/tasks/:id → get a task by id (any authenticated user)
// PATCH /api/v1/tasks/:id → Update a task by id (any authenticated user)
// DELETE  /api/v1/tasks/:id   → Delete a task by id (manager & admin)
router.route("/:id")
    .get(protect, getTask)
    .patch(protect, updateTask)
    .delete(protect, restrictTo('manager','admin'), deleteTask)

module.exports = router;