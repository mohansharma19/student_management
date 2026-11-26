const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import database connection
const connectDB = require("./config/db");

// Import routes
const authRoute = require("./routes/authRoute");
const studentRoute = require("./routes/studentRoute");
const attendanceRoute = require("./routes/attendanceRoute");
const marksRoute = require("./routes/marksRoute");
const dailyReportRoutes = require("./routes/dailyReportRoute");
const app = express();

// middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());

// home routes 

app.get("/", (req, res) => {
    res.send("EduTrack backend is running");
});



// Authentication APIs
app.use("/api/auth", authRoute);

// Student Management APIs
app.use("/api/students", studentRoute);

app.use("/api/attendance", attendanceRoute);

app.use("/api/marks", marksRoute);

app.use("/api/daily-reports", dailyReportRoutes);

// server configuration 

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