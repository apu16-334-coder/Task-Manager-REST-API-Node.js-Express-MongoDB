const Tasks = require("../models/task.model.js")
const AppError = require("../utils/AppError.js")
const catchAsync = require("../utils/catchAsync.js")
const Projects = require("../models/project.model.js")
const Users = require("../models/user.model.js");

/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

// Create Tasks
const createTask = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const { title, description, priority, status, dueDate, project, assignedTo } = req.body;

        const projectDoc = await Projects.findById(project);

        if (!projectDoc) {
            return next(new AppError(404, "Project not found"));
        }

        if (
            projectDoc.owner.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return next(new AppError(403, `You are not allowed to add task to ${projectDoc.title} project`));
        }

        if (assignedTo) {
            const user = await Users.findById(assignedTo);

            if (!user) {
                return next(new AppError(404, "Assigned user not found"));
            }
        }

        const tasks = await Tasks.create({ title, description, priority, status, dueDate, project, assignedTo });

        res.status(201).json({
            success: true,
            data: tasks
        })
    }
)

// Get all tasks
const getAllTasks = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        // 1. Build base filter object
        let queryObj = { ...req.query };
        
        ['page', 'limit', 'sort', 'search'].forEach(el => {
            if(queryObj[el]) {
                delete queryObj[el]
            }
        });
        

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

        // 8. Execute query
        const tasks = await query
        .skip(skip) // added skip
        .limit(limit) // added limit

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

// Get a particular task
const getTask = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const task = await Tasks.findById(req.params.id)
            .select('title description priority status createdAt');

        if (!task) {
            return next(new AppError(404, 'Task not found'));
        }

        res.status(200).json({
            success: true,
            data: task
        })
    }
)

// Edit a particular task
const updateTask = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const {
            title,
            description,
            priority,
            status,
            dueDate,
            project,
            assignedTo
        } = req.body

        const task = await Tasks.findById(req.params.id)
            .populate("project");

        if (!task) {
            return next(new AppError(404, 'Task not found'));
        }

        const isAdmin = req.user.role === 'admin';
        const isProjectOwner = task.project.owner.toString() === req.user.id;
        const isAssignedUser = task.assignedTo?.toString() === req.user.id;

        if (!isAssignedUser && !isProjectOwner && !isAdmin) {
            return next(new AppError(403, "You are not allowed to edit this task"));
        }

        const filteredFields = isAssignedUser
            ? { status }
            : { title, description, priority, status, dueDate, project, assignedTo }

        const updatedTask = await Tasks.findByIdAndUpdate(
            req.params.id,
            filteredFields,
            { returnDocument: 'after', runValidators: true }
        ).select('title description priority status createdAt');

        res.status(200).json({
            success: true,
            data: updatedTask
        })
    }
)

// Delete a particular task
const deleteTask = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const task = await Tasks.findById(req.params.id)
            .populate("project");

        if (!task) {
            return next(new AppError(404, 'Task not found'));
        }

        const isProjectOwner =
            task.project.owner.toString() === req.user.id;

        const isAdmin = req.user.role === 'admin';

        if (!isProjectOwner && !isAdmin) {
            return next(new AppError(403, "You are not allowed to delete this task"));
        }

        await Tasks.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'successfully deleted'
        });

    }
)

module.exports = { createTask, getAllTasks, getTask, updateTask, deleteTask }