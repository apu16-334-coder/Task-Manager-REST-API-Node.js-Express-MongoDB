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
        const { name, email, password } = req.body();

        const hashPassword = bcrypt.hash(password, 12)

        await Users.create({ name, email, hashPassword })

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
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        res.status(200).json({
            success: true,
            token
        })
    }
)

module.exports = { signUp, logIn }