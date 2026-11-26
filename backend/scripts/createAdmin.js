
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "EduTrack"
        });

        console.log("MongoDB connected successfully");

        const name = "EduTrack Admin";
        const email = "admin@edutrack.com";
        const password = "Admin@123";

        const hashedPassword = await bcrypt.hash(password, 10);

        let admin = await User.findOne({ email });

        if (admin) {
            admin.name = name;
            admin.password = hashedPassword;
            admin.role = "admin";
            admin.isEmailVerified = true;

            await admin.save();

            console.log("Existing Admin updated successfully!");
        } else {
            admin = await User.create({
                name,
                email,
                password: hashedPassword,
                role: "admin",
                isEmailVerified: true,
            });

            console.log("Admin created successfully!");
        }

        console.log("Admin Email:", admin.email);
        console.log("Admin Role:", admin.role);
        console.log("Email Verified:", admin.isEmailVerified);

    } catch (error) {
        console.error("Admin creation failed:", error.message);

    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();
