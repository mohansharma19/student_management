const express = require("express");
const router = express.Router();

// Import authentication middleware
const { protect, authorize } = require("../middleware/authMiddleware");

// Import student controller functions
const {
    addStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
} = require("../controllers/studentController");

// only student routes 


// Add new student
router.post("/", protect, authorize("admin"), addStudent);

// Get all students
router.get("/", protect, authorize("admin"), getAllStudents);

// Get single student by ID
router.get("/:id", protect, authorize("admin"), getStudentById);

// Update student
router.put("/:id", protect, authorize("admin"), updateStudent);

// Delete student
router.delete("/:id", protect, authorize("admin"), deleteStudent);

// Export router
module.exports = router;