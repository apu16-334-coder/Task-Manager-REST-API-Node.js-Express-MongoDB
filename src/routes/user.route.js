const { protect, restrictTo } = require('../middlewares/auth.middleware.js')
const express = require("express")
const router = express.Router()

const { 
    createUser, 
    getAllUsers, 
    getUser, 
    getMe, 
    updateMe, 
    updateUser, 
    resetUserPassword, 
    deleteUser 
} = require("../controllers/user.controller")

router.route('/')
    .post(protect, restrictTo('admin'), createUser)
    .get(protect, restrictTo('admin'), getAllUsers)

router.route("/me")
    .get(protect, getMe)
    .patch(protect, updateMe)

router.route("/:id")
    .get(protect, restrictTo('admin'), getUser)
    .patch(protect, restrictTo('admin'), updateUser)
    .delete(protect, restrictTo('admin'), deleteUser)



router.route("/:id/reset-password")
    .patch(protect, restrictTo('admin'), resetUserPassword)

module.exports = router