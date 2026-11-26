
const mongoose = require("mongoose");

// Marks Schema
const marksSchema = new mongoose.Schema(
    {
        // Student reference
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        // Subject name
        subject: {
            type: String,
            required: true,
            trim: true,
        },

        // Examination name
        exam: {
            type: String,
            required: true,
            trim: true,
        },

        // Total marks
        totalMarks: {
            type: Number,
            required: true,
            min: 1,
        },

        // Obtained marks
        obtainedMarks: {
            type: Number,
            required: true,
            min: 0,
        },

        // Academic year
        academicYear: {
            type: String,
            required: true,
            trim: true,
        },

        // Optional remark
        remarks: {
            type: String,
            trim: true,
        },

        // Admin who entered the marks
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Validate obtained marks
marksSchema.pre("validate", function () {
    if (this.obtainedMarks > this.totalMarks) {
        this.invalidate(
            "obtainedMarks",
            "Obtained marks cannot exceed total marks"
        );
    }
});

// Prevent duplicate subject marks
marksSchema.index(
    {
        student: 1,
        subject: 1,
        exam: 1,
        academicYear: 1,
    },
    {
        unique: true,
    }
);

// Export Marks Model
module.exports = mongoose.model("Marks", marksSchema);
