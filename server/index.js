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
const passwrodRoute = require("./routes/password");

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

app.use(
  express.json()
);

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use("/uploads", express.static("uploads"));

const databaseURL = process.env.NODE_APP_DEVELOPMENT === "true"
  ? process.env.DATABASE_URL_DEV
  : process.env.DATABASE_URL

mongoose.connect(databaseURL, {
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
app.use("/password", passwrodRoute);

app.listen(process.env.PORT || 4040, () => {
  console.log("Server started");
});
