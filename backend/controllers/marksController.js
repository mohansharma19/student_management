
const Marks = require("../models/Marks");
const Student = require("../models/Student");

// adding marks        

const addMarks = async (req, res) => {
    try {
        const {
            student,
            subject,
            exam,
            totalMarks,
            obtainedMarks,
            academicYear,
            remarks,
        } = req.body;

        // Check required fields
        if (
            !student ||
            !subject ||
            !exam ||
            totalMarks === undefined ||
            obtainedMarks === undefined ||
            !academicYear
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        // Check student exists
        const studentExists = await Student.findById(student);

        if (!studentExists) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // Create marks
        const marks = await Marks.create({
            student,
            subject,
            exam,
            totalMarks,
            obtainedMarks,
            academicYear,
            remarks,
            addedBy: req.user.id,
        });

        return res.status(201).json({
            success: true,
            message: "Marks added successfully",
            marks,
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Marks already exist for this student, subject, exam and academic year",
            });
        }

        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// getting all marks from here


const getAllMarks = async (req, res) => {
    try {
        const marks = await Marks.find()
            .populate("student", "rollNumber")
            .populate("addedBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: marks.length,
            marks,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// getting marks by Student

const getStudentMarks = async (req, res) => {
    try {
        const { studentId } = req.params;

        const studentExists = await Student.findById(studentId);

        if (!studentExists) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        const marks = await Marks.find({
            student: studentId,
        })
            .populate("student", "rollNumber")
            .sort({ academicYear: -1, subject: 1 });

        return res.status(200).json({
            success: true,
            count: marks.length,
            marks,
        });

    } catch (error) {
        const status = error.name === "CastError" ? 400 : 500;

        return res.status(status).json({
            success: false,
            message: error.message,
        });
    }
};

// updating marks 


const updateMarks = async (req, res) => {
    try {
        const { id } = req.params;

        const allowedFields = [
            "subject",
            "exam",
            "totalMarks",
            "obtainedMarks",
            "academicYear",
            "remarks",
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update",
            });
        }

        const marks = await Marks.findById(id);

        if (!marks) {
            return res.status(404).json({
                success: false,
                message: "Marks not found",
            });
        }

        Object.assign(marks, updates);

        await marks.save();

        return res.status(200).json({
            success: true,
            message: "Marks updated successfully",
            marks,
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "These marks already exist",
            });
        }

        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// deleting marks 

const deleteMarks = async (req, res) => {
    try {
        const { id } = req.params;

        const marks = await Marks.findByIdAndDelete(id);

        if (!marks) {
            return res.status(404).json({
                success: false,
                message: "Marks not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Marks deleted successfully",
        });

    } catch (error) {
        const status = error.name === "CastError" ? 400 : 500;

        return res.status(status).json({
            success: false,
            message: error.message,
        });
    }
};

// export controllers

module.exports = {
    addMarks,
    getAllMarks,
    getStudentMarks,
    updateMarks,
    deleteMarks,
};
