const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters'],
        maxlength: [30, 'Name must be at most 30 characters']
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please provide a valid email'
        ]
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, 'Password must be in 8 characters'],
        select: false
    },

    role: {
        type: String,
        enum: ['user', 'manager', 'admin'],
        default: 'user'
    },

    isActive: {
        type: Boolean,
        default: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    passwordChangedAt: Date
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);

    // Set passwordChangedAt (exclude new user creation edge case)
    if (!this.isNew) {
        this.passwordChangedAt = Date.now() - 1000;
    }

    next();
});

const transform = (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
};

userSchema.set("toJSON", { transform });
userSchema.set("toObject", { transform });

const Users = mongoose.model('User', userSchema);

module.exports = Users;