const Projects = require("../models/project.model.js")
const AppError = require("../utils/AppError.js")
const catchAsync = require("../utils/catchAsync.js")

/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

// Create Project
const createProject = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const { title, description, status } = req.body;

        if (req.user.role === 'admin' && !req.body.owner) {
            return next(new AppError(400, 'Owner is required'))
        }

        const owner =
            req.user.role === 'admin'
                ? req.body.owner
                : req.user.id;

        const project = await Projects.create({ title, description, status, owner })

        res.status(201).json({
            success: true,
            data: project
        })
    }
)

// Get All Project
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
        queryStr = queryStr.replace(/\b(gte|gte|lte|lt)\b/g, match => `$${match}`);
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

// Get My All Projects
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

        // Advance filtering (gte|te|lte|te)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gte|lte|lt)\b/g, match => `$${match}`);
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

// Get a particular Project
const getProject = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        let query = Projects.findById(req.params.id)


        query.select("title description owner")
            .populate('owner', 'name email');

        if(req.user.role !== 'user') {
            query.select('status createdAt')
        }

        // Execute query
        const project = await query;

        if (!project) {
            return next(new AppError(404, "Project not found"));
        }

        res.status(200).json({
            success: true,
            data: project
        })

    }
)

// Edit a particular Project
const updateProject = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const { title, description, status, owner } = req.body;

        const filterFields = req.user.role === 'admin'
            ? { title, description, status, owner }
            : { title, description, status }

        const filter = req.user.role === "admin"
            ? { _id: req.params.id }
            : { _id: req.params.id, owner: req.user.id };

        let  query = Projects.findOneAndUpdate(
            filter,
            filterFields,
            { returnDocument: 'after', runValidators: true }
        )
        
        query.select("title description status");

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

// delete a particular Project
const deleteProject = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
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

module.exports = { createProject, getAllProjects, getProject, getMyProjects, updateProject, deleteProject }
