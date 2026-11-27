
const express = require("express");
const router = express.Router();

// Import controllers
const {
    createHomework,
    getAllHomework,
    getHomeworkById,
    updateHomework,
    deleteHomework,
} = require("../controllers/homeworkController");

// Import authentication middleware
const { protect } = require("../middleware/authMiddleware");

// Homework CRUD Routes

// Create homework
router.post("/", protect, createHomework);

// Get all homework
router.get("/", protect, getAllHomework);

// Get homework by ID
router.get("/:id", protect, getHomeworkById);

// Update homework
router.put("/:id", protect, updateHomework);

// Delete homework
router.delete("/:id", protect, deleteHomework);

module.exports = router;
