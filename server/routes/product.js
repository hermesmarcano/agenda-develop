const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const {
  createProduct,
  uploadProductImg,
  getAllProductsByShopName,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProductImg,
  deleteProduct,
} = require("../controllers/product");
const { isManager, isAdmin } = require("../middlewares/roles");
const auth = require("../auth/auth");

// Define storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/products");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Define file size limit for multer
const limits = {
  fileSize: 1024 * 1024 * 5, // 5MB
};

// Initialize multer with the storage engine and file size limit
const upload = multer({ storage, limits });

router.post(
  "/imageUpload",
  auth,
  upload.single("productImg"),
  uploadProductImg
);
router.post("/", auth, createProduct);
router.get("/shopname", getAllProductsByShopName);
router.get("/", getAllProducts);
router.get("/:id", auth, getProductById);
router.patch("/:id", auth, updateProduct);
router.delete("/image/:filename", auth, deleteProductImg);
router.delete("/:id", auth, deleteProduct);

module.exports = router;
