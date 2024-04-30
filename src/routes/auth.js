// routes/auth.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { secrek_key } = require("../../constant");
const verifyAuth = require("../middleware/authMiddleware");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if the user exists
    const user = await User.findOne({ username });
    console.log("REQ BODY ", req.body);
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid username or password" });
    }

    // For simplicity, let's assume passwords are stored in plaintext
    if (user.password !== password) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, secrek_key, {
      expiresIn: "1h",
    });

    // Set cookie for authentication
    res.cookie("authToken", token, { httpOnly: true });

    res
      .status(200)
      .json({ success: true, message: "Login successful", token, code: 200 });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if the user exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res
        .status(200)
        .json({ success: false, message: "Username already exists" });
    }
    // create a new user
    const newUser = new User({ username, password });
    console.log('New user ', newUser);
    
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, secrek_key, {
      expiresIn: "1h",
    });

    // Set cookie for authentication
    res.cookie("authToken", "authenticated", { httpOnly: true });

    res.status(200).json({ success: true, message: "Signup successful", token, code: 201 });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(200).json({ success: false, message: "Internal server error" });
  }
});

router.get("/check", verifyAuth, async (req, res) => {
    try {
        // Check if the user exists
        const user = await User.findOne({ _id: req.userId });
        console.log("REQ User ", user);
        if (!user) {
          return res
            .status(200)
            .json({ success: false, message: "Not valid user" });
        }
    
        // For simplicity, let's assume passwords are stored in plaintext
        if (user.password !== password) {
          return res
            .status(200)
            .json({ success: false, message: "Not valid user" });
        }
    
        res
          .status(200)
          .json({ success: true, message: "Login successful", token, code: 200 });
      } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
      }
});

module.exports = router;
