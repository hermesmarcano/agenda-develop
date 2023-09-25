const express = require("express");
const router = express.Router();
const {
  createAdmin,
  loginAdmin,
  updateAdmin,
  getAdmin,
  getAdminById,
  checkAdmin,
  uploadImg,
  getShops,
  getCustomers,
  getPayments,
  getArticleById,
  deleteShopByShopId
} = require("../controllers/admin");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const Admin = require("../models/admin");

const auth = require("../auth/auth3");

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { fieldname } = req.body;
    let destination;

    destination = path.join(__dirname, "../uploads/admin");

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

// Create multer instance
const upload = multer({ storage, fileFilter });

router.post("/", createAdmin);
router.post("/login", loginAdmin);
router.post("/uploads-logo", auth, upload.single("image"), uploadImg);
router.post("/uploads-articles-imgs", auth, upload.single("image"), uploadImg);
router.post("/uploads-shops-imgs", auth, upload.single("image"), uploadImg);
router.post("/uploads-services-imgs", auth, upload.single("image"), uploadImg);
router.post("/uploads-section1-imgs", auth, upload.single("image"), uploadImg);
router.post("/uploads-section2-imgs", auth, upload.single("image"), uploadImg);
router.patch("/", auth, updateAdmin);
router.get("/check", checkAdmin);
router.get("/shops", auth, getShops);
router.get("/", getAdmin);
router.get("/id", auth, getAdminById);
router.get("/customers", auth, getCustomers);
router.get("/payments", auth, getPayments);
router.get("/article/:id", getArticleById);
router.delete("/shops/:id", auth, deleteShopByShopId)

module.exports = router;
