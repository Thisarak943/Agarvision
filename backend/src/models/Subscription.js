const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    plan: { 
      type: String, 
      enum: ['free-trial', '7-days', '1-month', '1-year'], 
      required: true 
    },
    // When subscription was purchased/activated
    startDate: { 
      type: Date, 
      default: () => new Date() 
    },
    // When subscription expires
    expiryDate: { 
      type: Date, 
      required: true 
    },
    // Status: 'active', 'expired'
    status: { 
      type: String, 
      enum: ['active', 'expired'], 
      default: 'active' 
    },
    // Fake payment reference
    transactionId: { 
      type: String, 
      unique: true, 
      required: true 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
