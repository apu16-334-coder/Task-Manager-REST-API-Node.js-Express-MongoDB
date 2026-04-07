const Users = require("../models/user.model.js")
const AppError = require("../utils/AppError.js")
const catchAsync = require("../utils/catchAsync.js")
// Load dependencies
const bcrypt = require("bcrypt")

/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

/**
 * createUser
 * Admin-only: create a new user
 * POST /api/v1/users
 */
const createUser = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const { name, email, password, role } = req.body;

        // Create user documents in DB
        const user = await Users.create({ name, email, password, role });

        res.status(201).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    }
)

/**
 * getAllUsers
 * Admin-only: get all users with filtering, sorting, pagination, and search
 * GET /api/v1/users
 */
const getAllUsers = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        // build base filter obj
        let queryObj = { ...req.query };
        // Remove page limit sort search query fields for further query make
        ['page', 'limit', 'sort', 'search'].forEach(el => delete queryObj[el]);

        // Handle multi-value fields
        if (queryObj['role']) {
            const values = queryObj['role'].split(","); // convert string to array
            queryObj['role'] = { $in: values }
        }

        // Advanced filtering (gte, gt, lte, lt)
        // First convert object to JSON string
        // Replace (gte|gt|lte|lt) by ($gte|$gt|$lte|$lt)
        // Then pasre JSON string to Object
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

        // Execute query
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

/**
 * getUser
 * Admin-only: get a user by ID
 * GET /api/v1/users/:id
 */
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

/**
 * getMe
 * Get current logged-in user
 * GET /api/v1/users/me
 */
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

/**
 * updateMe
 * Update logged-in user's profile (name, email)
 * PATCH /api/v1/users/me
 */
const updateMe = catchAsync(
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

/**
 * updateUser
 * Admin-only: update a user by ID
 * PATCH /api/v1/users/:id
 */
const updateUser = catchAsync(
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

/**
 * resetUserPassword
 * Admin-only: reset a user's password
 * PATCH /api/v1/users/:id/reset-password
 */
const resetUserPassword = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const { password } = req.body;

        if (!password) return next(new AppError(400, "Password is required"));

        // find user
        const user = await Users.findById(req.params.id)
        if (!user) return next(new AppError(404, "User not found"));
        

        user.password = password; // plain password
        await user.save(); // triggers pre("save") → hashing + passwordChangedAt

        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });
    }
)

/**
 * deleteUser
 * Admin-only: delete a user by ID
 * DELETE /api/v1/users/:id
 */
const deleteUser = catchAsync(

    /** @type {RequestHandler} */
    async (req, res, next) => {
        const user = await Users.findByIdAndDelete(req.params.id);

        if (!user) {
            return next(new AppError(404, "User not found"));
        }

        res.status(204).json({
            success: true,
            message: "successfully deleted"
        })

    }
)

module.exports = { 
    createUser, 
    getAllUsers, 
    getUser, 
    getMe, 
    updateMe, 
    updateUser, 
    resetUserPassword, 
    deleteUser 
}
