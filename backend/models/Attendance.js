
const mongoose = require("mongoose");

// Attendance Schema
const attendanceSchema = new mongoose.Schema(
    {
        // for student
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        // date of attendence 

        date: {
            type: Date,
            required: true,
        },

        // checking status of students 

        status: {
            type: String,
            enum: ["Present", "Absent", "Late", "Leave"],
            required: true,
        },
        //  remarks by teacher 
        remarks: {
            type: String,
            trim: true,
        },
        // mark by teacher 
        markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate attendance for same student on same day
attendanceSchema.index(
    { student: 1, date: 1 },
    { unique: true }
);

// Export Attendance Model
module.exports = mongoose.model("Attendance", attendanceSchema);
