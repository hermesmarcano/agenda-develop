const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const {
  createService,
  uploadServiceImg,
  getAllServicesByShopId,
  getAllServices,
  getServiceById,
  updateService,
  deleteServiceImg,
  deleteService,
} = require("../controllers/service");
const { isManager, isAdmin } = require("../middlewares/roles");
const auth = require("../auth/auth");

// Define storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/services");
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
  upload.single("serviceImg"),
  uploadServiceImg
);
router.post("/", auth, createService);
router.get("/shop", getAllServicesByShopId);
router.get("/", getAllServices);
router.get("/:id", auth, getServiceById);
router.patch("/:id", auth, updateService);
router.delete("/image/:filename", auth, deleteServiceImg);
router.delete("/:id", auth, deleteService);

module.exports = router;
