const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },

    passwordHash: { type: String, required: true },

    // simple email verification flag (optional, but your UI mentions it)
    isEmailVerified: { type: Boolean, default: true },

    // TRIAL & SUBSCRIPTION FIELDS
    // Trial: 7 days free access - set ONLY when user chooses free trial on checkout
    trialStartDate: { type: Date, default: null }, // set ONLY during free trial checkout
    trialDaysCount: { type: Number, default: 7 }, // trial duration in days

    // Current subscription plan: 'none', 'free-trial', '7-days', '1-month', '1-year'
    currentPlan: { 
      type: String, 
      enum: ['none', 'free-trial', '7-days', '1-month', '1-year'], 
      default: 'none' 
    },
    subscriptionExpiryDate: { type: Date, default: null }, // when current plan expires

    // Premium access disabled flag (e.g., for manual testing or user suspension)
    isPremiumDisabled: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
