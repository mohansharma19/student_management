
const express = require("express");
const router = express.Router();

// Import controller functions
const {
    submitHomework,
    getMySubmissions,
    getHomeworkSubmissions,
    reviewSubmission,
    getSubmissionById,
} = require("../controllers/homeworkSubmissionController");

// Import authentication middleware
const { protect } = require("../middleware/authMiddleware");

// Student routes
router.post("/:homeworkId", protect, submitHomework);
router.get("/my", protect, getMySubmissions);

// Teacher/Admin routes
router.get("/homework/:homeworkId", protect, getHomeworkSubmissions);
router.put("/:id/review", protect, reviewSubmission);

// Single submission
router.get("/:id", protect, getSubmissionById);

module.exports = router;
