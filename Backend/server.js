require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const app = express();

const PORT = process.env.PORT || 3000;

// ================================
// MIDDLEWARE
// ================================

app.use(cors());
app.use(express.json());

// ================================
// FRONTEND
// ================================

const frontendPath = path.join(__dirname, "..", "Frontend");

app.use(express.static(frontendPath));

// ================================
// HOME
// ================================

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// ================================
// TEST API
// ================================

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Learning Universe Backend is Running 🚀"
    });
});

// ================================
// LOGIN
// ================================

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const foundUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!foundUser) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            foundUser.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        res.status(200).json({
            message: "Login successful.",
            token: "learning-universe-login-token",
            user: {
                id: foundUser._id,
                name: foundUser.name,
                email: foundUser.email,
                userType: foundUser.userType
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            message: "Server error during login."
        });
    }
});

// ================================
// MONGODB + SERVER
// ================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully ✅");

        app.listen(PORT, () => {
            console.log("---------------------------------");
            console.log("Learning Universe Server Running 🚀");
            console.log("PORT:", PORT);
            console.log("---------------------------------");
        });
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed ❌");
        console.error(error.message);
        process.exit(1);
    });