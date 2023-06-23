const express = require("express");
const router = express.Router();
const {
  createProfessional,
  getProfessionals,
  getProfessionalsByShopId,
  getProfessionalById,
  updateProfessional,
  deleteProfessional,
} = require("../controllers/professional");
const { isManager, isAdmin } = require("../middlewares/roles");
const auth = require("../auth/auth");

router.post("/", auth, createProfessional);
router.get("/shop", getProfessionalsByShopId);
router.get("/", getProfessionals);
router.get("/:id", auth, getProfessionalById);
router.patch("/:id", auth, updateProfessional);
router.delete("/:id", auth, deleteProfessional);

module.exports = router;
