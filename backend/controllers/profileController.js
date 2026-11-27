const User = require("../models/User");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");

// ==========================================
// 1. GET MY PROFILE
// Admin / Student apni profile dekh sakte hain
// ==========================================

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        let studentProfile = null;

        // Agar logged-in user student hai
        if (user.role === "student") {
            studentProfile = await Student.findOne({
                user: user._id,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: {
                user,
                studentProfile,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ==========================================
// 2. UPDATE MY PROFILE
// User apni allowed profile details update karega
// ==========================================

const updateMyProfile = async (req, res) => {
    try {
        const {
            name,
            phone,
            profileImage,
            address,
            dateOfBirth,
            gender,
            parentName,
            parentPhone,
        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Common user profile fields
        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (profileImage !== undefined) {
            user.profileImage = profileImage;
        }

        await user.save();

        let studentProfile = null;

        // Student-specific profile fields
        if (user.role === "student") {
            studentProfile = await Student.findOne({
                user: user._id,
            });

            if (!studentProfile) {
                return res.status(404).json({
                    success: false,
                    message: "Student profile not found",
                });
            }

            if (address !== undefined) {
                studentProfile.address = address;
            }

            if (dateOfBirth !== undefined) {
                studentProfile.dateOfBirth = dateOfBirth;
            }

            if (gender !== undefined) {
                studentProfile.gender = gender;
            }

            if (parentName !== undefined) {
                studentProfile.parentName = parentName;
            }

            if (parentPhone !== undefined) {
                studentProfile.parentPhone = parentPhone;
            }

            await studentProfile.save();
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                user: await User.findById(user._id).select("-password"),
                studentProfile,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ==========================================
// 3. CHANGE PASSWORD
// User apna password change karega
// ==========================================

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Required fields check
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current and new password are required",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters",
            });
        }

        // Password select:false hai, isliye explicitly select karna hoga
        const user = await User.findById(req.user.id)
            .select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        // Hash new password
        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ==========================================
// 4. GET STUDENT PROFILE
// Only Admin can view a student's profile
// ==========================================

const getStudentProfile = async (req, res) => {
    try {
        const { id } = req.params;

        // Find student and populate user details
        const student = await Student.findById(id)
            .populate(
                "user",
                "name email phone profileImage role"
            );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student profile fetched successfully",
            data: student,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ==========================================
// EXPORT ALL FUNCTIONS
// ==========================================

module.exports = {
    getMyProfile,
    updateMyProfile,
    changePassword,
    getStudentProfile,
};