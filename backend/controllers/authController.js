
const User = require("../models/User");
const Student = require("../models/Student");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// Generate JWT
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// REGISTER USER (Student)
const registerUser = async (req, res) => {
    let createdUser = null;
    let studentCreated = false;

    try {
        const {
            name,
            email,
            password,
            rollNumber,
            className,
            section,
        } = req.body;

        // Validate required fields
        if (
            !name ||
            !email ||
            !password ||
            !rollNumber ||
            !className
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        if (!process.env.FRONTEND_URL || !process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Server configuration is missing",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedRollNumber = rollNumber.trim();

        // Check existing email
        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        // Check existing roll number
        const existingStudent = await Student.findOne({
            rollNumber: normalizedRollNumber,
        });

        if (existingStudent) {
            return res.status(409).json({
                success: false,
                message: "Roll number already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate email verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");

        // Create User
        createdUser = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "student",
            isEmailVerified: false,
            emailVerificationTokenHash: hashedToken,
            emailVerificationTokenExpires: new Date(
                Date.now() + 10 * 60 * 1000
            ),
        });

        // Create Student Profile
        await Student.create({
            user: createdUser._id,
            rollNumber: normalizedRollNumber,
            className: className.trim(),
            section: section?.trim() || "",
        });

        studentCreated = true;

        // Generate verification link
        const verificationLink =
            `${process.env.FRONTEND_URL.replace(/\/$/, "")}/verify-email?token=${verificationToken}`;

        // Send verification email
        await sendEmail(
            createdUser.email,
            "Verify Your EduTrack Account",
            `
            <div style="font-family: Arial; padding: 20px;">
                <h2>Hello ${createdUser.name}!</h2>
                <p>Thank you for registering with EduTrack.</p>
                <p>Click below to verify your email:</p>
                <a href="${verificationLink}">Verify Email</a>
                <p>This link expires in 10 minutes.</p>
            </div>
            `
        );

        return res.status(201).json({
            success: true,
            message: "Registration successful. Please verify your email.",
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        // Rollback created records if registration fails
        if (createdUser) {
            if (studentCreated) {
                await Student.deleteOne({
                    user: createdUser._id,
                }).catch((rollbackError) => {
                    console.error("Student rollback error:", rollbackError);
                });
            }

            await User.findByIdAndDelete(createdUser._id).catch(
                (rollbackError) => {
                    console.error("User rollback error:", rollbackError);
                }
            );
        }

        return res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message,
        });
    }
};

// VERIFY EMAIL
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Verification token is missing",
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            emailVerificationTokenHash: hashedToken,
            emailVerificationTokenExpires: {
                $gt: new Date(),
            },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification link",
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationTokenHash = null;
        user.emailVerificationTokenExpires = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully. You can now login.",
        });

    } catch (error) {
        console.error("VERIFY EMAIL ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Email verification failed",
        });
    }
};

// LOGIN USER (Admin + Student)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter email and password",
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "JWT secret is missing",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Verify email
        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in.",
            });
        }

        // Generate JWT
        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
};

// GET LOGGED-IN USER
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
            },
        });

    } catch (error) {
        console.error("GET ME ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get profile",
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyEmail,
    getMe,
};
