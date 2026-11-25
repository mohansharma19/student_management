const mongoose = require("mongoose");
// student Schema

const studentSchema = new mongoose.Schema(
    {
        // link student with User account
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        // student information
        rollNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        className: {
            type: String,
            required: true,
            trim: true,

        },
        section: {
            type: String,
            trim: true,
        },
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },
        phone: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        parentName: {
            type: String,
            trim: true,
        },
        parentPhone: {
            type: String,
            trim: true,
        },
        admissionDate: {
            type: Date,
            default: Date.now,
        },


    },
    {
        timestamps: true,
    }
)

// export Student Model

module.exports = mongoose.model("Student", studentSchema);