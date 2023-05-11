const express = require("express");
const router = express.Router();
const {
  createCustomer,
  loginCustomer,
  getAllCustomers,
  getAllCustomersByShopName,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
} = require("../controllers/customer");
const auth = require("../auth/auth2");

router.post("/", createCustomer);
router.post("/login", loginCustomer);
router.get("/shopname", auth, getAllCustomersByShopName);
router.get("/", auth, getAllCustomers);
router.get("/id", auth, getCustomerById);
router.patch("/:id", auth, updateCustomerById);
router.delete("/:id", auth, deleteCustomerById);

module.exports = router;
