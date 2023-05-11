const Customer = require("../models/customer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Function to create a new customer
const createCustomer = async (req, res) => {
  try {
    const { name, phone, shopName } = req.body;
    const customer = new Customer({ name, phone, shopName });
    await customer.save();
    res
      .status(201)
      .json({ message: "Customer created successfully!", customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to authenticate a customer by phone
const loginCustomer = async (req, res) => {
  try {
    const { phone } = req.body;

    const customer = await Customer.findOne({ phone });

    if (!customer) {
      return res.status(401).json({ message: "Invalid phone number" });
    }

    // create JWT token for the authenticated user
    const token = jwt.sign(
      { customerId: customer._id, shopName: req.query.shopName },
      process.env.JWT_SECRET
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Function to get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ managerId: req.id }).populate(
      "managerId",
      "name"
    );
    res.status(200).json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllCustomersByShopName = async (req, res) => {
  try {
    const customers = await Customer.find({ shopName: req.query.shopName });
    res.status(200).json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get a single customer by id
const getCustomerById = async (req, res) => {
  try {
    console.log(req.customerId);
    const id = req.customerId;
    const customer = await Customer.findById(id).select(
      "_id shopName name phone"
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to update a customer by id
const updateCustomerById = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, phone },
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res
      .status(200)
      .json({ message: "Customer updated successfully!", customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to delete a customer by id
const deleteCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createCustomer,
  loginCustomer,
  getAllCustomers,
  getAllCustomersByShopName,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
};
