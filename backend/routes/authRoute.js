const express = require("express");

const {
    registerUser,
    loginUser,
    verifyEmail,
    getMe,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Email Verification
router.get("/verify-email", verifyEmail);

// Protected Routes
router.get("/me", protect, getMe);

module.exports = router;