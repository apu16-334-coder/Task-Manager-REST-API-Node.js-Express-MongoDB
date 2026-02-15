const globalErrorHandler = require("./middlewares/error.middleware.js")
const express = require("express")
const app = express()

app.use(express.json())

app.get("/", (req,res)=>{
    res.send("Api is running......")
})

// Invalid Rourte Error Handler
app.use((req,res,next)=>{   
    const error = new Error("Route not Found");
    error.status = 404
    next(error)
})

app.use(globalErrorHandler)

module.exports = app