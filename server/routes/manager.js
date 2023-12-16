require('dotenv').config()
const express = require("express");
const Manager = require("../models/manager");
const moment = require("moment");
const router = express.Router();
const {
  getAllManagers,
  getManager,
  getPlan,
  createManager,
  uploadProfileImg,
  updateManager,
  updatePlan,
  deleteProfileImg,
  deleteManager,
  loginManager,
  getShop,
  getShops,
  getShopImg,
} = require("../controllers/manager");
// const { isManager, isAdmin } = require("../middlewares/roles");
const auth = require("../auth/auth");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


router.get("/shop", getShop);
router.get("/shops", getShops);
router.get("/shopImg", getShopImg);
router.get("/", auth, getAllManagers);
router.get("/id", auth, getManager);
router.get("/plan", auth, getPlan);
router.post("/", createManager);
// router.post("/profileImg", upload.single("profileImg"), uploadProfileImg);
router.patch("/", auth, updateManager);
router.patch("/plan", auth, updatePlan);
router.delete("/profile/:filename", auth, deleteProfileImg);

router.delete("/:id", auth, deleteManager);
router.post("/login", loginManager);

const stripeSession = async (plan) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan,
          quantity: 1,
        },
      ],
      success_url: `${process.env.STATIC_DIR}/payment-success`,
      cancel_url: `${process.env.STATIC_DIR}/payment-cancel`,
    });
    return session;
  } catch (e) {
    return e;
  }
};

router.post("/create-subscription-checkout-session", auth, async (req, res) => {
  const { plan } = req.body;
  let planId = null;
  if (plan == "personal")
    planId = process.env.STRIPE_SUBSCRIPTION_PERSONAL_PRICE_YEAR;
  else if (plan == "professional") 
    planId = process.env.STRIPE_SUBSCRIPTION_PROFESSIONAL_PRICE_YEAR;
  else if (plan == "business")
    planId = process.env.STRIPE_SUBSCRIPTION_BUSINESS_PRICE_YEAR;

  try {
    const session = await stripeSession(planId);
    const userId = req.id;
    const manager = await Manager.findById(userId);
    if (!manager) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!manager.subscription) {
      manager.subscription = {};
    }
    manager.subscription.sessionId = session.id;
    await manager.save();
    
    
    console.log({
      session: session,
    });
    return res.json({
      session: session,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to get the session", message: err.message });
  }
});

/************ payment success ********/

router.patch("/payment-success", auth, async (req, res) => {
  const { sessionId } = req.body;
  console.log(sessionId);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log(session);

    if (session.payment_status === "paid") {
      const subscriptionId = session.subscription;
      try {
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        const userId = req.id;
        const planId = subscription.plan.id;
        let planType;
        if (subscription.plan.amount === 11880) planType = "personal";
        else if (subscription.plan.amount === 20280) planType = "professional";
        else if (subscription.plan.amount === 23880) planType = "business";

        const startDate = moment
          .unix(subscription.current_period_start)
          .format("YYYY-MM-DD");
        const endDate = moment
          .unix(subscription.current_period_end)
          .format("YYYY-MM-DD");
        const durationInSeconds =
          subscription.current_period_end - subscription.current_period_start;
        const durationInDays = moment
          .duration(durationInSeconds, "seconds")
          .asDays();

        const manager = await Manager.findById(userId);
        if (!manager) {
          return res.status(404).json({ message: "User not found" });
        }
        manager.subscription = {
          sessionId: null,
          planId: planId,
          planType: planType,
          planStartDate: startDate,
          planEndDate: endDate,
          planDuration: durationInDays,
        };
        await manager.save();

        return res.json({ message: "Payment successful" });
      } catch (error) {
        console.error("Error retrieving subscription:", error);
      }
    } else {
      return res.json({ message: "Payment failed" });
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;

// app.get('/config', (req, res) => {
//   res.send({
//     publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
//   });
// });

// app.get('/create-payment-intent', async (req, res) => {
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       currency: 'EUR',
//       amount: 1999,
//       automatic_payment_methods: { enabled: true }
//     });

//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (e) {
//     return res.status(400).send({
//       error: {
//         message: e.message,
//       },
//     });
//   }
// });
// app.post('/webhook', async (req, res) => {
//   let data, eventType;

//   if (process.env.STRIPE_WEBHOOK_SECRET) {
//     let event;
//     let signature = req.headers['stripe-signature'];
//     try {
//       event = stripe.webhooks.constructEvent(
//         req.rawBody,
//         signature,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       console.log(`⚠️  Webhook signature verification failed.`);
//       return res.sendStatus(400);
//     }
//     data = event.data;
//     eventType = event.type;
//   } else {
//     data = req.body.data;
//     eventType = req.body.type;
//   }

//   if (eventType === 'payment_intent.succeeded') {
//     console.log('💰 Payment captured!');
//   } else if (eventType === 'payment_intent.payment_failed') {
//     console.log('❌ Payment failed.');
//   }
//   res.sendStatus(200);
// });
