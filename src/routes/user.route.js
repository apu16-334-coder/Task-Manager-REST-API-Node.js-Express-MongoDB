const express = require("express")
const router = express.Router()

const { 
    createUser, 
    getAllUsers, 
    getUser, 
    editUser, 
    deleteUser 
} = require("../controllers/user.controller")

router.route('/')
    .post(createUser)
    .get(getAllUsers)

router.route("/:id")
    .get(getUser)
    .put(editUser)
    .delete(deleteUser)

module.exports = router

