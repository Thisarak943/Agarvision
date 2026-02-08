const mongoose = require("mongoose");

const diseaseHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    predicted_disease: { type: String, required: true },
    confidence: { type: Number, required: true },
    remedies: { type: [String], default: [] },

    all_probabilities: { type: Object, default: {} },
    top2: { type: Object, default: {} },

    imageUri: { type: String, default: "" }, // optional: store original local uri
  },
  { timestamps: true }
);

module.exports = mongoose.model("DiseaseHistory", diseaseHistorySchema);
