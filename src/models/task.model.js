const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        minlength: [3, 'Task title is too short']
    },

    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Task description too long']
    },

    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },

    status: {
        type: String,
        enum: ['todo', 'in-progress', 'done'],
        default: 'todo'
    },

    dueDate: {
        type: Date,
        validation: {
            validator: function (val) {
                return !val || val >= Date.now()
            },
            message: 'Due date must be in the future'
        }
    },

    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        required: [true, "task must belong to a project"]
    },

    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

})

const Tasks = mongoose.model('Task', taskSchema)

module.exports = Tasks