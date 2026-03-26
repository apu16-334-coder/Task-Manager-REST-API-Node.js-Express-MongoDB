const catchAsync = require("../utils/catchAsync.js")
const Users = require("../models/user.model.js")
const bcrypt = require("bcrypt")
const AppError = require("../utils/AppError.js")
const jwt = require("jsonwebtoken");

/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

const signUp = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const { name, email, password } = req.body;

        await Users.create({ name, email, password });

        res.status(201).json({
            success: true,
            message: 'Account created successfully. Please log in.'
        });
    }
)

const logIn = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        // get requested email and password
        const { email, password } = req.body;

        // find user + include password
        const user = await Users.findOne({ email }).select('+password');

        // if user is not found
        if (!user) {
            return next(new AppError(401, "Invalid email or password"))
        }

        // compare password if not match
        if (! await bcrypt.compare(password, user.password)) {
            return next(new AppError(401, "Invalid email or password"))
        }

        // create JWT
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
                email: user.email,
                role: user.role
            }
        })
    }
)

const changePassword = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const { currentPassword, newPassword } = req.body;

        if(!currentPassword) {
            return next(new AppError(400, 'Current password is required'))
        }

        if(!newPassword) {
            return next(new AppError(400, 'New password is required'))
        }

        const user = await Users.findById(req.user.id);

        if (!user) {
            return next(new AppError(404, 'User not found'))
        }

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