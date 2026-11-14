


const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");

router.post("/add", categoryController.addCategory);
router.get("/", categoryController.getCategories);
router.put("/update/:id", categoryController.updateCategory);
router.delete("/delete/:id", categoryController.deleteCategory);

module.exports = router;
