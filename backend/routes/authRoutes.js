
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const {
    registerAdmin,
    loginAdmin
} = require("../controllers/authController");


// ======================================
// ADMIN REGISTRATION
// ======================================

router.post("/register", registerAdmin);


// ======================================
// USER LOGIN
// ======================================

router.post("/login", loginAdmin);


// ======================================
// ADMIN LOGIN
// ======================================

router.post("/admin-login", (req, res) => {

    try {

        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });

        }

        // Validate environment variables
        if (
            !process.env.ADMIN_EMAIL ||
            !process.env.ADMIN_PASSWORD ||
            !process.env.JWT_SECRET
        ) {

            console.error("Admin environment variables missing");

            return res.status(500).json({
                success: false,
                message: "Admin authentication is not configured"
            });

        }

        // Verify credentials
        const adminEmail =
            process.env.ADMIN_EMAIL.trim().toLowerCase();

        if (
            email.trim().toLowerCase() !== adminEmail ||
            password !== process.env.ADMIN_PASSWORD
        ) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }

        // Generate JWT token
        const token = jwt.sign(

            {
                email: adminEmail,
                role: "admin"
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "8h"
            }

        );

        return res.status(200).json({

            success: true,

            message: "Admin login successful",

            token: token

        });

    }

    catch (error) {

        console.error("Admin Login Error:", error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

});


module.exports = router;
