
const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const {
    addAttendance,
    getAllAttendance,
    getAttendanceById,
    getStudentAttendance,
    updateAttendance,
    deleteAttendance,
} = require("../controllers/attendanceController");

// Add Attendance
router.post("/", protect, authorize("admin"), addAttendance);

// Get All Attendance
router.get("/", protect, authorize("admin"), getAllAttendance);

// Get Attendance By Student ID
router.get("/student/:studentId", protect, authorize("admin"), getStudentAttendance);

// Get Attendance By ID
router.get("/:id", protect, authorize("admin"), getAttendanceById);

// Update Attendance
router.put("/:id", protect, authorize("admin"), updateAttendance);

// Delete Attendance
router.delete("/:id", protect, authorize("admin"), deleteAttendance);

module.exports = router;
