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
    .post(createProject)
    .get(getAllProjects)

router.route("/:id")
    .get(getProject)
    .put(editProject)
    .delete(deleteProject)

module.exports = router;