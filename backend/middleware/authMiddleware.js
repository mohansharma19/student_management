
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ======================================
// PROTECT MIDDLEWARE
// ======================================
const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check token
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token missing. Please login.",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token",
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decoded.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload",
            });
        }

        // Find user
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found. Please login again.",
            });
        }

        // Email verification
        if (user.isEmailVerified !== true) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email first.",
            });
        }

        // Attach user
        req.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
        };

        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error.message);

        return res.status(401).json({
            success: false,
            message:
                error.name === "TokenExpiredError"
                    ? "Session expired. Please login again."
                    : "Invalid or expired authentication token.",
        });
    }
};

// ======================================
// AUTHORIZE MIDDLEWARE
// ======================================
const authorize = (...roles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Please login first.",
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Insufficient permissions.",
                userRole: req.user.role,
                allowedRoles: roles,
            });
        }

        next();
    };
};

// ======================================
// EXPORT
// ======================================
module.exports = {
    protect,
    authorize,
};
