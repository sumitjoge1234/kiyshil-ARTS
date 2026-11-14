const db = require("../config/db");

// Add Category
exports.addCategory = (req, res) => {

    const { category_name, description } = req.body;

    if (!category_name) {
        return res.status(400).json({
            success: false,
            message: "Category Name is required"
        });
    }

    const sql = "INSERT INTO categories (category_name, description) VALUES (?, ?)";

    db.query(sql, [category_name, description], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.status(201).json({
            success: true,
            message: "Category Added Successfully"
        });

    });

};

// Get All Categories
exports.getCategories = (req, res) => {

    const sql = "SELECT * FROM categories ORDER BY id DESC";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            categories: result
        });

    });

};

// Update Category
exports.updateCategory = (req, res) => {

    const { id } = req.params;
    const { category_name, description } = req.body;

    const sql = "UPDATE categories SET category_name=?, description=? WHERE id=?";

    db.query(sql, [category_name, description, id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json({
            success: true,
            message: "Category Updated Successfully"
        });

    });

};

// Delete Category
exports.deleteCategory = (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM categories WHERE id=?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json({
            success: true,
            message: "Category Deleted Successfully"
        });

    });

};