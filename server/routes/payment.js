const express = require("express");
const router = express.Router();
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentByAppointmentId,
  updatePayment,
  deletePayment,
} = require("../controllers/payment");
const { isAdmin } = require("../middlewares/roles");
const auth = require("../auth/auth");
const stripe = require("stripe")("YOUR_SECRET_API_KEY");

router.post("/", createPayment);
router.post("/create-payment-intent", async (req, res) => {
  const { amount, paymentMethodId, currency } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    payment_method: paymentMethodId,
    confirmation_method: "manual",
    confirm: true,
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
router.post("/webhook", (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  let paymentIntent;
  switch (event.type) {
    case "payment_intent.succeeded":
      paymentIntent = event.data.object;
      break;
    case "payment_intent.payment_failed":
      paymentIntent = event.data.object;
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.sendStatus(200);
});

router.get("/", auth, getAllPayments);
router.get("/:id", auth, getPaymentById);
router.get("/appt/:id", auth, getPaymentByAppointmentId);
router.patch("/:id", updatePayment);
router.delete("/:id", auth, deletePayment);

module.exports = router;
