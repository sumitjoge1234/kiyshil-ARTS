const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  addProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

// Add Product
router.post("/add", upload.single("image"), addProduct);

// Get All Products
router.get("/", getProducts);

// Get Single Product
router.get("/:id", getSingleProduct);

// Update Product
router.put("/update/:id", upload.single("image"), updateProduct);

// Delete Product
router.delete("/delete/:id", deleteProduct);

module.exports = router;