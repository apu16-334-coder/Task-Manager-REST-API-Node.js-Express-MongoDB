const catchAsync = require("../utils/catchAsync.js");
const Users = require("../models/user.model.js");
const AppError = require("../utils/AppError.js");
const jwt = require("jsonwebtoken");

/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

const protect = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        let token;
        // 1️⃣ Get token from header
        if (
            req.header.authorization &&
            req.header.authorization.startsWith('Bearer')
        ) {
            token = req.header.authorization.split(" ")[1];
        }

        // 2️⃣ If no token
        if (!token) {
            return next(new AppError(401, "You are not logged in"))
        }

        // 3️⃣ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // 4️⃣ Check if user still exists
        const currentUser = await Users.findById(decoded.id)

        if (!currentUser) {
            return next(new AppError(401, "User no longer exists"))
        }

        // 5️⃣ Attach user to request
        req.user = currentUser

        next()
    }
)

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.rol)) {
            return next(new AppError(403, "You do not have permission to perform this action"))
        }

        next()
    }
}

module.exports = { protect, restrictTo }