const { protect, restrictTo } = require('../middlewares/auth.middleware.js')
const express = require ("express")
const router = express.Router()

const { 
    createTask, 
    getAllTasks, 
    getTask, 
    updateTask, 
    deleteTask
} = require("../controllers/task.controllers.js")


router.route("/")
    .post(protect, restrictTo('manager','admin'), createTask)
    .get(protect, restrictTo('manager','admin'), getAllTasks)

router.route("/:id")
    .get(protect, getTask)
    .patch(protect, updateTask)
    .delete(protect, restrictTo('manager','admin'), deleteTask)

module.exports = router;