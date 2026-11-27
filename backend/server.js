
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Database connection
const connectDB = require("./config/db");

// Import routes
const authRoute = require("./routes/authRoute");
const studentRoute = require("./routes/studentRoute");
const attendanceRoute = require("./routes/attendanceRoute");
const marksRoute = require("./routes/marksRoute");
const dailyReportRoutes = require("./routes/dailyReportRoute");
const homeworkRoutes = require("./routes/homeworkRoute");
const homeworkSubmissionRoutes = require("./routes/homeworkSubmissionRoute");
const profileRoute = require("./routes/profileRoute");
const adminDashboard = require("./routes/adminDashboardRoute");
const studentDashboardRoute = require("./routes/studentDashboardRoute");

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("EduTrack backend is running");
});

// Authentication APIs
app.use("/api/auth", authRoute);

// Student Management APIs
app.use("/api/students", studentRoute);

// Attendance APIs
app.use("/api/attendance", attendanceRoute);

// Marks APIs
app.use("/api/marks", marksRoute);

// Daily Reports APIs
app.use("/api/daily-reports", dailyReportRoutes);

// Homework APIs
app.use("/api/homework", homeworkRoutes);

// Homework Submission APIs
app.use("/api/homework-submissions", homeworkSubmissionRoutes);

// Profile Management APIs
app.use("/api/profile", profileRoute);

// Admin Dashboard APIs
app.use("/api/dashboard", adminDashboard);

// student dashboard apis
app.use("/api/student/dashboard", studentDashboardRoute);

// Server configuration
const PORT = process.env.PORT || 5000;

// Start server after database connection
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
