const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const {
    getMyProfile,
    updateMyProfile,
    changePassword,
    getStudentProfile,
} = require("../controllers/profileController");

// Admin and Student: View own profile
router.get("/me", protect, getMyProfile);

// Admin and Student: Update own profile
router.put("/me", protect, updateMyProfile);

// Admin and Student: Change password
router.put("/change-password", protect, changePassword);

// Only Admin: View any student's profile
router.get(
    "/student/:id",
    protect,
    authorize("admin"),
    getStudentProfile
);

module.exports = router;