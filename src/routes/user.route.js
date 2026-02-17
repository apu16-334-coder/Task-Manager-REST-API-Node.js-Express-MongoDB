const { createUser, getAllUsers }= require("../controllers/user.controller")
const express = require("express")
const router = express.Router()

router.route('/')
    .post(createUser)
    .get(getAllUsers)



module.exports = router

