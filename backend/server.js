const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import Database Connection
const connectDB = require("./config/db");

// Import Auth Routes
const authRoute = require("./routes/authRoute");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test API
app.get("/", (req, res) => {
    res.status(200).send("EduTrack backend is running");
});

// Authentication Routes
app.use("/api/auth", authRoute);

// Server Port
const PORT = process.env.PORT || 5000;

// Connect Database and Start Server
const databaseConnection = async () => {
    try {
        await connectDB();

        app.listen(PORT, "127.0.0.1", () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

// Start Application
databaseConnection();