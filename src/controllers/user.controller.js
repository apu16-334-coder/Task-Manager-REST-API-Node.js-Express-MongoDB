const Users = require("../models/user.model.js")
const AppError = require("../utils/AppError.js")
const catchAsync = require("../utils/catchAsync.js")
const bcrypt = require("bcrypt")

/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

// Create User
const createUser = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const { name, email, password, role, isActive } = req.body;

        const hashPassword = await bcrypt.hash(password, 12);

        const user = await Users.create({
            name,
            email,
            password: hashPassword,
            role,
            isActive
        })

        res.status(201).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt
            }
        })

    }
)

// Get All Users
const getAllUsers = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const users = await Users.find()
            .select('name email role isActive createdAt');

        res.status(200).json({
            success: true,
            data: users
        })

    }
)

// Get a particular User
const getUser = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const user = await Users.findById(req.params.id)
            .select('name email role isActive createdAt');

        if (!user) {
            return next(new AppError(404, "User not found"));
        }

        res.status(200).json({
            success: true,
            data: user
        })

    }
)

// edit a particular User
const editUser = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const { name, email, role, isActive } = req.body;

        const user = await Users.findByIdAndUpdate(
            req.params.id,
            { name, email, role, isActive },
            { returnDocument: 'after', runValidators: true }
        ).select('name email role isActive createdAt');

        if (!user) {
            return next(new AppError(404, "User not found"));
        }

        res.status(200).json({
            success: true,
            data: user
        })

    }
)

const resetUserPassword = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const { password } = req.body

        const hashPassword = await bcrypt.hash(password, 12);

        const user = await Users.findByIdAndUpdate(
            req.params.id,
            { password: hashPassword },
            { returnDocument: 'after', runValidators: true }
        )

        if(!user) {
            return next(new AppError(404, "User not found"))
        }

        res.status(200).json({
            success: true,
            message: "Password reset successful"
        })
    }
)

// delete a particular User
const deleteUser = catchAsync(

    /** @type {RequestHandler} */
    async (req, res, next) => {
        const user = await Users.findByIdAndDelete(req.params.id);

        if (!user) {
            return next(new AppError(404, "User not found"));
        }

        res.status(200).json({
            success: true,
            message: "successfully deleted"
        })

    }
)

module.exports = { createUser, getAllUsers, getUser, editUser, resetUserPassword, deleteUser }
