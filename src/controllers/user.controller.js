const Users = require("../models/user.model.js")
const AppError = require("../utils/AppError.js")
const catchAsync = require("../utils/catchAsync.js")

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {(req: Request, res: Response)=> void} Controller
 */

/** @type {Controller} */
// Create User
const createUser = catchAsync(async (req, res, next) => {

    const { name, email, password } = req.body
    const user = await Users.create({ name, email, password })

    res.status(201).json({
        success: true,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    })

})

/** @type {Controller} */
// Get All Users
const getAllUsers = catchAsync(async (req, res, next) => {

    const users = await Users.find()

    res.status(200).json({
        success: true,
        data: users.map(u => ({
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role
        }))
    })

})

/** @type {Controller} */
// Get a particular User
const getUser = catchAsync(async (req, res, next) => {

    const user = await Users.findById(req.params.id)


    if (!user) {
        return next(new AppError(404, "User not found"));
    }

    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    })

})


/** @type {Controller} */
// edit a particular User
const editUser = catchAsync(async (req, res, next) => {

    const { name, email } = req.body;
    const user = await Users.findByIdAndUpdate(
        req.params.id,
        { name, email },
        { returnDocument: 'after', runValidators: true }
    );

    if (!user) {
        return next(new AppError(404, "User not found"));
    }

    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    })

})

/** @type {Controller} */
// delete a particular User
const deleteUser = catchAsync(async (req, res, next) => {

    const user = await Users.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new AppError(404, "User not found"));
    }

    res.status(200).json({
        success: true,
        message: "successfully deleted"
    })

})

module.exports = { createUser, getAllUsers, getUser, editUser, deleteUser }
