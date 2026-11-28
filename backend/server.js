
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Database
const connectDB = require("./config/db");

// Routes
const authRoute = require("./routes/authRoute");
const studentRoute = require("./routes/studentRoute");
const attendanceRoute = require("./routes/attendanceRoute");
const marksRoute = require("./routes/marksRoute");
const dailyReportRoutes = require("./routes/dailyReportRoute");
const homeworkRoutes = require("./routes/homeworkRoute");
const homeworkSubmissionRoutes = require("./routes/homeworkSubmissionRoute");
const profileRoute = require("./routes/profileRoute");
const adminDashboardRoute = require("./routes/adminDashboardRoute");
const studentDashboardRoute = require("./routes/studentDashboardRoute");
const dailyTaskRoutes = require("./routes/dailyTaskRoutes");

const app = express();

// Middleware
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "EduTrack Backend is running",
    });
});

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/students", studentRoute); // Updated
app.use("/api/attendance", attendanceRoute);
app.use("/api/marks", marksRoute);
app.use("/api/daily-reports", dailyReportRoutes);
app.use("/api/homework", homeworkRoutes);
app.use("/api/homework-submissions", homeworkSubmissionRoutes);
app.use("/api/profile", profileRoute);
app.use("/api/dashboard", adminDashboardRoute);
app.use("/api/student/dashboard", studentDashboardRoute);
app.use("/api/daily-tasks", dailyTaskRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// Server Configuration
const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
};

startServer();
