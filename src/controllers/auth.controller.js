// Load dependencies
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

// Import important Modules
const catchAsync = require("../utils/catchAsync.js")
const Users = require("../models/user.model.js")
const AppError = require("../utils/AppError.js")

/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

/**
 * signUp
 * Creates a new user account
 * POST /api/v1/auth/signup
 */
const signUp = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const { name, email, password } = req.body;

        // Create user in database (password will be hashed via pre-save middleware)
        await Users.create({ name, email, password });

        res.status(201).json({
            success: true,
            message: 'Account created successfully. Please log in.'
        });
    }
)

/**
 * logIn
 * Authenticates a user and returns JWT
 * POST /api/v1/auth/login
 */
const logIn = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        // // get requested email and password
        // console.log("LOGIN HIT");
        // console.log(req.body)
        const { email, password } = req.body;

        // If email is empty
        if(!email) {
            return next(new AppError(400, 'Email is required'));
        }

        // If password is empty
        if(!password) {
            return next(new AppError(400, 'Password is required'));
        }

        // find user + include password
        const user = await Users.findOne({ email }).select('+password');

        // if user is not found or password does not match
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(new AppError(401, "Invalid email or password"))
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        res.status(200).json({
            success: true,
            token,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    }
)

/**
 * changePassword
 * Allows authenticated user to change their password
 * PATCH /api/v1/auth/change-password
 */
const changePassword = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword) {
            return next(new AppError(400, 'Current password is required'))
        }

        if (!newPassword) {
            return next(new AppError(400, 'New password is required'))
        }

        // Find current user + password
        const user = await Users.findById(req.user.id).select('+password')
        if (!user) return next(new AppError(404, 'User not found'))
        
        // Verify current password
        if (! await bcrypt.compare(currentPassword, user.password)) {
            return next(new AppError(401, 'Current password is incorrect'))
        }

        user.password = newPassword; // set new plain password
        await user.save(); // triggers pre("save") → hashing + passwordChangedAt

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    }
)

module.exports = { signUp, logIn, changePassword }