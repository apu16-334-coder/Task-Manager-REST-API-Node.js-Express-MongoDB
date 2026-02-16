const Users = require("../models/user.model.js")

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {(req: Request, res: Response)=> void} Controller
 */

/** @type {Controller} */
// Create User
const createUser = async( req, res, next)=> {
    try {
        const {_id,name,email,role} = await Users.create(req.body)  

        res.status(201).json({
            success: true,
            data: {_id,name,email,role}
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {createUser}
