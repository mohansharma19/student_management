
const Student = require("../models/Student");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Add new student
const addStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            rollNumber,
            className,
            section,
            dateOfBirth,
            gender,
            phone,
            address,
            parentName,
            parentPhone,
        } = req.body;

        if (!name || !email || !password || !rollNumber || !className) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase().trim(),
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        const existingStudent = await Student.findOne({ rollNumber });

        if (existingStudent) {
            return res.status(409).json({
                success: false,
                message: "Roll number already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: "student",
            isEmailVerified: true,
        });

        const student = await Student.create({
            user: user._id,
            rollNumber,
            className,
            section,
            dateOfBirth,
            gender,
            phone,
            address,
            parentName,
            parentPhone,
        });

        return res.status(201).json({
            success: true,
            message: "Student added successfully",
            student,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to add student",
            error: error.message,
        });
    }
};


// Get all students
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: students.length,
            students,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch students",
            error: error.message,
        });
    }
};


// Get single student
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate("user", "name email");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(200).json({
            success: true,
            student,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch student",
            error: error.message,
        });
    }
};


// Update student
const updateStudent = async (req, res) => {
    try {
        const allowedFields = [
            "rollNumber",
            "className",
            "section",
            "dateOfBirth",
            "gender",
            "phone",
            "address",
            "parentName",
            "parentPhone",
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true,
            }
        ).populate("user", "name email");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student updated successfully",
            student,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update student",
            error: error.message,
        });
    }
};


// Delete student
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        await User.findByIdAndDelete(student.user);
        await student.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete student",
            error: error.message,
        });
    }
};


// Get logged-in student's own profile
const getMyStudentProfile = async (req, res) => {
    try {
        const student = await Student.findOne({
            user: req.user._id,
        }).populate("user", "name email");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student profile fetched successfully",
            student,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch student profile",
            error: error.message,
        });
    }
};


// Export all controllers
module.exports = {
    addStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    getMyStudentProfile,
};
