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

const frontendPath =
    path.join(__dirname, "..", "Frontend");

app.use(express.static(frontendPath));


// ================================
// HOME
// ================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(frontendPath, "index.html")
    );

});


// ================================
// TEST API
// ================================

app.get("/api/test", (req, res) => {

    res.json({
        success: true,
        message:
            "Learning Universe Backend is Running 🚀"
    });

});


// ================================
// REGISTER
// ================================

app.post("/api/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            userType
        } = req.body;


        // ----------------------------
        // VALIDATION
        // ----------------------------

        if (
            !name ||
            !email ||
            !password ||
            !userType
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Name, email, password and user type are required."

            });

        }


        // ----------------------------
        // CHECK USER TYPE
        // ----------------------------

        if (
            userType !== "regular" &&
            userType !== "disability"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid user type."

            });

        }


        // ----------------------------
        // CLEAN DATA
        // ----------------------------

        const cleanName =
            name.trim();

        const cleanEmail =
            email.toLowerCase().trim();


        // ----------------------------
        // PASSWORD LENGTH
        // ----------------------------

        if (password.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must contain at least 6 characters."

            });

        }


        // ----------------------------
        // CHECK EXISTING EMAIL
        // ----------------------------

        const existingUser =
            await User.findOne({
                email: cleanEmail
            });


        if (existingUser) {

            return res.status(409).json({

                success: false,

                message:
                    "An account with this email already exists."

            });

        }


        // ----------------------------
        // HASH PASSWORD
        // ----------------------------

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // ----------------------------
        // CREATE USER
        // ----------------------------

        const newUser =
            await User.create({

                name: cleanName,

                email: cleanEmail,

                password: hashedPassword,

                userType: userType

            });


        // ----------------------------
        // SUCCESS RESPONSE
        // ----------------------------

        return res.status(201).json({

            success: true,

            message:
                "Registration successful.",

            user: {

                id: newUser._id,

                name: newUser.name,

                email: newUser.email,

                userType: newUser.userType

            }

        });


    } catch (error) {

        console.error(
            "Registration Error:",
            error
        );


        // ----------------------------
        // DUPLICATE EMAIL SAFETY
        // ----------------------------

        if (error.code === 11000) {

            return res.status(409).json({

                success: false,

                message:
                    "An account with this email already exists."

            });

        }


        // ----------------------------
        // SERVER ERROR
        // ----------------------------

        return res.status(500).json({

            success: false,

            message:
                "Server error during registration."

        });

    }

});


// ================================
// LOGIN
// ================================

app.post("/api/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({

                message:
                    "Email and password are required."

            });

        }


        const foundUser =
            await User.findOne({

                email:
                    email.toLowerCase().trim()

            });


        if (!foundUser) {

            return res.status(401).json({

                message:
                    "Invalid email or password."

            });

        }


        const passwordMatch =
            await bcrypt.compare(
                password,
                foundUser.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    "Invalid email or password."

            });

        }


        res.status(200).json({

            message:
                "Login successful.",

            token:
                "learning-universe-login-token",

            user: {

                id:
                    foundUser._id,

                name:
                    foundUser.name,

                email:
                    foundUser.email,

                userType:
                    foundUser.userType

            }

        });


    } catch (error) {

        console.error(
            "Login Error:",
            error
        );


        res.status(500).json({

            message:
                "Server error during login."

        });

    }

});


// ================================
// MONGODB + SERVER
// ================================

mongoose
    .connect(process.env.MONGO_URI)

    .then(() => {

        console.log(
            "MongoDB Connected Successfully ✅"
        );


        app.listen(
            PORT,
            () => {

                console.log(
                    "---------------------------------"
                );

                console.log(
                    "Learning Universe Server Running 🚀"
                );

                console.log(
                    "PORT:",
                    PORT
                );

                console.log(
                    "---------------------------------"
                );

            }
        );

    })

    .catch((error) => {

        console.error(
            "MongoDB Connection Failed ❌"
        );

        console.error(
            error.message
        );

        process.exit(1);

    });