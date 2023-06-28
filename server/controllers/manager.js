const Manager = require("../models/manager");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

// Get manager
const getAllManagers = async (req, res) => {
  try {
    const manager = await Manager.findOne({ _id: req.id });
    res.json(manager);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all shops
const getShops = async (req, res) => {
  try {
    const manager = await Manager.find().select(
      "_id shopName urlSlug profileImg"
    );
    console.log(manager);
    res.json(manager);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single manager
const getManager = async (req, res) => {
  try {
    const manager = await Manager.findOne({ _id: req.id }).select(
      "_id name shopName urlSlug profileImg discount"
    );
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }
    res.json(manager);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new manager
const createManager = async (req, res) => {
  try {
    // const { name, email, password, shopName, urlSlug } = req.body;
    // const imageName = req.file.filename;
    const manager = new Manager(req.body);
    console.log(manager);
    const newManager = await manager.save();
    res.status(201).json(newManager);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Upload profile image
const uploadProfileImg = (req, res) => {
  try {
    const id = req.id;
    const imageName = req.file.filename;
    res.json({
      message: "Profile Image updated successfully",
      profileImg: imageName,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a manager
const updateManager = async (req, res) => {
  try {
    const id = req.id;
    const updatedManager = await Manager.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log(updatedManager);
    res.json({
      message: "Profile updated successfully",
      manager: updatedManager,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteProfileImg = (req, res) => {
  const filename = req.params.filename;
  console.log("filename ", filename);
  const filePath = path.resolve("uploads/profile", filename);
  console.log("filePath ", filePath);
  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist
      return res.status(404).json({ error: "File not found" });
    }

    // Delete the file
    fs.unlink(filePath, async (err) => {
      if (err) {
        // Error occurred while deleting the file
        return res.status(500).json({ error: "Failed to delete the file" });
      }

      try {
        // Delete the profileImg property from the Manager collection
        const id = req.id;
        const updatedManager = await Manager.findOneAndUpdate(
          { _id: id },
          { profileImg: "" },
          { new: true }
        );

        if (!updatedManager) {
          return res.status(404).json({ error: "Manager not found" });
        }

        return res.json({
          message: "File deleted successfully",
          manager: updatedManager,
        });
      } catch (err) {
        // Error occurred while updating the database
        return res.status(500).json({ error: "Failed to update the database" });
      }
    });
  });
};

// Delete a manager
const deleteManager = async (req, res) => {
  const { id } = req.params;
  try {
    const manager = await Manager.findById(id);
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }
    await Manager.deleteOne({ _id: id }); // Updated deletion method
    res.json({ message: "Manager deleted successfully" });
    console.log(manager);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
const loginManager = async (req, res) => {
  const { email, password } = req.body;
  try {
    const manager = await Manager.findOne({ email });
    if (!manager) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const match = await bcrypt.compare(password, manager.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: manager._id, email: manager.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get shop name from slug
const getShop = async (req, res) => {
  const query = req.query;
  console.log(query.urlSlug);
  try {
    const manager = await Manager.findOne({ urlSlug: query.urlSlug });
    console.log(manager);
    if (!manager) {
      return res.status(404).json({ message: "Shop doesn't exist" });
    }
    res.json({
      _id: manager._id,
      shopName: manager.shopName,
      profileImg: manager.profileImg,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getShopImg = async (req, res) => {
  const query = req.query;
  console.log(query.shopId);
  try {
    const manager = await Manager.findOne({ _id: query.shopId });
    console.log(manager);
    if (!manager) {
      return res.status(404).json({ message: "Shop doesn't exist" });
    }
    res.json(manager.profileImg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllManagers,
  getShops,
  getManager,
  createManager,
  uploadProfileImg,
  updateManager,
  deleteProfileImg,
  deleteManager,
  loginManager,
  getShop,
  getShopImg,
};
