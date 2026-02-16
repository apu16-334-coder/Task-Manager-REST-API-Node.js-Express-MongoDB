require("dotenv").config();
const app = require("./src/app.js");
const connectDB = require("./src/config/db.js")

connectDB()

const PORT = process.env.PORT;

app.listen(PORT, ()=> console.log("server is running on the port: "+ PORT))
    .on("error", err => console.log('Server error:', err));