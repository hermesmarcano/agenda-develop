const Professional = require("../models/professional");

// Controller function for creating a new professional
const createProfessional = async (req, res) => {
  try {
    const professional = new Professional({
      ...req.body,
      managerId: req.id,
    });
    const result = await professional.save();
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Controller function for getting all professionals
const getProfessionals = async (req, res) => {
  try {
    const professionals = await Professional.find({
      managerId: req.id,
    }).populate("managerId", "name");
    res.status(200).json({ success: true, data: professionals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProfessionalsByShopName = async (req, res) => {
  try {
    const professionals = await Professional.find({
      shopName: req.query.shopName,
    });
    res.status(200).json({ success: true, data: professionals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller function for getting a single professional by ID
const getProfessionalById = async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);
    if (!professional) {
      return res
        .status(404)
        .json({ success: false, message: "Professional not found" });
    }
    res.status(200).json({ success: true, data: professional });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller function for updating a professional by ID
const updateProfessional = async (req, res) => {
  try {
    const professional = await Professional.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!professional) {
      return res
        .status(404)
        .json({ success: false, message: "Professional not found" });
    }
    res.status(200).json({ success: true, data: professional });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Controller function for deleting a professional by ID
const deleteProfessional = async (req, res) => {
  try {
    const professional = await Professional.findByIdAndDelete(req.params.id);
    if (!professional) {
      return res
        .status(404)
        .json({ success: false, message: "Professional not found" });
    }
    res.status(200).json({ success: true, data: professional });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProfessional,
  getProfessionalsByShopName,
  getProfessionals,
  getProfessionalById,
  updateProfessional,
  deleteProfessional,
};
