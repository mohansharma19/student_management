
const mongoose = require("mongoose");

const homeworkSubmissionSchema = new mongoose.Schema(
    {
        homework: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Homework",
            required: true,
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        submissionText: {
            type: String,
            trim: true,
            default: "",
        },

        attachment: {
            type: String,
            default: "",
        },

        submittedAt: {
            type: Date,
            default: Date.now,
        },

        status: {
            type: String,
            enum: ["Submitted", "Late", "Reviewed"],
            default: "Submitted",
        },

        marksObtained: {
            type: Number,
            min: 0,
            default: null,
        },

        feedback: {
            type: String,
            trim: true,
            default: "",
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        reviewedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// One student can submit one homework only once
homeworkSubmissionSchema.index(
    {
        homework: 1,
        student: 1,
    },
    {
        unique: true,
    }
);

module.exports = mongoose.model(
    "HomeworkSubmission",
    homeworkSubmissionSchema
);
