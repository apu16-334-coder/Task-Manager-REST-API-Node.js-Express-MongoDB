const { json } = require("express");
const AppError = require("../utils/AppError.js")

// This catches routes that don't exist
const noRouteFound = (req, res, next) => {
    next(new AppError(404, `Route Not Found - ${req.url}`));
};

const globalErrorHandler = (err, req, res, next)=>{
    console.error(err.stack);

    // A. Duplicate Key (e.g., unique email, password)
    if (err.code === 11000) {
        err = new AppError(400, `${Object.keys(err.keyValue)} is already exists`);
    }

    if (err.name === "ValidationError" || err.name === "CastError") {
        err.status = 400;
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    })
}

module.exports = {noRouteFound, globalErrorHandler}