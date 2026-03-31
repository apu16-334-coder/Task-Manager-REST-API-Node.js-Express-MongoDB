const { protect, restrictTo } = require('../middlewares/auth.middleware.js')
const express = require ("express")
const router = express.Router()

const { 
    createProject, 
    getAllProjects, 
    getProject, 
    updateProject, 
    deleteProject 
} = require("../controllers/project.controller.js")


router.route("/")
    .post(protect, restrictTo('manager','admin'), createProject)
    .get(protect, restrictTo('admin'), getAllProjects)

router.route("/:id")
    .get(protect, getProject)
    .patch(protect, restrictTo('manager','admin'), updateProject)
    .delete(protect, restrictTo('manager','admin'), deleteProject)

module.exports = router;