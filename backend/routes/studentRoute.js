
const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const studentController = require("../controllers/studentController");

// Student: Get own profile
router.get(
    "/profile/me",
    protect,
    authorize("student"),
    studentController.getMyStudentProfile
);

// Admin routes
router.post("/", protect, authorize("admin"), studentController.addStudent);

router.get("/", protect, authorize("admin"), studentController.getAllStudents);

router.get("/:id", protect, authorize("admin"), studentController.getStudentById);

router.put("/:id", protect, authorize("admin"), studentController.updateStudent);

router.delete("/:id", protect, authorize("admin"), studentController.deleteStudent);

module.exports = router;
