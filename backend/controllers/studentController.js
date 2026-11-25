const Student = require("../models/Student");
const User = require("../models/User");

// new student ko add kar rha hu 

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

        // required feild check kar rhe h
        if (!name || !email || !password || !rollNumber || !className) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
        }

        // check email phle se to register nhi h 
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim(),
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        // Check whether roll number already exists
        const existingStudent = await Student.findOne({ rollNumber });

        if (existingStudent) {
            return res.status(409).json({
                success: false,
                message: "Roll number already exists",
            });
        }

        // student login profile 
        const bcrypt = require("bcryptjs");
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: "student",
            isEmailVerified: true,
        });

        // student acedemic profile 
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


// get all student 
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


// get single student 
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

// updating student 

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

        // kewal approved feild ke liye student ko allow kar rhe h 
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


// delete student ka logic 
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // Delete linked User account too
        await User.findByIdAndDelete(student.user);

        // Delete student academic profile
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


// export kar rha hu sara function 

module.exports = {
    addStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
};