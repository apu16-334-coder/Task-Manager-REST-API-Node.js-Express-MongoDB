const express = require ("express")
const router = express.Router()
const { protect, restrictTo } = require('../middlewares/auth.middleware.js')

const { signUp, logIn, changePassword } = require("../controllers/auth.controller.js")

router.post("/signup", signUp);
router.post("/login", logIn);

router.patch("/change-password", protect, changePassword)

module.exports = router;