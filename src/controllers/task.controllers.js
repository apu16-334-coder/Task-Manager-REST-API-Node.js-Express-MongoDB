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
        // 1. Build base filter object
        let queryObj = { ...req.query };
        ['page', 'limit', 'sort', 'search'].forEach(el => delete queryObj[el]);

        // Handle multi-value fields
        const multiValueFields = ['priority', 'status']; // only actual schema fields
        multiValueFields.forEach(field => {
            if (queryObj[field]) {
                const values = queryObj[field].split(','); // convert string to array
                queryObj[field] = { $in: values };
            }
        });

        // Advanced filtering (gte, gt, lte, lt)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        queryObj = JSON.parse(queryStr);

        // 2. Add search condition
        if (req.query.search) {
            queryObj.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // 3. Count total matching documents (NO pagination here)
        const total = await Tasks.countDocuments(queryObj);

        // 4. Build query
        let query = Tasks.find(queryObj);

        // 5. Sorting
        const sortBy = req.query.sort
            ? req.query.sort.split(',').join(' ')
            : '-createdAt';
        query = query.sort(sortBy);

        // 6. Pagination
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        // 7. Field selection
        query = query.select('title description priority status createdAt');

        // 8. Execute query
        const tasks = await query;

        res.status(200).json({
            success: true,
            results: tasks.length,
            total,
            page,
            limit,
            data: tasks
        });
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