class AppError extends Error {
    constructor(status, message) {
        super(message); // Calls the parent Error constructor
        this.status = status;
        this.isOperational = true; // Often used in Express for filtering

        // Optional: Captures stack trace (recommended for custom errors)
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError