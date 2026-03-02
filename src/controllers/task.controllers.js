const Tasks = require("../models/task.model.js")
const AppError = require("../utils/AppError.js")
const catchAsync = require("../utils/catchAsync.js")

/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

// Create Tasks
const createTask = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {

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

    }
)

// Get all tasks
const getAllTasks = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {

        // 1. Build query object with filters
        let queryObj = { ...req.query };
        ['page', 'limit', 'sort', 'search'].forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        queryObj = JSON.parse(queryStr)

        // 2. Build Mongoose query
        let query = Tasks.find(queryObj)

        // 3. Add search
        if (req.query.search) {
            let query = Tasks.find({
                $or: [
                    { title: { $regex: req.query.search, $options: 'i' } },
                    { description: { $regex: req.query.search, $options: 'i' } }
                ]
            })
        }

        // 7. Count total matching documents
        const total = await query.countDocuments();

        // 4. Sort
        const sortBy = req.query.sort
            ? req.query.sort.split(',').join(' ')
            : '-createdAt';
        query = query.sort(sortBy)

        // 5. Pagination
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        // 6. Execute query
        const tasks = await query.exec();

        res.status(200).json({
            success: true,
            results: tasks.length,
            total,
            page,
            limit,
            data: tasks.map(t => ({
                id: t._id,
                title: t.title,
                description: t.description,
                priority: t.priority,
                status: t.status,
                createdAt: t.createdAt
            }))
        })
    }
)

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