
const express = require("express");
const router = express.Router();

const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");

const {
    getStudentDashboard,
} = require("../controllers/studentDashboardController");

// GET Student Dashboard
router.get(
    "/",
    protect,
    authorize("student"),
    getStudentDashboard
);

module.exports = router;
