
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/admin-login", (req, res) => {
    const { email, password } = req.body;

    if (
        email !== process.env.ADMIN_EMAIL ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        { email, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({
        success: true,
        message: "Admin login successful",
        token
    });
});

module.exports = router;
