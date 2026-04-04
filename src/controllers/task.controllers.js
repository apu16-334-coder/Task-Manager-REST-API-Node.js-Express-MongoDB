const Tasks = require("../models/task.model.js")
const AppError = require("../utils/AppError.js")
const catchAsync = require("../utils/catchAsync.js")
const Projects = require("../models/project.model.js")
const Users = require("../models/user.model.js");

/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

/**
 * Create Task (Admin and manager)
 * Manager can only add task to his projects
 * POST /api/v1/tasks
 */
const createTask = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const { title, description, priority, status, dueDate, project, assignedTo } = req.body;

        // 1. Check if project exists
        const projectDoc = await Projects.findById(project);
        if (!projectDoc) return next(new AppError(404, "Project not found"));

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

/**
 * Get all Task (Admin and manager)
 * Manager will only get tasks of his projects
 * Supported queries - filtering, sorting, pagination, and search
 * GET /api/v1/tasks
 */
const getAllTasks = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        // 1. Build base filter object
        let queryObj = { ...req.query };
        // Intially remove page, limit, sort, search for further query make
        ['page', 'limit', 'sort', 'search'].forEach(el => {
            if (queryObj[el]) {
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
        // First convert object to JSON string
        // Replace (gte|gt|lte|lt) by ($gte|$gt|$lte|$lt)
        // Then pasre JSON string to Object
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

        // Restrict response to manager
        if (req.user.role === 'manager') {
            // get manager all products Id
            const projectIds = await Projects.find({ owner: req.user.id }).select('id')
            queryObj.project = { $in: projectIds } // make project IDs query to get tasks of all products
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

        query.skip(skip).limit(limit) // added skip and limit

        // Get assigned user details for common view
        query.populate('assignedTo', 'name email')

        // if admin that get project title and owner details
        if (req.user.role === 'admin') {
            query.populate({
                path: 'project',
                select: 'title',
                populate: {
                    path: 'owner',
                    select: 'name email'
                }
            })
        } else {
            query.populate('project', 'title'); // manager get only project title
        }

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

/**
 * Get own tasks (Only assigned user)
 * Supported queries - filtering, sorting, pagination, and search
 * GET /api/v1/tasks/my
 */
const getMyTasks = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        // 1. Build base filter object
        let queryObj = { assignedTo: req.user.id, ...req.query };
        // Intially remove page, limit, sort, search for further query make
        ['page', 'limit', 'sort', 'search'].forEach(el => {
            if (queryObj[el]) {
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
        // First convert object to JSON string
        // Replace (gte|gt|lte|lt) by ($gte|$gt|$lte|$lt)
        // Then pasre JSON string to Object
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
            .select('title description priority status dueDate project ')
            .populate({
                path: 'project',
                select: 'title',
                populate: {
                    path: 'owner',
                    select: 'name email'
                }
            }) // get project title and owner details

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

/**
 * Get a task by ID (Any authenticated user)
 * GET /api/v1/tasks/:id
 */
const getTask = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        let query = Tasks.findById(req.params.id)

        query.select('title description priority status dueDate project ')

        // Admin and assigned user will get project title and owner details
        if (req.user.role === 'admin' || req.user.role === 'user') {
            query.populate({
                path: 'project',
                select: 'title',
                populate: {
                    path: 'owner',
                    select: 'name email'
                }
            })
        } else {
            query.populate('project', 'title'); // Manager will get only project title
        }

        // Only managet and admin will get assigned user details
        if (req.user.role !== 'user') {
            query.select('assignedTo')
                .populate('assignedTo', 'name email')
        }

        // Execute query
        const task = await query;
        if (!task) return next(new AppError(404, 'Task not found'));

        res.status(200).json({
            success: true,
            data: task
        })
    }
)

/**
 * Update a task by ID (Any authenticated user)
 * Manager can change project of the task but has to choose among his projects
 * Assigned user can only update status of a task
 * PATCH /api/v1/tasks/:id
 */
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

        // get task by Id
        const task = await Tasks.findById(req.params.id)
            .populate("project");
        if (!task) return next(new AppError(404, 'Task not found'));

        // Find Logged user is admin or project owner or assigned user
        const isAdmin = req.user.role === 'admin';
        const isProjectOwner = task.project.owner.toString() === req.user.id;
        const isAssignedUser = task.assignedTo?.toString() === req.user.id;

        // If Logged user is none of them (admin/ project owner/ assigned user)
        if (!isAssignedUser && !isProjectOwner && !isAdmin) {
            return next(new AppError(403, "You are not allowed to edit this task"));
        }

        // If logged user is project owner or admin can change project and assigned user
        // Manager can only add task to his own projects
        if (isProjectOwner || isAdmin) {
            // If project is not undefined
            if (project) {
                // Find project
                const projectDoc = await Projects.findById(project);
                if (!projectDoc) return next(new AppError(404, "Project not found"));

                // Must choose own project
                if (projectDoc.owner.toString() !== req.user.id) {
                    return next(new AppError(403, `You are not allowed to add task to ${projectDoc.title} project`));
                }
            }

            // If assignedTo is not undefined
            if (assignedTo) {
                // Find assinged user
                const user = await Users.findById(assignedTo);
                if (!user) return next(new AppError(404, "Assigned user not found"));                
            }
        }

        // Filtering Fields to update for assigned user
        const filteredFields = isAssignedUser
            ? { status }
            : { title, description, priority, status, dueDate, project, assignedTo }

        let query = Tasks.findByIdAndUpdate(
            req.params.id,
            filteredFields,
            { returnDocument: 'after', runValidators: true }
        ).select('title description priority status dueDate project')

        // Only admin will get project title and project owner details
        if (req.user.role === 'admin') {
            query.populate({
                path: 'project',
                select: 'title',
                populate: {
                    path: 'owner',
                    select: 'name email'
                }
            })
        } else {
            query.populate('project', 'title'); // manager and assigned user will get project title only
        }

        // Admin and manager will get assigned user details
        if (req.user.role !== 'user') {
            query.select('assignedTo')
                .populate('assignedTo', 'name email')
        }

        const updatedTask = await query;

        res.status(200).json({
            success: true,
            data: updatedTask
        })
    }
)

/**
 * Delete a task by ID (Manager and Admin)
 * DELETE /api/v1/tasks/:id
 */
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

module.exports = { 
    createTask, 
    getAllTasks, 
    getMyTasks, 
    getTask, 
    updateTask, 
    deleteTask 
}