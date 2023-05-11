const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getAllManagers,
  getManager,
  createManager,
  uploadProfileImg,
  updateManager,
  deleteProfileImg,
  deleteManager,
  loginManager,
  getShop,
  getShops,
  getShopImg,
} = require("../controllers/manager");
// const { isManager, isAdmin } = require("../middlewares/roles");
const auth = require("../auth/auth");

// Define storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile");
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

router.get("/shopname", getShop);
router.get("/shops", getShops);
router.get("/shopImg", getShopImg);
router.get("/", auth, getAllManagers);
router.get("/id", auth, getManager);
router.post("/", upload.single("profileImg"), createManager);
router.post("/profileImg", auth, upload.single("profileImg"), uploadProfileImg);
router.patch("/", auth, updateManager);
router.delete("/profile/:filename", auth, deleteProfileImg);

router.delete("/:id", auth, deleteManager);
router.post("/login", loginManager);

module.exports = router;
