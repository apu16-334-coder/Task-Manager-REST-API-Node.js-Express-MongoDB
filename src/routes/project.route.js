const { protect, restrictTo } = require('../middlewares/auth.middleware.js')
const express = require ("express")
const router = express.Router()

const { 
    createProject, 
    getAllProjects, 
    getProject,
    getMyProjects,
    updateProject, 
    deleteProject 
} = require("../controllers/project.controller.js")

// ----------------------
// Project Routes
// ----------------------

// Create new project or get all users
// POST /api/v1/projects     → Create a new project (manager & admin only)
// GET  /api/v1/projects      → get all projects(Admin-only)
router.route("/")
    .post(protect, restrictTo('manager','admin'), createProject)
    .get(protect, restrictTo('admin'), getAllProjects);

// Get projects assigned to the logged-in manager (manager only)
// GET /api/v1/projects/my     → Create a new project
router.route("/my")
    .get(protect, restrictTo('manager'), getMyProjects);

// Get, update, or delete specific project by ID
// GET /api/v1/projects/:id → get a project by id (any authenticated user)
// PATCH /api/v1/projects/:id → Update a project by id (manager & admin)
// DELETE  /api/v1/projects/:id   → Delete a project by id (manager & admin)
router.route("/:id")
    .get(protect, getProject)
    .patch(protect, restrictTo('manager','admin'), updateProject)
    .delete(protect, restrictTo('manager','admin'), deleteProject);

module.exports = router;