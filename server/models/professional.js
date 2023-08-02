const mongoose = require("mongoose");

const officeHoursSchema = new mongoose.Schema({
  startHour: Number,
  endHour: Number,
});

const professionalSchema = new mongoose.Schema(
  {
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manager",
    },
    shopName: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    officeHours: [officeHoursSchema],
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
    commissionPercentServices: {
      type: Number,
      default: 50, // Default commission for services (50%)
    },
    commissionPercentProducts: {
      type: Number,
      default: 50, // Default commission for products (50%)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Professional", professionalSchema);
