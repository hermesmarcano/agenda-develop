const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professional",
      required: true,
    },
    service: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    product: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    amount: {
      type: Number,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
