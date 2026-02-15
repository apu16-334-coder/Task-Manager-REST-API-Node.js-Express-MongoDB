const {noRouteFound, globalErrorHandler} = require("./middlewares/error.middleware.js")
const express = require("express")
const app = express()

app.use(express.json())

app.get("/", (req,res)=>{
    res.send("Api is running......")
})

// Invalid Route Error Handler
app.use(noRouteFound)

app.use(globalErrorHandler)

module.exports = app