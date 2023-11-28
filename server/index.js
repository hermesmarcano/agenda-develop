const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const {resolve} = require('path');

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
  express.json({
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith('/webhook')) {
        req.rawBody = buf.toString();
      }
    },
  })
);

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: "stripe-samples/accept-a-payment/payment-element",
    version: "0.0.2",
    url: "https://github.com/stripe-samples"
  }
});

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

app.get('/config', (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});
app.get('/create-payment-intent', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: 'EUR',
      amount: 1999,
      automatic_payment_methods: { enabled: true }
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});
app.post('/webhook', async (req, res) => {
  let data, eventType;

  if (process.env.STRIPE_WEBHOOK_SECRET) {
    let event;
    let signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === 'payment_intent.succeeded') {
    console.log('💰 Payment captured!');
  } else if (eventType === 'payment_intent.payment_failed') {
    console.log('❌ Payment failed.');
  }
  res.sendStatus(200);
});
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
