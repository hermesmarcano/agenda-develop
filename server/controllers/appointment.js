const Appointment = require("../models/appointment");

const createAppointment = async (req, res) => {
  try {
    // const { customer, professional, service, dateTime, shopName } = req.body;
    const appointment = await Appointment.create(req.body);
    res.status(201).json({ success: true, appointment });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create appointment" });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      managerId: req.query.shopId,
    })
      .populate("customer", "name")
      .populate("professional", "name")
      .populate("service", "name duration price");
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to get appointments" });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("customer", "name")
      .populate("professional", "name")
      .populate("service", "name duration");
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }
    res.json({ success: true, appointment });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to get appointment" });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }
    res.json({ success: true, appointment });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update appointment" });
  }
};

const removeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndRemove(req.params.id);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }
    res.json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete appointment" });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  removeAppointment,
};
