const express = require("express");
const router = express.Router();
const {
  createCustomer,
  loginCustomer,
  getAllCustomers,
  getAllCustomersByShopName,
  getCustomer,
  getCustomerById,
  updateCustomerById,
  updateCustomer,
  deleteCustomerById,
} = require("../controllers/customer");
const auth = require("../auth/auth");
const auth2 = require("../auth/auth2");

router.post("/", createCustomer);
router.post("/login", loginCustomer);
router.get("/shopname", auth2, getAllCustomersByShopName);
router.get("/", auth2, getAllCustomers);
router.get("/id", auth2, getCustomer);
router.get("/:id", auth, getCustomerById);
router.patch("/:id", auth, updateCustomerById);
router.patch("/id", auth2, updateCustomer);
router.delete("/:id", auth2, deleteCustomerById);

module.exports = router;
