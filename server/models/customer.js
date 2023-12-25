const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manager",
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    address: {
      type: String,
    },
    payments: {
      type: Number,
      default: 0,
    },
    lastTimeAppointmentStatus: {
      type: String,
      default: "Not Booked",
      enum: ["Not Booked", "Payment Pending", "Confirmed", "Cancelled"],
    },
  },
  { timestamps: true }
);

customerSchema.index({ managerId: 1, phone: 1 }, { unique: true });
customerSchema.index({ managerId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("Customer", customerSchema);
