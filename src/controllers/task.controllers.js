const Tasks = require("../models/task.model.js")
const AppError = require("../utils/AppError.js")
const catchAsync = require("../utils/catchAsync.js")

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {(req: Request, res: Response)=> void} Controller
 */

/** @type {Controller} */
// Create Tasks
const createTask = catchAsync(async (req, res, next) => {

    const { title, description, project } = req.body
    const task = await Tasks.create({ title, description, project });

    res.status(201).json({
        success: true,
        data: {
            id: task._id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            createdAt: task.createdAt
        }
    })

})

/** @type {Controller} */
// Get all tasks
const getAllTasks = catchAsync(async (req, res, next) => {

    const tasks = await Tasks.find()

    res.status(200).json({
        success: true,
        data: tasks.map(t => ({
            id: t._id,
            title: t.title,
            description: t.description,
            priority: t.priority,
            status: t.status,
            createdAt: t.createdAt
        }))
    })


})

/** @type {Controller} */
// Get a particular task
const getTask = catchAsync(async (req, res, next) => {
    const task = await Tasks.findById(req.params.id)

    if (!task) {
        return next(new AppError(404, 'Task not found'));
    }

    res.status(200).json({
        success: true,
        data: {
            id: task._id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            createdAt: task.createdAt
        }
    })


})

/** @type {Controller} */
// Edit a particular task
const editTask = catchAsync(async (req, res, next) => {

    const { title, description, project } = req.body
    const task = await Tasks.findByIdAndUpdate(
        req.params.id,
        { title, description, project },
        { returnDocument: 'after', runValidators: true }
    )

    if (!task) {
        return next(new AppError(404, 'Task not found'));
    }

    res.status(200).json({
        success: true,
        data: {
            id: task._id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            createdAt: task.createdAt
        }
    })


})

/** @type {Controller} */
// Delete a particular task
const deleteTask = catchAsync(async (req, res, next) => {
    const task = await Tasks.findByIdAndDelete(req.params.id)

    if (!task) {
        return next(new AppError(404, 'Task not found'));
    }

    res.status(200).json({
        success: true,
        message: 'succesfully delete'
    })

})

module.exports = { createTask, getAllTasks, getTask, editTask, deleteTask }