const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const ManagerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    shopName: {
      type: String,
      default: "My Shop",
    },
    urlSlug: {
      type: String,
      required: true,
      unique: true,
    },
    profileImg: {
      type: String,
    },
    theme: {
      type: String,
      default: "gray",
      enum: [
        "gray",
        "sky",
        "orange",
        "teal",
        "yellow",
        "amber",
        "emerald",
        "pink",
        "rose",
      ],
    },
    resetToken: {
      type: String,
      default: null,
    },
    isManager: {
      type: Boolean,
      default: true,
      enum: [true],
    },
  },
  { timestamps: true }
);

ManagerSchema.pre("save", async function (next) {
  const manager = this;
  if (!manager.isModified("password")) return next();
  const hash = await bcrypt.hash(manager.password, 10);
  manager.password = hash;
  next();
});

ManagerSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Manager = mongoose.model("Manager", ManagerSchema);

module.exports = Manager;
