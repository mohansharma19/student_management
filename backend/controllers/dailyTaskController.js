
const DailyTask = require("../models/DailyTask");

// Get all tasks of logged-in student
exports.getMyTasks = async (req, res) => {
    try {
        const tasks = await DailyTask.find({
            user: req.user.id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Create task
exports.createTask = async (req, res) => {
    try {
        const { title, date } = req.body;

        if (!title?.trim() || !date) {
            return res.status(400).json({
                success: false,
                message: "Title and date are required",
            });
        }

        const task = await DailyTask.create({
            user: req.user.id,
            title: title.trim(),
            date,
        });

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update task
exports.updateTask = async (req, res) => {
    try {
        const { title, completed } = req.body;

        const task = await DailyTask.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Title cannot be empty",
                });
            }
            task.title = title.trim();
        }

        if (completed !== undefined) {
            task.completed = completed;
        }

        await task.save();

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete task
exports.deleteTask = async (req, res) => {
    try {
        const task = await DailyTask.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
