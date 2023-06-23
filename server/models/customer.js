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
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    birthday: {
      type: Date,
    },
    address: {
      type: String,
    },
    shopName: {
      type: String,
    },
    payments: {
      type: Number,
      default: 0,
    },
    isManager: {
      type: Boolean,
      default: false,
      enum: [false],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
