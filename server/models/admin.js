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
        default: "gray-800",
      },
      image: {
        type: String,
        default: "",
      },
      content: {
        type: String,
        default:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce consequat lorem id congue dignissim. Sed vitae diam euismod, bibendum tortor eu, ultrices velit. Nullam in eros sit amet nisi luctus laoreet. Curabitur varius pharetra ex, ac mattis nibh commodo et. Integer laoreet mauris at convallis lacinia. Donec posuere augue a lacinia faucibus. Suspendisse potenti. Aenean semper velit velit, nec fringilla ex interdum eu. Proin ullamcorper, enim ac egestas euismod, augue justo tristique justo, non posuere libero enim non orci. Sed ut magna aliquam, volutpat tellus id, rhoncus tellus. In vulputate quis elit ut dapibus. Cras mollis erat vel justo auctor, vel interdum tellus dignissim. In at turpis pharetra, malesuada diam vel, elementum elit. Integer sollicitudin augue nec sapien luctus, eget vestibulum sem dictum. Fusce rutrum nisl id turpis maximus congue. Sed vel augue vitae nibh gravida lobortis vel at ipsum.",
      },
    },
    section2Data: {
      title: {
        type: String,
        default: "Lorem Ipsum",
      },
      image: {
        type: String,
        default: "",
      },
      content: {
        type: String,
        default:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce consequat lorem id congue dignissim. Sed vitae diam euismod, bibendum tortor eu, ultrices velit. Nullam in eros sit amet nisi luctus laoreet. Curabitur varius pharetra ex, ac mattis nibh commodo et. Integer laoreet mauris at convallis lacinia. Donec posuere augue a lacinia faucibus. Suspendisse potenti. Aenean semper velit velit, nec fringilla ex interdum eu. Proin ullamcorper, enim ac egestas euismod, augue justo tristique justo, non posuere libero enim non orci. Sed ut magna aliquam, volutpat tellus id, rhoncus tellus. In vulputate quis elit ut dapibus. Cras mollis erat vel justo auctor, vel interdum tellus dignissim. In at turpis pharetra, malesuada diam vel, elementum elit. Integer sollicitudin augue nec sapien luctus, eget vestibulum sem dictum. Fusce rutrum nisl id turpis maximus congue. Sed vel augue vitae nibh gravida lobortis vel at ipsum.",
      },
    },
    servicesData: [servicesSchema],
    websiteTitle: {
      type: String,
      default: "My Website",
    },
    logo: {
      type: String,
    },
    isManager: {
      type: Boolean,
      default: false,
      enum: [false],
    },
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

AdminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
