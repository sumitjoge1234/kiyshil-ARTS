const db = require("../config/db");

// =========================
// Add Product
// =========================
exports.addProduct = (req, res) => {

    const { category_id, title, description, price, stock } = req.body;

    const image = req.file ? req.file.filename : null;

    const sql = `
        INSERT INTO products
        (category_id, title, description, price, stock, image)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [category_id, title, description, price, stock, image],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Product Added Successfully",
                productId: result.insertId
            });

        }
    );

};

// =========================
// Get All Products
// =========================
exports.getProducts = (req, res) => {

    const sql = `
        SELECT
            products.*,
            categories.category_name
        FROM products
        LEFT JOIN categories
        ON products.category_id = categories.id
        ORDER BY products.id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json({
            success: true,
            products: result
        });

    });

};

// =========================
// Get Single Product
// =========================
exports.getSingleProduct = (req, res) => {

    const { id } = req.params;

    db.query(
        "SELECT * FROM products WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Product Not Found"
                });
            }

            res.json({
                success: true,
                product: result[0]
            });

        }
    );

};

// =========================
// Update Product
// =========================

exports.updateProduct = (req, res) => {
    console.log("BODY:", req.body);
console.log("FILE:", req.file);

    const { id } = req.params;

    // Agar body nahi aayi
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Request body is missing"
        });
    }

    const { category_id, title, description, price, stock } = req.body;

    // Agar image upload hui hai
    let sql = "";
    let values = [];

    if (req.file) {
        sql = `
            UPDATE products
            SET
                category_id = ?,
                title = ?,
                description = ?,
                price = ?,
                stock = ?,
                image = ?
            WHERE id = ?
        `;

        values = [
            category_id,
            title,
            description,
            price,
            stock,
            req.file.filename,
            id
        ];

    } else {

        sql = `
            UPDATE products
            SET
                category_id = ?,
                title = ?,
                description = ?,
                price = ?,
                stock = ?
            WHERE id = ?
        `;

        values = [
            category_id,
            title,
            description,
            price,
            stock,
            id
        ];
    }

    db.query(sql, values, (err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json({
            success: true,
            message: "Product Updated Successfully"
        });

    });

};

// =========================
// Delete Product
// =========================
exports.deleteProduct = (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM products WHERE id = ?",
        [id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json({
                success: true,
                message: "Product Deleted Successfully"
            });

        }
    );

};