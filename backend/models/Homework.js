
const mongoose = require("mongoose");

const homeWorkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
        },

        className: {
            type: String,
            required: true,
            trim: true,
        },

        section: {
            type: String,
            required: true,
            trim: true,
        },

        assignedDate: {
            type: Date,
            default: Date.now,
        },

        dueDate: {
            type: Date,
            required: true,
        },

        attachment: {
            type: String,
            default: null,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: ["Active", "Completed", "Expired"],
            default: "Active",
        },
    },
    {
        timestamps: true,
    }
);

// Validate due date
homeWorkSchema.pre("validate", function () {
    if (
        this.dueDate &&
        this.assignedDate &&
        this.dueDate < this.assignedDate
    ) {
        this.invalidate(
            "dueDate",
            "Due date cannot be before assigned date"
        );
    }
});

module.exports = mongoose.model("Homework", homeWorkSchema);
