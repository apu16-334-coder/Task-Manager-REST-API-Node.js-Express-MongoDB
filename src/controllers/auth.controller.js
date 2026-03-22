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

        if (!name || !email || !password) {
            return next(new AppError(400, "Missing required fields"))
        }

        if (password.length < 5) {
            return next(new AppError(400, "Password must be at least 5 characters"));
        }

        const emailNormalized = email.toLowerCase().trim();

        const hashPassword = await bcrypt.hash(password, 12);

        await Users.create({ name, emailNormalized, password: hashPassword });

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

        if (!email || !password) {
            return next(new AppError(400, "Missing required fields"))
        }

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

module.exports = { signUp, logIn }