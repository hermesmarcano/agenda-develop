const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const appointmentRoute = require("./routes/appointment");
const customerRoute = require("./routes/customer");
const professionalRoute = require("./routes/professional");
const serviceRoute = require("./routes/service");
const productRoute = require("./routes/product");
const adminRoute = require("./routes/admin");
const managerRoute = require("./routes/manager");
const paymentRoute = require("./routes/payment");

require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
    methods: "*",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());

app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

app.use("/appointments", appointmentRoute);
app.use("/customers", customerRoute);
app.use("/professionals", professionalRoute);
app.use("/services", serviceRoute);
app.use("/products", productRoute);
app.use("/admin", adminRoute);
app.use("/managers", managerRoute);
app.use("/payments", paymentRoute);

app.listen(process.env.PORT || 4040, () => {
  console.log("Server started");
});
