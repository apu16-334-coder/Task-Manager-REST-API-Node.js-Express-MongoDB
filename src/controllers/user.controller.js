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
        const {
            name,
            email,
            password,
            role
        } = req.body;

        const user = await Users.create({
            name,
            email,
            password,
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
        // build base filter obj
        let queryObj = { ...req.query };

        ['page', 'limit', 'sort', 'search'].forEach(el => delete queryObj[el]);

        // Handle multi-value fields
        if (queryObj['role']) {
            const values = queryObj['role'].split(","); // convert string to array
            queryObj['role'] = { $in: values }
        }

        // Advanced filtering (gte, gt, lte, lt)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        queryObj = JSON.parse(queryStr);

        // Add serach condition
        if (req.query.search) {
            queryObj.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Count total matching documents (No pagination here)
        const total = await Users.countDocuments(queryObj);

        // Build query 
        let query = Users.find(queryObj);

        // sorting 
        const sortBy = req.query.sort
            ? req.query.sort.split(",").join(" ")
            : '-createdAt';
        query = query.sort(sortBy);

        // pagination
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        // Field selection
        query = query.select('name email role isActive createdAt');

        const users = await query;

        res.status(200).json({
            success: true,
            results: users.length,
            total,
            page,
            limit,
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

// Get own profile
const getMe = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        res.status(200).json({
            success: true,
            data: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        })
    }
)

// edit own profile
const editMe = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const { name, email } = req.body;

        const user = await Users.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { returnDocument: 'after', runValidators: true }
        ).select('name email role');

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
        const { password } = req.body;

        // find user
        const user = await Users.findById(req.params.id)

        if (!user) {
            return next(new AppError(404, "User not found"));
        }

        user.password = password; // plain password
        await user.save(); // triggers pre("save") → hashing + passwordChangedAt

        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });
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

module.exports = { createUser, getAllUsers, getUser, getMe, editMe, editUser, resetUserPassword, deleteUser }
