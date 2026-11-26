
const mongoose = require("mongoose");

const dailyReportSchema = new mongoose.Schema(
    {
        // Student reference
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        // Report date
        date: {
            type: Date,
            required: true,
        },

        // Attendance status
        attendance: {
            type: String,
            required: true,
            enum: ["Present", "Absent", "Late", "Leave"],
        },

        // Homework details
        homework: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        // Homework submission status
        status: {
            type: String,
            enum: ["Pending", "Submitted", "NotSubmitted"],
            default: "Pending",
        },

        // Academic performance
        academicPerformance: {
            subject: {
                type: String,
                trim: true,
            },

            score: {
                type: Number,
                min: 0,
            },

            totalMarks: {
                type: Number,
                min: 1,
            },
        },

        // Teacher remarks
        teacherRemarks: {
            type: String,
            trim: true,
        },

        // Admin/Teacher who created report
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Validate academic score
dailyReportSchema.pre("validate", function () {

    if (
        this.academicPerformance?.score !== undefined &&
        this.academicPerformance?.totalMarks !== undefined &&
        this.academicPerformance.score >
        this.academicPerformance.totalMarks
    ) {
        this.invalidate(
            "academicPerformance.score",
            "Score cannot exceed total marks"
        );
    }
});

// prevent duplicate daily report same student and date
dailyReportSchema.index(
    {
        student: 1,
        date: 1,
    },
    {
        unique: true,
    }
)

module.exports = mongoose.model("DailyReport", dailyReportSchema);
