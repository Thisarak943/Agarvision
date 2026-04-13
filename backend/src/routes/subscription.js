const express = require("express");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const auth = require("../middleware/auth");
const {
  hasPremiumAccess,
  calculateExpiryDate,
  getTrialDaysRemaining,
  getSubscriptionDaysRemaining
} = require("../utils/premiumAccess");

const router = express.Router();

/**
 * ✅ GET /api/subscription/status
 * Get user's current subscription and trial status
 */
router.get("/status", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "email currentPlan subscriptionExpiryDate trialStartDate trialDaysCount isPremiumDisabled"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hasPremium = hasPremiumAccess(user);
    const trialDaysRemaining = getTrialDaysRemaining(user);
    const subscriptionDaysRemaining = getSubscriptionDaysRemaining(user);

    return res.json({
      hasPremiumAccess: hasPremium,
      currentPlan: user.currentPlan,
      isPremiumDisabled: user.isPremiumDisabled,
      trialStartDate: user.trialStartDate,
      trialDaysRemaining,
      subscriptionExpiryDate: user.subscriptionExpiryDate,
      subscriptionDaysRemaining,
      isSpecialUser: user.email === "thisara@gmail.com"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ POST /api/subscription/checkout
 * NEW FLOW: Choose between FREE TRIAL or PAID PLAN with card details
 * Body: {
 *   type: 'free-trial' | 'paid-plan',
 *   plan: '7-days' | '1-month' | '1-year' (required for paid-plan),
 *   cardDetails: { cardNumber, cvv, expiryMonth, expiryYear, cardholderName } (required for paid-plan)
 * }
 */
router.post("/checkout", auth, async (req, res) => {
  try {
    const { type, plan, cardDetails } = req.body;

    // Validate request
    if (!type || !['free-trial', 'paid-plan'].includes(type)) {
      return res.status(400).json({ message: "Invalid checkout type" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Special user (thisara@gmail.com) - allow but note
    if (user.email === "thisara@gmail.com") {
      return res.status(400).json({
        message: "Premium user has unlimited access - no checkout needed"
      });
    }

    let expiryDate, transactionId, finalPlan;

    if (type === 'free-trial') {
      // ✅ FREE TRIAL: 7 days, no payment needed
      const trialStartDate = new Date();
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);

      expiryDate = trialEndDate;
      finalPlan = 'free-trial';
      transactionId = `TRIAL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Update user with trial info
      user.trialStartDate = trialStartDate;
      user.trialDaysCount = 7;
      user.currentPlan = 'free-trial';
      user.subscriptionExpiryDate = trialEndDate;
      await user.save();

      // Create subscription record
      await Subscription.create({
        userId: user._id,
        plan: 'free-trial',
        startDate: trialStartDate,
        expiryDate: trialEndDate,
        status: 'active',
        transactionId
      });

      return res.status(201).json({
        message: "Free trial activated successfully",
        type: 'free-trial',
        subscription: {
          plan: 'free-trial',
          startDate: trialStartDate,
          expiryDate: trialEndDate,
          transactionId,
          daysRemaining: 7
        },
        hasPremiumAccess: true
      });
    }

    if (type === 'paid-plan') {
      // ✅ PAID PLAN: Validate card details and charge
      if (!plan || !['7-days', '1-month', '1-year'].includes(plan)) {
        return res.status(400).json({ message: "Invalid plan selected" });
      }

      if (!cardDetails) {
        return res.status(400).json({ message: "Card details required for paid plan" });
      }

      // Validate card details (fake validation - just check they exist)
      const { cardNumber, cvv, expiryMonth, expiryYear, cardholderName } = cardDetails;

      if (!cardNumber || !cvv || !expiryMonth || !expiryYear || !cardholderName) {
        return res.status(400).json({
          message: "All card details are required",
          required: ['cardNumber', 'cvv', 'expiryMonth', 'expiryYear', 'cardholderName']
        });
      }

      // Simple validation (fake)
      if (cardNumber.length < 13 || cardNumber.length > 19) {
        return res.status(400).json({ message: "Invalid card number" });
      }

      if (cvv.length < 3 || cvv.length > 4) {
        return res.status(400).json({ message: "Invalid CVV" });
      }

      // Calculate expiry date based on selected plan
      expiryDate = calculateExpiryDate(plan);
      finalPlan = plan;
      transactionId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Fake charge amount (for reference)
      const chargeAmounts = {
        '7-days': 'US$2.99',
        '1-month': 'US$9.99',
        '1-year': 'US$79.99'
      };

      // Update user
      user.currentPlan = plan;
      user.subscriptionExpiryDate = expiryDate;
      await user.save();

      // Create subscription record
      const subscription = await Subscription.create({
        userId: user._id,
        plan,
        startDate: new Date(),
        expiryDate,
        status: 'active',
        transactionId
      });

      return res.status(201).json({
        message: "Payment successful",
        type: 'paid-plan',
        subscription: {
          plan: subscription.plan,
          startDate: subscription.startDate,
          expiryDate: subscription.expiryDate,
          transactionId: subscription.transactionId,
          amount: chargeAmounts[plan]
        },
        hasPremiumAccess: true
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ GET /api/subscription/check-premium-access
 * Simple check if user can access premium services
 * Returns: { hasPremiumAccess: boolean }
 */
router.get("/check-premium-access", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "email currentPlan subscriptionExpiryDate trialStartDate trialDaysCount isPremiumDisabled"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hasAccess = hasPremiumAccess(user);

    return res.json({
      hasPremiumAccess: hasAccess
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ GET /api/subscription/trial-info
 * Get detailed trial information
 */
router.get("/trial-info", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "email trialStartDate trialDaysCount"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const trialEndDate = new Date(user.trialStartDate);
    trialEndDate.setDate(trialEndDate.getDate() + user.trialDaysCount);

    const daysRemaining = getTrialDaysRemaining(user);
    const isTrialActive = daysRemaining > 0;

    return res.json({
      trialStartDate: user.trialStartDate,
      trialEndDate,
      trialDaysRemaining: daysRemaining,
      isTrialActive
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ GET /api/subscription/history
 * Get user's subscription purchase history
 */
router.get("/history", auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({
      userId: req.user.userId
    }).sort({ createdAt: -1 });

    return res.json({
      subscriptions
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ POST /api/subscription/migrate-existing-user
 * Initialize subscription fields for existing users who signed up before the system was added
 * For users created before subscription system: set trial period based on createdAt
 */
router.post("/migrate-existing-user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already has subscription fields initialized
    if (user.trialStartDate && user.trialDaysCount) {
      return res.status(400).json({
        message: "User already initialized with subscription fields"
      });
    }

    // For existing users, use their createdAt as trial start
    // But since they've been here > 7 days, they need to pay now
    user.trialStartDate = user.createdAt || new Date();
    user.trialDaysCount = 7;
    user.currentPlan = 'none';
    user.subscriptionExpiryDate = null;
    user.isPremiumDisabled = false;

    await user.save();

    // Check if user still has trial or is already expired
    const daysRemaining = getTrialDaysRemaining(user);
    const hasPremium = hasPremiumAccess(user);

    return res.json({
      message: "User migrated successfully",
      user: {
        email: user.email,
        trialStartDate: user.trialStartDate,
        trialDaysRemaining: daysRemaining,
        hasPremiumAccess: hasPremium
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
