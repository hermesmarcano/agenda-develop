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
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(400).json({ message: "An admin already exists" });
    }

    const admin = new Admin({
      username,
      password,
      plans: {}
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
      { adminId: admin._id, role: "admin" },
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
  const { password, ...updateData } = req.body;

  if (password) {
    const hash = bcrypt.hashSync(password, 10);
    updateData.password = hash;
    console.log(updateData.password);
  }

  Admin.findByIdAndUpdate(req.adminId, updateData, { new: true })
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
      logo: 1,
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

const getAdminById = (req, res) => {
  Admin.findOne(
    { _id: req.adminId },
    {
      username: 1,
      heroData: 1,
      shopsData: 1,
      articlesData: 1,
      section1Data: 1,
      section2Data: 1,
      servicesData: 1,
      websiteTitle: 1,
      logo: 1,
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

const getPlans = (req, res) => {
  Admin.findOne(
    {},
    {
      'plans._id': 0,
    }
  )
    .exec()
    .then((admin) => {
      if (!admin) {
        return res.status(404).json({ error: "Plans not found" });
      }
      
      const plans = admin.plans

      res.json({ plans });
    })
    .catch((err) => {
      console.error("Error fetching plan:", err);
      res.status(500).json({ error: "Failed to fetch plans" });
    });
};

const getBusinessPlan = (req, res) => {
  Admin.findOne({}, { 'plans.business': 1 })
    .exec()
    .then((admin) => {
      if (!admin) {
        return res.status(404).json({ error: "Business plan not found" });
      }
      res.json({ admin });
    })
    .catch((err) => {
      console.error("Error fetching business plan:", err);
      res.status(500).json({ error: "Failed to fetch business plan" });
    });
};

const getProfessionalPlan = (req, res) => {
  Admin.findOne({}, { 'plans.professional': 1 })
    .exec()
    .then((admin) => {
      if (!admin) {
        return res.status(404).json({ error: "Professional plan not found" });
      }
      res.json({ admin });
    })
    .catch((err) => {
      console.error("Error fetching professional plan:", err);
      res.status(500).json({ error: "Failed to fetch professional plan" });
    });
};

const getPersonalPlan = (req, res) => {
  Admin.findOne({}, { 'plans.personal': 1 })
    .exec()
    .then((admin) => {
      if (!admin) {
        return res.status(404).json({ error: "Personal plan not found" });
      }
      res.json({ admin });
    })
    .catch((err) => {
      console.error("Error fetching personal plan:", err);
      res.status(500).json({ error: "Failed to fetch personal plan" });
    });
};

const getExclusivePlan = (req, res) => {
  Admin.findOne({}, { 'plans.exclusive': 1 })
    .exec()
    .then((admin) => {
      if (!admin) {
        return res.status(404).json({ error: "Exclusive plan not found" });
      }
      res.json({ admin });
    })
    .catch((err) => {
      console.error("Error fetching exclusive plan:", err);
      res.status(500).json({ error: "Failed to fetch exclusive plan" });
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

const uploadImg = async (req, res) => {
  try {
    console.log("existingImg: " + req.body.existingImg);
    const existingPath = path.join(
      __dirname,
      "../uploads/admin",
      req.body.existingImg
    );
    console.log("path exists", existingPath);
    if (fs.existsSync(existingPath)) {
      console.log("image exists");
      fs.unlinkSync(existingPath);
    }

    console.log("file: " + req.file);
    res.json({ filename: req.file.filename });
  } catch (error) {
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

const deleteShopByShopId = async (req, res) => {
  const { id } = req.params;
  try {
    const manager = await Manager.findById(id);
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }
    await Manager.deleteOne({ _id: id });
    console.log(manager);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

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
  getAdminById,
  getPlans,
  getBusinessPlan,
  getProfessionalPlan,
  getPersonalPlan,
  getExclusivePlan,
  checkAdmin,
  uploadImg,
  getShops,
  getCustomers,
  getPayments,
  getArticleById,
  deleteShopByShopId
};
