
const mongoose = require("mongoose");

const DailyReport = require("../models/DailyReport");
const Student = require("../models/Student");


// Helper: Allow only Admin and Teacher
const checkStaffAccess = (req, res) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "Not authorized. Please login first",
        });
        return false;
    }

    const role = req.user.role?.toLowerCase();

    if (!["admin", "teacher"].includes(role)) {
        res.status(403).json({
            success: false,
            message: "Only admin and teacher can access this resource",
        });
        return false;
    }

    return true;
};


//  CREATE DAILY REPORT
const createDailyReport = async (req, res) => {
    try {
        if (!checkStaffAccess(req, res)) return;

        const {
            student,
            date,
            attendance,
            homework,
            description,
            status,
            academicPerformance,
            teacherRemarks,
        } = req.body;

        // Required fields validation
        if (
            !student ||
            !date ||
            !attendance ||
            !homework ||
            !description
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        // Validate student ID
        if (!mongoose.Types.ObjectId.isValid(student)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }

        // Check student exists
        const studentExists = await Student.findById(student);

        if (!studentExists) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // Validate date
        const reportDate = new Date(date);

        if (isNaN(reportDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid report date",
            });
        }

        // Create report
        const dailyReport = await DailyReport.create({
            student,
            date: reportDate,
            attendance,
            homework,
            description,
            status,
            academicPerformance,
            teacherRemarks,

            // Automatically get logged-in user ID
            createdBy: req.user.id,

        });

        return res.status(201).json({
            success: true,
            message: "Daily report created successfully",
            dailyReport,
        });

    } catch (error) {
        console.error("Create Daily Report Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


//  GET ALL DAILY REPORTS
const getAllDailyReports = async (req, res) => {
    try {
        if (!checkStaffAccess(req, res)) return;

        const { student, attendance, status, startDate, endDate } = req.query;

        const filter = {};

        if (student) {
            if (!mongoose.Types.ObjectId.isValid(student)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid student ID",
                });
            }

            filter.student = student;
        }

        if (attendance) {
            filter.attendance = attendance;
        }

        if (status) {
            filter.status = status;
        }

        // Date range filter
        if (startDate || endDate) {
            filter.date = {};

            if (startDate) {
                filter.date.$gte = new Date(startDate);

                if (isNaN(filter.date.$gte.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid start date",
                    });
                }
            }

            if (endDate) {
                filter.date.$lte = new Date(endDate);

                if (isNaN(filter.date.$lte.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid end date",
                    });
                }
            }
        }

        const reports = await DailyReport.find(filter)
            .populate("student")
            .populate("createdBy", "name email role")
            .sort({ date: -1 });

        return res.status(200).json({
            success: true,
            count: reports.length,
            reports,
        });

    } catch (error) {
        console.error("Get Daily Reports Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


// GET SINGLE DAILY REPORT
const getDailyReportById = async (req, res) => {
    try {
        if (!checkStaffAccess(req, res)) return;

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report ID",
            });
        }

        const report = await DailyReport.findById(id)
            .populate("student")
            .populate("createdBy", "name email role");

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Daily report not found",
            });
        }

        return res.status(200).json({
            success: true,
            report,
        });

    } catch (error) {
        console.error("Get Daily Report Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


// GET REPORTS BY STUDENT
const getReportsByStudent = async (req, res) => {
    try {
        if (!checkStaffAccess(req, res)) return;

        const { studentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }

        const studentExists = await Student.findById(studentId);

        if (!studentExists) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        const reports = await DailyReport.find({
            student: studentId,
        })
            .populate("student")
            .populate("createdBy", "name email role")
            .sort({ date: -1 });

        return res.status(200).json({
            success: true,
            count: reports.length,
            reports,
        });

    } catch (error) {
        console.error("Get Student Reports Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


//  UPDATE DAILY REPORT
const updateDailyReport = async (req, res) => {
    try {
        if (!checkStaffAccess(req, res)) return;

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report ID",
            });
        }

        const report = await DailyReport.findById(id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Daily report not found",
            });
        }

        const allowedFields = [
            "student",
            "date",
            "attendance",
            "homework",
            "description",
            "status",
            "academicPerformance",
            "teacherRemarks",
        ];

        // Update only allowed fields
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                report[field] = req.body[field];
            }
        }

        // Validate updated student
        if (req.body.student !== undefined) {
            if (!mongoose.Types.ObjectId.isValid(req.body.student)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid student ID",
                });
            }

            const studentExists = await Student.findById(req.body.student);

            if (!studentExists) {
                return res.status(404).json({
                    success: false,
                    message: "Student not found",
                });
            }
        }

        // Validate updated date
        if (req.body.date !== undefined) {
            const reportDate = new Date(req.body.date);

            if (isNaN(reportDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid report date",
                });
            }

            report.date = reportDate;
        }

        // Save runs schema validation and pre-validate hook
        await report.save();

        const updatedReport = await DailyReport.findById(id)
            .populate("student")
            .populate("createdBy", "name email role");

        return res.status(200).json({
            success: true,
            message: "Daily report updated successfully",
            dailyReport: updatedReport,
        });

    } catch (error) {
        console.error("Update Daily Report Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


// DELETE DAILY REPORT
const deleteDailyReport = async (req, res) => {
    try {
        if (!checkStaffAccess(req, res)) return;

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report ID",
            });
        }

        const report = await DailyReport.findById(id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Daily report not found",
            });
        }

        await DailyReport.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Daily report deleted successfully",
        });

    } catch (error) {
        console.error("Delete Daily Report Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


module.exports = {
    createDailyReport,
    getAllDailyReports,
    getDailyReportById,
    getReportsByStudent,
    updateDailyReport,
    deleteDailyReport,
};
