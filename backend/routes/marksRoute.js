
const express = require("express");
const router = express.Router();

const {
    addMarks,
    getAllMarks,
    getStudentMarks,
    updateMarks,
    deleteMarks,
} = require("../controllers/marksController");

const { protect } = require("../middleware/authMiddleware");

// Protect all routes
router.use(protect);

// Add marks
router.post("/", addMarks);

// Get all marks
router.get("/", getAllMarks);

// Get marks of a particular student
router.get("/student/:studentId", getStudentMarks);

// Update marks
router.put("/:id", updateMarks);

// Delete marks
router.delete("/:id", deleteMarks);

module.exports = router;
