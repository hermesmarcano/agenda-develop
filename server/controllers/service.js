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

const deleteServiceImg = (req, res) => {
  const filename = req.params.filename;
  console.log("filename ", filename);
  const filePath = path.resolve("uploads/services", filename);
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
        // Delete the serviceImg property from the Service collection
        const id = req.id;
        const updatedService = await Service.findOneAndUpdate(
          { _id: id },
          { serviceImg: "" },
          { new: true }
        );

        if (!updatedService) {
          return res.status(404).json({ error: "Service not found" });
        }

        return res.json({
          message: "File deleted successfully",
          manager: updatedService,
        });
      } catch (err) {
        // Error occurred while updating the database
        return res.status(500).json({ error: "Failed to update the database" });
      }
    });
  });
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
  deleteServiceImg,
  deleteService,
};
