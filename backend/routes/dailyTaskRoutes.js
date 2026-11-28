const express = require("express");
const router = express.Router();

const {
    getMyTasks,
    createTask,
    updateTask,
    deleteTask,
} = require("../controllers/dailyTaskController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getMyTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;