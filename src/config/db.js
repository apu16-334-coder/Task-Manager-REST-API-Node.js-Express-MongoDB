const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // optional, but helps fail fast
        })

        console.log('Mongoose connected to MongoDB Atlas');
    } catch (error) {
        console.error('Mongoose connection error:', err);

        process.exit(1);
    }
}


module.exports = connectDB