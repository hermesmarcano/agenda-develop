const Service = require("../models/service");

const createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    console.log(req.body);
    await service.save();
    res.status(201).json({ message: "Service created successfully", service });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const uploadServiceImg = (req, res) => {
  try {
    // Image upload successful, respond with the filename
    res.json({ filename: req.file.filename });
  } catch (error) {
    // Error occurred during upload
    console.error(error);
    res.status(500).json({ error: "Failed to upload image." });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ managerId: req.id }).populate(
      "managerId",
      "name"
    );
    res.status(200).json({ services });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllServicesByShopName = async (req, res) => {
  try {
    const services = await Service.find({ shopName: req.query.shopName });
    res.status(200).json({ services });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ service });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service updated successfully", service });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createService,
  uploadServiceImg,
  getAllServices,
  getAllServicesByShopName,
  getServiceById,
  updateService,
  deleteService,
};
