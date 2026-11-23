// Creating Routes for Authentication 

const express = require("express");

// importing authentication controller function 
const {
    registerUser, loginUser, getMe
} = require("../controllers/authController");


// creating express Router
const router = express.Router();

// creating post route for register the user
router.post("/register", registerUser);

// creating post route  for login user 

router.post("/login", loginUser);

// creating a get route for logged in user profile 
router.get("/me", getMe);
module.exports = router
