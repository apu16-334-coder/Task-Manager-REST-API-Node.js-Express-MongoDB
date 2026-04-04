// Load dependencies
const jwt = require("jsonwebtoken");

// Import important Modules
const catchAsync = require("../utils/catchAsync.js");
const Users = require("../models/user.model.js");
const AppError = require("../utils/AppError.js");

/**
 * Middleware to protect routes by verifying JWT tokens
 * 1. Check for token in Authorization header
 * 2. Verify token
 * 3. Check if user exists
 * 4. Check if password was changed after token issued
 * 5. Attach user to req object
 */
const protect = catchAsync(async (req, res, next) => {
    let token;

    // 1️⃣ Get token from header
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ If no token found
    if (!token) {
        return next(new AppError(401, "You are not logged in. Please log in"));
    }

    // 3️⃣ Verify token
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return next(new AppError(401, "Invalid or expired token"));
    }

    // 4️⃣ Check if user still exists
    const currentUser = await Users.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError(401, "User no longer exists"));
    }

    // 5️⃣ Check if user changed password after token was issued
    if (currentUser.passwordChangedAt) {
        const changedTimestamp = parseInt(
            currentUser.passwordChangedAt.getTime() / 1000,
            10
        );
        if (decoded.iat < changedTimestamp) {
            return next(new AppError(401, "Password recently changed. Please log in again"));
        }
    }

    // 6️⃣ Attach user to request
    req.user = currentUser;
    next();
});

/**
 * restrictTo
 * Middleware to restrict access based on user roles
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'manager')
 */
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError(403, "You do not have permission to perform this action"));
        }
        next();
    };
};

module.exports = { protect, restrictTo };