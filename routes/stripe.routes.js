const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPEKEY);
const User = require("../models/users.model");

router.get("/checkout-session", async (req, res) => {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.send(session);
});

router.put("/checkout-session/:idUser", async (req, res) => {
  const { idUser } = req.params;
  const { cusStripe } = req.body;

  try {
    const userUpdate = await User.findByIdAndUpdate(
      idUser,
      { stripeId: cusStripe, activo: true, freeTrial: false },
      { new: true }
    );
    res.status(201).json(userUpdate);
  } catch (e) {
    res.status(500).json({ errorMessage: e });
  }
});

router.post("/create-checkout-session/:id", async (req, res) => {
  const { priceId } = req.body;
  const { id } = req.params;

  const emailUSer = await User.findById(id);

  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: emailUSer.email,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,

          quantity: 1,
        },
      ],
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url:
        process.env.FRONTEND + "/success.html?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: process.env.FRONTEND + "/canceled.html",
    });

    res.send({
      sessionId: session.id,
    });
  } catch (e) {
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      },
    });
  }
});

module.exports = router;
