const express = require("express")
const app = express()

app.use(express.json())

app.get("/", (req,res)=>{
    res.send("Api is running......")
})

// Invalid Rourte Error Handler

app.use((req,res,next)=>{   
    res.status(400).json({
        success: false,
        message: "Route not Found"
    });
})

module.exports = app