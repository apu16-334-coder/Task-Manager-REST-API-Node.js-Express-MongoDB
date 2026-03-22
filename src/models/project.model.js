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

const transform = (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
};

projectSchema.set("toJSON", { transform });
projectSchema.set("toObject", { transform });

const Projects = mongoose.model('Project', projectSchema);

module.exports = Projects;