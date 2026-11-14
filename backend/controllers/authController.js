const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if email already exists
        db.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                if (result.length > 0) {
                    return res.json({
                        success: false,
                        message: "Email already exists"
                    });
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                db.query(
                    "INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)",
                    [name, email, hashedPassword, "admin"],
                    (err) => {

                        if (err) {
                            return res.status(500).json(err);
                        }

                        res.json({
                            success: true,
                            message: "Admin Registered Successfully"
                        });

                    }
                );

            }
        );

    } catch (error) {
        res.status(500).json(error);
    }
};

exports.loginAdmin = (req, res) => {
    res.json({
        success: true,
        message: "Login API Coming Next"
    });
};