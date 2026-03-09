const { protect, restrictTo } = require('../middlewares/auth.middleware.js')
const express = require ("express")
const router = express.Router()

const { 
    createProject, 
    getAllProjects, 
    getProject, 
    editProject, 
    deleteProject 
} = require("../controllers/project.controller.js")


router.route("/")
    .post(protect, restrictTo('manager', 'admin'), createProject)
    .get(getAllProjects)

router.route("/:id")
    .get(getProject)
    .put(protect, restrictTo('manager', 'admin'), editProject)
    .delete(protect, restrictTo('manager', 'admin'), deleteProject)

module.exports = router;