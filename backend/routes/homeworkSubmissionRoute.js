
const express = require("express");
const router = express.Router();

// Controllers
const {
    submitHomework,
    getMySubmissions,
    getHomeworkSubmissions,
    reviewSubmission,
    getSubmissionById,
} = require("../controllers/homeworkSubmissionController");

// Middleware
const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");

// Student Routes
router.post(
    "/:homeworkId",
    protect,
    authorize("student"),
    submitHomework
);

router.get(
    "/my",
    protect,
    authorize("student"),
    getMySubmissions
);

// Teacher/Admin Routes
router.get(
    "/homework/:homeworkId",
    protect,
    authorize("teacher", "admin"),
    getHomeworkSubmissions
);

router.put(
    "/:id/review",
    protect,
    authorize("teacher", "admin"),
    reviewSubmission
);

// Single Submission
router.get(
    "/:id",
    protect,
    getSubmissionById
);

module.exports = router;
