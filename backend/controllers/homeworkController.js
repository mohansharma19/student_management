
const Homework = require("../models/Homework");

//  Automatically expire overdue homework
const updateExpiredHomework = async () => {
    await Homework.updateMany(
        {
            status: "Active",
            dueDate: { $lt: new Date() },
        },
        {
            $set: { status: "Expired" },
        }
    );
};


//  CREATE HOMEWORK
const createHomework = async (req, res) => {
    try {
        const {
            title,
            description,
            subject,
            className,
            section,
            assignedDate,
            dueDate,
            attachment,
        } = req.body;

        // Validate required fields
        if (
            !title ||
            !description ||
            !subject ||
            !className ||
            !section ||
            !dueDate
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        const homework = await Homework.create({
            title,
            description,
            subject,
            className,
            section,
            assignedDate,
            dueDate,
            attachment,
            createdBy: req.user.id,
            status: new Date(dueDate) < new Date()
                ? "Expired"
                : "Active",
        });

        res.status(201).json({
            success: true,
            message: "Homework created successfully",
            homework,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


//  GET ALL HOMEWORK
const getAllHomework = async (req, res) => {
    try {
        await updateExpiredHomework();

        const homework = await Homework.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: homework.length,
            homework,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


//  GET HOMEWORK BY ID
const getHomeworkById = async (req, res) => {
    try {
        await updateExpiredHomework();

        const homework = await Homework.findById(req.params.id)
            .populate("createdBy", "name email");

        if (!homework) {
            return res.status(404).json({
                success: false,
                message: "Homework not found",
            });
        }

        res.status(200).json({
            success: true,
            homework,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


//  UPDATE HOMEWORK
const updateHomework = async (req, res) => {
    try {
        const homework = await Homework.findById(req.params.id);

        if (!homework) {
            return res.status(404).json({
                success: false,
                message: "Homework not found",
            });
        }

        const allowedFields = [
            "title",
            "description",
            "subject",
            "className",
            "section",
            "assignedDate",
            "dueDate",
            "attachment",
            "status",
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                homework[field] = req.body[field];
            }
        });

        // Automatically expire overdue homework
        if (
            homework.status === "Active" &&
            homework.dueDate < new Date()
        ) {
            homework.status = "Expired";
        }

        await homework.save();

        res.status(200).json({
            success: true,
            message: "Homework updated successfully",
            homework,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


//  DELETE HOMEWORK
const deleteHomework = async (req, res) => {
    try {
        const homework = await Homework.findById(req.params.id);

        if (!homework) {
            return res.status(404).json({
                success: false,
                message: "Homework not found",
            });
        }

        await Homework.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Homework deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    createHomework,
    getAllHomework,
    getHomeworkById,
    updateHomework,
    deleteHomework,
};
