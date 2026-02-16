const {createUser} = require("../controllers/user.controller")
const express = require("express")
const router = express.Router()

router.route('/')
    .post(createUser)



module.exports = router

