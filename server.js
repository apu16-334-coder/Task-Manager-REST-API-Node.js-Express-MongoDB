require("dotenv").config();
const PORT = process.env.PORT;
const app = require("./src/app.js");

app.listen(PORT, ()=> console.log("server is running on the port: "+ PORT))
    .on("error", err => console.log('Server error:', err));