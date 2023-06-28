const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manager",
    },
    shopName: {
      type: String,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      // required: true,
    },
    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professional",
      // required: true,
    },
    service: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    dateTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    product: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    status: {
      type: String,
      enum: ["pending", "confirmed", "updated", "cancelled"],
      default: "pending",
    },
    blocking: {
      type: Boolean,
      default: false,
    },
    blockingDuration: {
      type: Number,
    },
    blockingReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
