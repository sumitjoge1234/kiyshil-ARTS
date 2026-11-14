
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const db = require("./config/db");

// ======================================
// IMPORT ROUTES
// ======================================

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

// ======================================
// EXPRESS APP
// ======================================

const app = express();

// ======================================
// MIDDLEWARE
// ======================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================================
// API ROUTES
// ======================================

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

// ======================================
// HOME API
// ======================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Chumbak Art Gallery Backend Running"
    });
});

// ======================================
// CATEGORY TEST API
// ======================================

app.get("/test-category", (req, res) => {
    res.status(200).send("Category Route Working");
});

// ======================================
// ROUTE CHECK
// ======================================

app.get("/check-routes", (req, res) => {
    res.json({
        success: true,
        auth: typeof authRoutes,
        products: typeof productRoutes,
        categories: typeof categoryRoutes
    });
});

// ======================================
// DATABASE CONNECTION TEST
// ======================================

db.query("SELECT 1", (err) => {
    if (err) {
        console.error("MySQL Connection Failed:", err.message);
    } else {
        console.log("MySQL Connected Successfully");
    }
});

// ======================================
// START SERVER
// ======================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("================================");
    console.log("CHUMBAK ART BACKEND STARTED");
    console.log("MY UPDATED SERVER IS RUNNING");
    console.log(`Server: http://localhost:${PORT}`);
    console.log("================================");
});
