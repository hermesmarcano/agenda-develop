const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const {
  createProduct,
  uploadServiceImg,
  getAllProductsByShopName,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProductImg,
  deleteProduct,
} = require("../controllers/product");
const { isManager, isAdmin } = require("../middlewares/roles");
const auth = require("../auth/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { fieldname } = req.body;
    let destination;

    destination = path.join(__dirname, "../uploads/products");

    fs.mkdirSync(destination, { recursive: true });
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

// File filter for multer
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."), false);
  }
};

const limits = {
  fileSize: 1024 * 1024 * 5, // 5MB
};

// Create multer instance
const upload = multer({ storage, fileFilter, limits });

router.post(
  "/imageUpload",
  auth,
  upload.single("productImg"),
  uploadServiceImg
);
router.post("/", auth, createProduct);
router.get("/shopname", getAllProductsByShopName);
router.get("/", getAllProducts);
router.get("/:id", auth, getProductById);
router.patch("/:id", auth, updateProduct);
router.delete("/image/:filename", auth, deleteProductImg);
router.delete("/:id", auth, deleteProduct);

module.exports = router;
