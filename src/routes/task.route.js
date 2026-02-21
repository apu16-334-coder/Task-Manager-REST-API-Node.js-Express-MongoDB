const express = require ("express")
const router = express.Router()

const { 
    createTask, 
    getAllTasks, 
    getTask, 
    editTask, 
    deleteTask
} = require("../controllers/task.controllers.js")


router.route("/")
    .post(createTask)
    .get(getAllTasks)

router.route("/:id")
    .get(getTask)
    .put(editTask)
    .delete(deleteTask)

module.exports = router;