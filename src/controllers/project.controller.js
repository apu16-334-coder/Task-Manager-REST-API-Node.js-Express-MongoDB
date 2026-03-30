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
        const { title, description } = req.body;

        if(req.user.role === 'admin' && !req.body.owner) {
            return next(new AppError(400, 'Owner is required'))
        }

        const owner =
            req.user.role === 'admin'
                ? req.body.owner
                : req.user.id;

        const project = await Projects.create({ title, description, owner })

        res.status(201).json({
            success: true,
            data: {
                id: project.id,
                title: project.title,
                description: project.description,
                status: project.status,
                createdAt: project.createdAt
            }
        })
    }
)

// Get All Project
const getAllProjects = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const projects = await Projects.find()
            .select("title description status createdAt owner");

        res.status(200).json({
            success: true,
            data: projects
        })

    }
)

// Get a particular Project
const getProject = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const project = await Projects.findById(req.params.id)
            .select("title description status createdAt owner");

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
const editProject = catchAsync(
    /** @type {RequestHandler} */
    async (req, res, next) => {
        const { title, description, status } = req.body;

        const filter =
            req.user.role === "admin"
                ? { _id: req.params.id }
                : { _id: req.params.id, owner: req.user.id };

        const project = await Projects.findOneAndUpdate(
            filter,
            { title, description, status },
            { returnDocument: 'after', runValidators: true }
        ).select("title description status createdAt owner");

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

module.exports = { createProject, getAllProjects, getProject, editProject, deleteProject }
