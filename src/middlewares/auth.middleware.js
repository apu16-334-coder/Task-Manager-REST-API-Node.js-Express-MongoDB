const catchAsync = require("../utils/catchAsync.js");
const Users = require("../models/user.model.js");
const AppError = require("../utils/AppError.js");
const jwt = require("jsonwebtoken");

/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

const protect = catchAsync(
    /** @type {RequestHandler} */
    async(req, res, next)=> {
        let token;
        // 1️⃣ Get token from header
        if(
            req.header.authorization &&
            req.header.authorization.startsWith('Bearer')
        ) {
            token = req.header.authorization.split(" ")[1];
        }
    }
)