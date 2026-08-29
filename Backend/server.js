require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs");

const user = require("./models/user");

const app = express();

const PORT = process.env.PORT || 3000;


/* ================================
   MIDDLEWARE
================================ */

app.use(cors());

app.use(express.json());


/* ================================
   FRONTEND
================================ */

const frontendPath =
    path.join(__dirname, "..", "Frontend");

app.use(
    express.static(frontendPath)
);


/* ================================
   HOME PAGE
================================ */

app.get("/", (req, res) => {

    res.sendFile(
        path.join(frontendPath, "index.html")
    );

});


/* ================================
   TEST API
================================ */

app.get("/api/test", (req, res) => {

    res.json({
        success: true,
        message:
            "Learning Universe Backend is Running 🚀"
    });

});


/* ================================
   LOGIN API
================================ */

app.post("/api/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        /* Check fields */

        if (!email || !password) {

            return res.status(400).json({
                message:
                    "Email and password are required."
            });

        }


        /* Find user */

        const user =
            await User.findOne({
                email: email.toLowerCase().trim()
            });


        if (!user) {

            return res.status(401).json({
                message:
                    "Invalid email or password."
            });

        }


        /* Check password */

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({
                message:
                    "Invalid email or password."
            });

        }


        /* Successful login */

        return res.status(200).json({

            message:
                "Login successful.",

            token:
                "learning-universe-login-token",

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                userType: user.userType

            }

        });

    }

    catch (error) {

        console.error(
            "Login Error:",
            error
        );

        return res.status(500).json({

            message:
                "Server error during login."

        });

    }

});


/* ================================
   MONGODB CONNECTION
================================ */

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
                    "Website: http://localhost:" +
                    PORT
                );

                console.log(
                    "Local: http://127.0.0.1:" +
                    PORT
                );

                console.log(
                    "API: http://localhost:" +
                    PORT +
                    "/api/test"
                );

                console.log(
                    "---------------------------------"
                );

            }
        );

    })

    .catch((error) => {

        console.log(
            "MongoDB Connection Failed ❌"
        );

        console.log(
            error.message
        );

    });