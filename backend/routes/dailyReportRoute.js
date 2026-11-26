
const express = require("express");
const router = express.Router();

// Import controller functions
const {
    createDailyReport,
    getAllDailyReports,
    getDailyReportById,
    getReportsByStudent,
    updateDailyReport,
    deleteDailyReport,
} = require("../controllers/dailyReportController");

// Import authentication middleware
const { protect } = require("../middleware/authMiddleware");

// Protect all routes
router.use(protect);

// 1. Create daily report
router.post("/", createDailyReport);

// 2. Get all daily reports
router.get("/", getAllDailyReports);

// 3. Get reports by student ID
router.get("/student/:studentId", getReportsByStudent);

// 4. Get single daily report by ID
router.get("/:id", getDailyReportById);

// 5. Update daily report
router.put("/:id", updateDailyReport);

// 6. Delete daily report
router.delete("/:id", deleteDailyReport);

module.exports = router;
