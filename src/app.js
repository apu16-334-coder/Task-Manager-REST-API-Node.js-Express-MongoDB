const { noRouteFound, globalErrorHandler } = require("./middlewares/error.middleware.js")

const userRouter = require("./routes/user.route.js")
const projectRouter = require("./routes/project.route.js")
const taskRouter = require("./routes/task.route.js")
const authRouter = require("./routes/auth.route.js")

const express = require("express")
const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Api is running......")
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