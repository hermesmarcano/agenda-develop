const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const {
  createService,
  uploadServiceImg,
  getAllServicesByShopName,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/service");
const { isManager, isAdmin } = require("../middlewares/roles");
const auth = require("../auth/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { fieldname } = req.body;
    let destination;

    destination = path.join(__dirname, "../uploads/services");

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
  upload.single("serviceImg"),
  uploadServiceImg
);
router.post("/", auth, createService);
router.get("/shopname", getAllServicesByShopName);
router.get("/", getAllServices);
router.get("/:id", auth, getServiceById);
router.patch("/:id", auth, updateService);
router.delete("/:id", auth, deleteService);

module.exports = router;
