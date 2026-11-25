const jwt = require("jsonwebtoken");
const User = require("../models/User");


// 1. PROTECT MIDDLEWARE
// Verify JWT token and authenticate user


const protect = async (req, res, next) => {
    try {
        let token;

        // Check Authorization header for Bearer token
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // If token is missing, deny access
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token missing",
            });
        }

        // Verify JWT token using secret key
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find logged-in user in database
        const user = await User.findById(decoded.id).select("-password");

        // Check whether user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        // Check email verification status
        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email first",
            });
        }

        // Store authenticated user details in request
        req.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        // Continue to next middleware or controller
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};



// 2. AUTHORIZE MIDDLEWARE
// Check whether user has permission

const authorize = (...roles) => {

    return (req, res, next) => {

        // Check whether user is authenticated
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Please login first",
            });
        }

        // Check whether user's role is allowed
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You don't have permission",
            });
        }

        // User has permission, continue
        next();
    };
};



// EXPORT MIDDLEWARE FUNCTIONS


module.exports = {
    protect,
    authorize,
};