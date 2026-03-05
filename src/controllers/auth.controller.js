const catchAsync = require("../utils/catchAsync.js")
const Users = require("../models/user.model.js")
const bcrypt = require("bcrypt")
const AppError = require("../utils/AppError.js")

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

module.exports = { signUp }