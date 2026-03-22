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
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // 2️⃣ If no token
        if (!token) {
            return next(new AppError(401, "You are not logged in. Please log in"))
        }

        // 3️⃣ Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            return next(new AppError(401, "Invalid or expired token"))
        }

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
        if (!roles.includes(req.user.role)) {
            return next(new AppError(403, "You do not have permission to perform this action"))
        }

        next()
    }
}

module.exports = { protect, restrictTo }