const express = require("express");
const router = express.Router();
const auth = require("../auth/auth");
const { isManager } = require("../middlewares/roles");
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  removeAppointment,
} = require("../controllers/appointment");

router.post("/", createAppointment);
router.get("/", getAllAppointments);
router.get("/:id", auth, getAppointmentById);
router.patch("/:id", auth, updateAppointment);
router.delete("/:id", auth, removeAppointment);

module.exports = router;
