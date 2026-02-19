const Users = require("../models/user.model.js")
const AppError = require("../utils/AppError.js")

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {(req: Request, res: Response)=> void} Controller
 */

/** @type {Controller} */
// Create User
const createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        const user = await Users.create({ name, email, password } )

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        next(error)
    }
}

/** @type {Controller} */
// Get All Users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await Users.find()
            .select('_id name email role')

        res.status(200).json({
            success: true,
            data: users
        })
    } catch (error) {
        next(error)
    }
}

/** @type {Controller} */
// Get a particular User
const getUser = async (req, res, next) => {
    try {
        const user = await Users.findById(req.params.id)
            .select('_id name email role')

        if (!user) {
            return next(new AppError(404, "User not found"));
        }

        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        next(error)
    }
}


/** @type {Controller} */
// Get a particular User
const editUser = async (req, res, next) => {
    try {
        const {name, email} = req.body;
        const user = await Users.findByIdAndUpdate(
            req.params.id,
            {name, email},
            { returnDocument: 'after', runValidators: true }
        );

        if (!user) {
            return next(new AppError(404, "User not found"));
        }

        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        next(error)
    }
}

/** @type {Controller} */
// Get a particular User
const deleteUser = async (req, res, next) => {
    try {
        const user = await Users.findByIdAndDelete(req.params.id);

        if (!user) {
            return next(new AppError(404, "User not found"));
        }

        res.status(200).json({
            success: true,
            message: "successfully deleted"
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { createUser, getAllUsers, getUser, editUser, deleteUser }
