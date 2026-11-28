const User = require("../models/User");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");

// ==========================================
// 1. GET MY PROFILE
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

        // Common user fields
        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (profileImage !== undefined) {
            user.profileImage = profileImage;
        }

        let studentProfile = null;

        // Student-specific fields
        if (user.role === "student") {
            studentProfile = await Student.findOne({
                user: user._id,
            });

            if (!studentProfile) {
                return res.status(404).json({
                    success: false,
                    message: "Student profile not found. Please contact admin to link your student record.",
                });
            }

            if (phone !== undefined) {
                studentProfile.phone = phone;
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

        await user.save();

        const updatedUser = await User.findById(user._id)
            .select("-password");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                user: updatedUser,
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
// ==========================================

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

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

        const user = await User.findById(req.user.id)
            .select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

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
// 4. GET STUDENT PROFILE (ADMIN)
// ==========================================

const getStudentProfile = async (req, res) => {
    try {
        const { id } = req.params;

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
// EXPORT
// ==========================================

module.exports = {
    getMyProfile,
    updateMyProfile,
    changePassword,
    getStudentProfile,
};