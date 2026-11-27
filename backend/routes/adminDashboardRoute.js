
const express = require("express");
const router = express.Router();

// Authentication and authorization middleware
const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");

// Dashboard controller
const {
    getAdminDashboard,
} = require("../controllers/adminDashboardController");

// GET: Admin Dashboard
router.get(
    "/admin",
    protect,
    authorize("admin"),
    getAdminDashboard
);

module.exports = router;
