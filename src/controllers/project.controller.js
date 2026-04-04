const Projects = require("../models/project.model.js")
const AppError = require("../utils/AppError.js")
const catchAsync = require("../utils/catchAsync.js")

/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

/**
 * Create Project
 * Admin must provide owner, Manager default to self
 * POST /api/v1/projects
 */
const createProject = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const { title, description, status } = req.body;
        // Admin must provide owner
        if (req.user.role === 'admin' && !req.body.owner) {
            return next(new AppError(400, 'owner is required'))
        }

        const owner =
            req.user.role === 'admin'
                ? req.body.owner // if admin set assigned owner
                : req.user.id; // manager get automatic assigned

        const project = await Projects.create({ title, description, status, owner })

        res.status(201).json({
            success: true,
            data: project
        })
    }
)

/**
 * Get All Projects (Admin Only)
 * Admin must provide owner, Manager default to self
 * Supports filtering, search, sort, pagination
 * GET /api/v1/projects
 */
const getAllProjects = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        // build base filter object
        let queryObj = { ...req.query };
        ['page', 'limit', 'sort', 'search'].forEach(el => delete queryObj[el]);

        // Handle multiple value fields
        if (queryObj['status']) {
            const values = queryObj['status'].split(",");
            queryObj['status'] = { $in: values }
        }

        // Advance filtering (gte|te|lte|te)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        queryObj = JSON.parse(queryStr);

        // Add keywords search condition
        if (req.query.search) {
            queryObj.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ]
        }

        // Count total matching documents (No pagination here)
        const total = await Projects.countDocuments(queryObj);

        // Build query 
        let query = Projects.find(queryObj);

        // sorting
        const sortBy = req.query.sort
            ? req.query.sort.split(",").join(" ")
            : '-createdAt'
        query = query.sort(sortBy);

        // Pagination
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const skip = (page - 1) * limit;

        // execute query
        const projects = await query
            .skip(skip) // added skip
            .limit(limit) // added limit
            .populate('owner', 'name email'); // added owner populate

        res.status(200).json({
            success: true,
            results: projects.length,
            total,
            page,
            limit,
            data: projects
        })
    }
)

/**
 * Get My Projects (Manager Only)
 * Supports filtering, search, sort, pagination
 * GET /api/v1/projects/my
 */
const getMyProjects = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        // build base filter object
        let queryObj = { owner: req.user.id, ...req.query };
        ['page', 'limit', 'sort', 'search'].forEach(el => delete queryObj[el]);

        // Handle multiple value fields
        if (queryObj['status']) {
            const values = queryObj['status'].split(",");
            queryObj['status'] = { $in: values }
        }

        // Advanced filtering (gte, gt, lte, lt)
        // First convert object to JSON string
        // Replace (gte|gt|lte|lt) by ($gte|$gt|$lte|$lt)
        // Then pasre JSON string to Object
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        queryObj = JSON.parse(queryStr);

        // Add keywords search condition
        if (req.query.search) {
            queryObj.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ]
        }

        // Count total matching documents (No pagination here)
        const total = await Projects.countDocuments(queryObj);

        

        // Build query 
        let query = Projects.find(queryObj);

        // sorting
        const sortBy = req.query.sort
            ? req.query.sort.split(",").join(" ")
            : '-createdAt'
        query = query.sort(sortBy);

        // Pagination
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 5;
        const skip = (page - 1) * limit;

        // execute query
        const projects = await query
            .skip(skip) // added skip
            .limit(limit) // added limit
            .select("title description status createdAt"); // added fields selection

        res.status(200).json({
            success: true,
            results: projects.length,
            total,
            page,
            limit,
            data: projects
        })
    }
)

/**
 * Get a project by ID (Any authenticated user)
 * GET /api/v1/projects/:id
 */
const getProject = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        let query = Projects.findById(req.params.id)

        // Common fields for all logged users
        query.select("title description owner")
            .populate('owner', 'name email');

        // If admin and manager
        if(req.user.role !== 'user') {
            query.select('status createdAt')
        }

        // Execute query
        const project = await query;
        if (!project) return next(new AppError(404, "Project not found"));

        res.status(200).json({
            success: true,
            data: project
        })

    }
)

/**
 * Update a project by ID (Admin/Manager)
 * Only admin can change project manager
 * PATCH /api/v1/projects/:id
 */
const updateProject = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const { title, description, status, owner } = req.body;

        // Filter fields to update according to role and ownership
        const filterFields = req.user.role === 'admin'
            ? { title, description, status, owner }
            : { title, description, status }

        // Filter fields to create query according to role and ownership
        const filter = req.user.role === "admin"
            ? { _id: req.params.id }
            : { _id: req.params.id, owner: req.user.id };

        let  query = Projects.findOneAndUpdate(
            filter,
            filterFields,
            { returnDocument: 'after', runValidators: true }
        )
        
        // Common for all logged user
        query.select("title description status");

        // Only for admin
        if(req.user.role === 'admin') {
            query.select("owner").populate('owner', 'name email')
        }

        // execute query
        const project = await query;

        if (!project) {
            return next(new AppError(403, "You are not allowed to edit this project"));
        }

        res.status(200).json({
            success: true,
            data: project
        })

    }
)

/**
 * Delete a project by ID (Admin/Manager)
 * DELETE /api/v1/projects/:id
 */
const deleteProject = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        // Filter fields to create query according to role and ownership
        const filter =
            req.user.role === "admin"
                ? { _id: req.params.id }
                : { _id: req.params.id, owner: req.user.id };

        const project = await Projects.findOneAndDelete(filter);

        if (!project) {
            return next(new AppError(403, "You are not allowed to delete this project"));
        }

        res.status(200).json({
            success: true,
            message: "successfully deleted"
        })

    }
)

module.exports = { 
    createProject, 
    getAllProjects, 
    getProject, 
    getMyProjects, 
    updateProject, 
    deleteProject 
}
