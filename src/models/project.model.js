const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true,
        minlength: [3, 'Project title too short']
    },

    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description too long']
    },

    status: {
        type: String,
        enum: ['planned', 'active', 'completed'],
        default: 'planned'
    },

    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Project must belong to a user']
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// **Add this here**
projectSchema.set("toJSON", {
    transform: function (doc, ret) {
        ret.id = ret._id;   // rename _id → id
        delete ret._id;     // remove _id
        delete ret.__v;     // remove __v
    }
});

const Projects = mongoose.model('Project', projectSchema);

module.exports = Projects;