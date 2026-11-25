const User = require("../models/User");
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

// REGISTER USER
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
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

        const frontendURL = process.env.FRONTEND_URL;

        if (!frontendURL || !process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Server configuration is missing",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: existingUser.isEmailVerified
                    ? "User already exists"
                    : "Account already exists but email is not verified. Please contact support or request a new verification email.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = crypto
            .randomBytes(32)
            .toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");

        // Create user
        const user = await User.create({
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

        const verificationLink =
            `${frontendURL.replace(/\/$/, "")}/verify-email?token=${verificationToken}`;

        try {
            await sendEmail(
                user.email,
                "Verify Your EduTrack Account",
                `
                <div style="font-family: Arial; padding: 20px;">
                    <h2>Hello ${user.name}!</h2>

                    <p>Thank you for registering with EduTrack.</p>

                    <p>Please verify your email address by clicking below:</p>

                    <a href="${verificationLink}"
                       style="
                           background: #2563eb;
                           color: white;
                           padding: 12px 20px;
                           text-decoration: none;
                           border-radius: 6px;
                           display: inline-block;
                       ">
                        Verify Email
                    </a>

                    <p>This link expires in 10 minutes.</p>

                    <p>If you did not create this account, ignore this email.</p>
                </div>
                `
            );

        } catch (emailError) {
            // Remove user if verification email fails
            await User.findByIdAndDelete(user._id);
            throw emailError;
        }

        return res.status(201).json({
            success: true,
            message: "Registration successful. Please check your email to verify your account.",
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Registration failed. Please try again.",
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
        }).select(
            "+emailVerificationTokenHash +emailVerificationTokenExpires"
        );

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

// LOGIN USER
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter email and password",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail,
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

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

        // Check email verification
        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in.",
            });
        }

        // Generate JWT after successful login
        const authToken = generateToken(user._id);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: authToken,
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