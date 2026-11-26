
const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

// Helper: rat me date ko normalise karne ke liye 
const normalizeDate = (value) => {
    const date = new Date(value);

    if (isNaN(date.getTime())) {
        return null;
    }

    date.setUTCHours(0, 0, 0, 0);
    return date;
};

// Helper: attendence details ko populate karne ke liye h 

const populateAttendance = (query) => {
    return query
        .populate({
            path: "student",
            populate: {
                path: "user",
                select: "name email",
            },
        })
        .populate("markedBy", "name email");
};


// Adding attendence
const addAttendance = async (req, res) => {
    try {
        const { student, date, status, remarks } = req.body;

        if (!student || !date || !status) {
            return res.status(400).json({
                success: false,
                message: "Student, date and status are required",
            });
        }

        if (!mongoose.isValidObjectId(student)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }

        const validStatuses = ["Present", "Absent", "Late", "Leave"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance status",
            });
        }

        const attendanceDate = normalizeDate(date);

        if (!attendanceDate) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance date",
            });
        }

        const existingStudent = await Student.findById(student);

        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // Checking duplicate attendance for same student and day
        const existingAttendance = await Attendance.findOne({
            student,
            date: attendanceDate,
        });

        if (existingAttendance) {
            return res.status(409).json({
                success: false,
                message: "Attendance already marked for this student today",
            });
        }

        const attendance = await Attendance.create({
            student,
            date: attendanceDate,
            status,
            remarks,
            markedBy: req.user.id,
        });

        const populatedAttendance = await populateAttendance(
            Attendance.findById(attendance._id)
        );

        return res.status(201).json({
            success: true,
            message: "Attendance marked successfully",
            attendance: populatedAttendance,
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Attendance already exists for this student on this date",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to mark attendance",
            error: error.message,
        });
    }
};


// getting all attendence 
const getAllAttendance = async (req, res) => {
    try {
        const { date, student, status } = req.query;

        const filter = {};

        if (student) {
            if (!mongoose.isValidObjectId(student)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid student ID",
                });
            }

            filter.student = student;
        }

        if (status) {
            const validStatuses = ["Present", "Absent", "Late", "Leave"];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid attendance status",
                });
            }

            filter.status = status;
        }

        if (date) {
            const selectedDate = normalizeDate(date);

            if (!selectedDate) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid attendance date",
                });
            }

            const nextDate = new Date(selectedDate);
            nextDate.setUTCDate(nextDate.getUTCDate() + 1);

            filter.date = {
                $gte: selectedDate,
                $lt: nextDate,
            };
        }

        const attendance = await populateAttendance(
            Attendance.find(filter).sort({ date: -1, createdAt: -1 })
        );

        return res.status(200).json({
            success: true,
            count: attendance.length,
            attendance,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch attendance",
            error: error.message,
        });
    }
};


// getting single attendence 
const getAttendanceById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance ID",
            });
        }

        const attendance = await populateAttendance(
            Attendance.findById(id)
        );

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance not found",
            });
        }

        return res.status(200).json({
            success: true,
            attendance,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch attendance",
            error: error.message,
        });
    }
};


// GET STUDENT ATTENDANCE
const getStudentAttendance = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }

        const attendance = await populateAttendance(
            Attendance.find({ student: studentId })
                .sort({ date: -1 })
        );

        return res.status(200).json({
            success: true,
            count: attendance.length,
            attendance,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch student attendance",
            error: error.message,
        });
    }
};


//for updating attendence 
const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks, date } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance ID",
            });
        }

        const attendance = await Attendance.findById(id);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance not found",
            });
        }

        if (status !== undefined) {
            const validStatuses = ["Present", "Absent", "Late", "Leave"];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid attendance status",
                });
            }

            attendance.status = status;
        }

        if (remarks !== undefined) {
            attendance.remarks = remarks;
        }

        if (date !== undefined) {
            const attendanceDate = normalizeDate(date);

            if (!attendanceDate) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid attendance date",
                });
            }

            const duplicate = await Attendance.findOne({
                student: attendance.student,
                date: attendanceDate,
                _id: { $ne: id },
            });

            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    message: "Attendance already exists for this date",
                });
            }

            attendance.date = attendanceDate;
        }

        await attendance.save();

        const updatedAttendance = await populateAttendance(
            Attendance.findById(id)
        );

        return res.status(200).json({
            success: true,
            message: "Attendance updated successfully",
            attendance: updatedAttendance,
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Attendance already exists for this date",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update attendance",
            error: error.message,
        });
    }
};


// deleting attendance 
const deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance ID",
            });
        }

        const attendance = await Attendance.findByIdAndDelete(id);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Attendance deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete attendance",
            error: error.message,
        });
    }
};


module.exports = {
    addAttendance,
    getAllAttendance,
    getAttendanceById,
    getStudentAttendance,
    updateAttendance,
    deleteAttendance,
};
