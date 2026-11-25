require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// creting a Admin account 

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "Edutrack",
        });

        console.log("MongoDB connected successfully");

        // Admin details
        const name = "EduTrack Admin";
        const email = "admin@edutrack.com";
        const password = "Admin@123";

        // Check if Admin already exists
        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log("Admin already exists!");
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Admin account
        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
            isEmailVerified: true,
        });

        console.log("Admin created successfully!");
        console.log("Admin ID:", admin._id);
        console.log("Admin Email:", admin.email);

    } catch (error) {
        console.error("Admin creation failed:", error.message);

    } finally {
        // Close MongoDB connection
        await mongoose.disconnect();
    }
};

// Run function
createAdmin();