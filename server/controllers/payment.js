const Payment = require("../models/payment");

const mongoose = require("mongoose");

const createPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json({ message: "Payment created successfully", payment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllPayments = async (req, res) => {
  try {
    if (req.query.appt) {
      // If 'appt' query parameter is present, retrieve payment by appointment ID
      const payment = await Payment.findOne({ appointment: req.query.appt })
        .populate("customer", "name")
        .populate("service", "name price")
        .populate("professional", "name")
        .populate("product", "name price");
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.status(200).json({ payment });
    } else {
      // If 'appt' query parameter is not present, retrieve all payments
      const payments = await Payment.find({ managerId: req.query.shopId })
        .populate("customer", "name")
        .populate("service", "name price")
        .populate("professional", "_id name")
        .populate("product", "name price");
      res.status(200).json({ payments });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ payment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Payment updated successfully", payment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};
