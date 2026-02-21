const Projects = require("../models/project.model.js")
const AppError = require("../utils/AppError.js")
const catchAsync = require("../utils/catchAsync.js")

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {(req: Request, res: Response)=> void} Controller
 */

/** @type {Controller} */
// Create Project
const createProject = catchAsync(async (req, res, next) => {
    const { title, description, owner } = req.body
    const project = await Projects.create({ title, description, owner })

    res.status(201).json({
        success: true,
        data: {
            id: project._id,
            title: project.title,
            description: project.description,
            status: project.status,
            createdAt: project.createdAt
        }
    })
})

/** @type {Controller} */
// Get All Project
const getAllProjects = catchAsync(async (req, res, next) => {
    const projects = await Projects.find()

    res.status(200).json({
        success: true,
        data: projects.map(p => ({
            id: p._id,
            title: p.title,
            description: p.description,
            status: p.status,
            createdAt: p.createdAt
        }))
    })

})

/** @type {Controller} */
// Get a particular Project
const getProject = catchAsync(async (req, res, next) => {
    const project = await Projects.findById(req.params.id)

    if (!project) {
        return next(new AppError(404, "Project not found"));
    }

    res.status(200).json({
        success: true,
        data: {
            id: project._id,
            title: project.title,
            description: project.description,
            status: project.status,
            createdAt: project.createdAt
        }
    })

})


/** @type {Controller} */
// Edit a particular Project
const editProject = catchAsync(async (req, res, next) => {

    const { title, description, status } = req.body;
    const project = await Projects.findByIdAndUpdate(
        req.params.id,
        { title, description, status },
        { returnDocument: 'after', runValidators: true }
    );

    if (!project) {
        return next(new AppError(404, "Project not found"));
    }

    res.status(200).json({
        success: true,
        data: {
            id: project._id,
            title: project.title,
            description: project.description,
            status: project.status,
            createdAt: project.createdAt
        }
    })

})

/** @type {Controller} */
// delete a particular Project
const deleteProject = catchAsync(async (req, res, next) => {
    const project = await Projects.findByIdAndDelete(req.params.id);

    if (!project) {
        return next(new AppError(404, "Project not found"));
    }

    res.status(200).json({
        success: true,
        message: "successfully deleted"
    })

})

module.exports = { createProject, getAllProjects, getProject, editProject, deleteProject }
