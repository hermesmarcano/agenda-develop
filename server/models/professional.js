const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema({
  startHour: Number,
  endHour: Number,
});

const workingHoursSchema = new mongoose.Schema({
  Monday: { type: [timeSlotSchema], default: [] },
  Tuesday: { type: [timeSlotSchema], default: [] },
  Wednesday: { type: [timeSlotSchema], default: [] },
  Thursday: { type: [timeSlotSchema], default: [] },
  Friday: { type: [timeSlotSchema], default: [] },
  Saturday: { type: [timeSlotSchema], default: [] },
  Sunday: { type: [timeSlotSchema], default: [] }
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
    workingHours: workingHoursSchema,
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
