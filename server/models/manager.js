const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const workingHoursSchema = new mongoose.Schema({
  startHour: Number,
  endHour: Number,
});

const expensesSchema = new mongoose.Schema({
  name: String,
  description: String,
  value: Number,
  date: Date,
});

const notificationSchema = new mongoose.Schema({
  content: String,
  isRead: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "personal",
  },
  professionals: {
    type: Number,
    default: 1,
  },
  customers: {
    type: Number,
    default: 250,
  },
  agenda: {
    type: Boolean,
    default: true,
  },
  businessAdmin: {
    type: Boolean,
    default: true,
  },
  agendaLinkPage: {
    type: Boolean,
    default: true,
  },
  whatsAppIntegration: {
    type: Boolean,
    default: false,
  },
  appointmentReminders: {
    type: Boolean,
    default: false,
  },
});

const subscriptionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    default: null
  },
  planId: {
    type: String,
    default: null
  },
  planType: {
    type: String,
    default: null
  },
  planStartDate: {
    type: Date,
    default: null
  },
  planEndDate: {
    type: Date,
    default: null
  },
  planDuration: {
    type: Number,
    default: null
  }
});

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
      unique: true,
    },
    urlSlug: {
      type: String,
      required: true,
      unique: true,
    },
    profileImg: {
      type: String,
    },
    discount: {
      type: {
        type: String,
      },
      value: {
        type: Number,
      },
    },
    workingHours: [workingHoursSchema],
    selectedDays: {
      type: [String],
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    expenses: [expensesSchema],
    resetToken: {
      type: String,
      default: null,
    },
    isManager: {
      type: Boolean,
      default: true,
      enum: [true],
    },
    notifications: [notificationSchema],
    isActive: {
      type: Boolean,
      default: false,
    },
    // subscription: {
    //   name: {
    //     type: String,
    //     enum: ["business", "professional", "personal", "exclusive"],
    //     default: "personal",
    //   },
    //   createdAt: {
    //     type: Date,
    //     default: Date.now,
    //   },
    //   updatedAt: {
    //     type: Date,
    //     default: Date.now,
    //   },
    //   expiryDate: {
    //     type: Date,
    //     default: function () {
    //       var today = new Date();
    //       var nextYear = new Date(today.setFullYear(today.getFullYear() + 1));
    //       return nextYear;
    //     },
    //   },
    // },
    subscription: subscriptionSchema,
    plan: planSchema,
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
