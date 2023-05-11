const mongoose = require("mongoose");

const professionalSchema = new mongoose.Schema(
  {
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manager",
    },
    shopName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    officeHours: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    activated: {
      type: Boolean,
      default: true,
    },
    isManager: {
      type: Boolean,
      default: false,
      enum: [false],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Professional", professionalSchema);
