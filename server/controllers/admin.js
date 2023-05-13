const Admin = require("../models/admin");
const Customer = require("../models/customer");
const Manager = require("../models/manager");
const Payment = require("../models/payment");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

const createAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password before saving to database
    const admin = new Admin({
      username,
      password,
    });
    await admin.save();
    res.status(201).json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateAdmin = (req, res) => {
  Admin.findByIdAndUpdate(req.id, req.body, { new: true })
    .exec()
    .then((updatedAdmin) => {
      if (!updatedAdmin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      res.json({ admin: updatedAdmin });
    })
    .catch((err) => {
      console.error("Error updating admin:", err);
      res.status(500).json({ error: "Failed to update admin" });
    });
};

const getAdmin = (req, res) => {
  Admin.findOne(
    { username: "admin" },
    {
      heroData: 1,
      shopsData: 1,
      articlesData: 1,
      section1Data: 1,
      section2Data: 1,
      servicesData: 1,
      websiteTitle: 1,
    }
  )
    .exec()
    .then((admin) => {
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      res.json({ admin });
    })
    .catch((err) => {
      console.error("Error fetching admin:", err);
      res.status(500).json({ error: "Failed to fetch admin" });
    });
};

const getArticleById = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const article = admin.articlesData.id(id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const checkAdmin = (req, res) => {
  Admin.countDocuments({})
    .then((count) => {
      res.json({ count });
    })
    .catch((err) => {
      console.error("Error checking admins:", err);
      res.status(500).json({ error: "Failed to check admins" });
    });
};

// const uploadImg = (req, res) => {
//   try {
//     console.log("existingImg", req.body.existingImg);
//     // Image upload successful, respond with the filename
//     res.json({ filename: req.file.filename });
//   } catch (error) {
//     // Error occurred during upload
//     console.error(error);
//     res.status(500).json({ error: "Failed to upload image." });
//   }
// };

const uploadImg = async (req, res) => {
  try {
    // Check if the image exists with the sent filename
    const existingPath = path.join(
      __dirname,
      "../uploads/admin",
      req.body.existingImg
    );
    console.log("path exists", existingPath);
    if (fs.existsSync(existingPath)) {
      // Image exists, delete it
      console.log("image exists");
      fs.unlinkSync(existingPath);
    }

    // Image upload successful, respond with the new filename
    res.json({ filename: req.file.filename });
  } catch (error) {
    // Error occurred during upload
    console.error(error);
    res.status(500).json({ error: "Failed to upload image." });
  }
};

const getShops = async (req, res) => {
  try {
    const manager = await Manager.find().select(
      "_id name shopName urlSlug profileImg"
    );
    console.log(manager);
    res.json(manager);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.json({ customers });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({});
    res.json({ payments });
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

module.exports = {
  createAdmin,
  loginAdmin,
  updateAdmin,
  getAdmin,
  checkAdmin,
  uploadImg,
  getShops,
  getCustomers,
  getPayments,
  getArticleById,
};
