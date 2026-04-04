// Load dependencies
const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const rateLimit = require("express-rate-limit");

// Import important modules
const { noRouteFound, globalErrorHandler } = require("./middlewares/error.middleware.js")
const userRouter = require("./routes/user.route.js")
const projectRouter = require("./routes/project.route.js")
const taskRouter = require("./routes/task.route.js")
const authRouter = require("./routes/auth.route.js")

const app = express()

// ✔ Query parser extended
app.set('query parser', 'extended');

// Security middlewares
app.use(helmet())
app.use(cors())

// Body parser: limit JSON size to 10kb to prevent large payload abuse
app.use(express.json({ limit: "10kb" }))

// Rate Limiter: limit requests to 100 per IP per hour
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: "Too many requests from this IP, please try again later."
});
app.use("/api", limiter);

// Health route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API running"
  })
})

/* ---------- ROUTES ---------- */

app.use("/api/v1/auth", authRouter)

app.use("/api/v1/users", userRouter)

app.use("/api/v1/projects", projectRouter)

app.use("/api/v1/tasks", taskRouter)

/* ---------- ERROR HANDLERS ---------- */

app.use(noRouteFound)

app.use(globalErrorHandler)

module.exports = app