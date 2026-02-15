const AppError = require("../utils/AppError.js")

// This catches routes that don't exist
const noRouteFound = (req, res, next) => {
    next(new AppError(404, `Route Not Found - ${req.url}`));
};

const globalErrorHandler = (err, req, res, next)=>{
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    })
}

module.exports = {noRouteFound, globalErrorHandler}