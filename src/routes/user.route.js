const { createUser, getAllUsers, getUser, editUser } = require("../controllers/user.controller")
const express = require("express")
const router = express.Router()

router.route('/')
    .post(createUser)
    .get(getAllUsers)

router.route("/:id")
    .get(getUser)
    .put(editUser)

module.exports = router

