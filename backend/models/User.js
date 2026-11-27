const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // User name
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },

        // Email address
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },

        // Password
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false,
        },

        // User role
        role: {
            type: String,
            enum: ["admin", "student"],
            default: "student",
        },

        // Phone number (NEW)
        phone: {
            type: String,
            trim: true,
            default: "",
        },

        // Profile image URL (NEW)
        profileImage: {
            type: String,
            default: "",
        },

        // Email verification
        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        // Email verification token hash
        emailVerificationTokenHash: {
            type: String,
            default: null,
            select: false,
        },

        // Email verification token expiry
        emailVerificationTokenExpires: {
            type: Date,
            default: null,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

// Create User model
const User = mongoose.model("User", userSchema);

module.exports = User;