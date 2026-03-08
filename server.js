require("dotenv").config();
const app = require("./src/app.js");
const connectDB = require("./src/config/db.js")

connectDB()

const PORT = process.env.PORT;

app.listen(
    PORT, 
    ()=> console.log(`App running in ${process.env.NODE_ENV} mode on port ${PORT}`)
).on("error", err => console.log('Server error:', err));