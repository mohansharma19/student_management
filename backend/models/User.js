const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        // name requirement for authentication 
        name: {
            type: String,
            required: true,
            trim: true,
        },
         // email requirement for authentication 
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        // password requirement for authentication 
        password: {
            type: String,
            required: true,
        },
        // role based on authentication 
        role: {
            type: String,
            enum: ["admin", "student"],
            default: "student",
        },


    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
