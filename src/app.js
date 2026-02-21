const {noRouteFound, globalErrorHandler} = require("./middlewares/error.middleware.js")
const userRouter = require("./routes/user.route.js")
const projectRouter = require("./routes/project.route.js")
const taskRouter = require("./routes/task.route.js")

const express = require("express")
const app = express()

app.use(express.json())

app.get("/", (req,res)=>{
    res.send("Api is running......")
})

app.use("/users", userRouter);

app.use("/projects", projectRouter);

app.use("/tasks", taskRouter);



// Invalid Route Error Handler
app.use(noRouteFound)

app.use(globalErrorHandler)

module.exports = app