const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const shopsSchema = new mongoose.Schema({
  title: String,
  image: String,
  urlSlug: String,
});

const articlesSchema = new mongoose.Schema({
  title: String,
  image: String,
  author: String,
  date: String,
  content: String,
});

const servicesSchema = new mongoose.Schema({
  title: String,
  image: String,
});

const plansSchema = new mongoose.Schema({
  business: {
    type: Object,
    default: {
      price: '34.90',
      promotionalPrice: '19.90',
      annualPrice: '238.80',
      professionals: 10,
      customers: 500000,
      agenda: true,
      businessAdmin: true,
      agendaLinkPage: true,
      whatsAppIntegration: true,
      appointmentReminders: true,
    }
  },
  professional: {
    type: Object,
    default: {
      price: '29.90',
      promotionalPrice: '16.90',
      annualPrice: '202.80',
      professionals: 5,
      customers: 2000,
      agenda: true,
      businessAdmin: true,
      agendaLinkPage: true,
      whatsAppIntegration: true,
      appointmentReminders: false
    }
  },
  personal: {
    type: Object,
    default: {
      price: '19.90',
      promotionalPrice: '9.90',
      annualPrice: '108.80',
      professionals: 1,
      customers: 250,
      agenda: true,
      businessAdmin: true,
      agendaLinkPage: true,
      whatsAppIntegration: false,
      appointmentReminders: false
    }
  }
});

const AdminSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    heroData: {
      heroText: {
        type: String,
        default: "Find The Right Shop for Your Need",
      },
      heroColor: {
        type: String,
        default: "white",
      },
      heroBgColor: {
        type: String,
        default: "gray-800",
      },
      heroStyle: {
        type: String,
        enum: ["hero", "slider"],
        default: "hero",
      },
      sliderDataImgs: {
        type: [String],
      },
    },
    shopsData: [shopsSchema],
    articlesData: [articlesSchema],
    section1Data: {
      title: {
        type: String,
      },
      image: {
        type: String,
      },
      content: {
        type: String,
      },
    },
    section2Data: {
      title: {
        type: String,
      },
      image: {
        type: String,
      },
      content: {
        type: String,
      },
    },
    servicesData: [servicesSchema],
    websiteTitle: {
      type: String,
    },
    logo: {
      type: String,
    },
    Role: {
      type: String,
      default: "Admin",
      enum: ["Admin"],
      unique: true,
    },
    plans: plansSchema
  },
  { timestamps: true }
);

AdminSchema.pre("save", async function (next) {
  const admin = this;
  if (!admin.isModified("password")) return next();
  const hash = await bcrypt.hash(admin.password, 10);
  admin.password = hash;
  next();
});

// AdminSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };
AdminSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);

  // Log the hashed password
  console.log("Hashed password:", this.password);

  return isMatch;
};

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
