const express = require("express");
const auth = require("../middleware/auth");
const DiseaseHistory = require("../models/DiseaseHistory");

const router = express.Router();

/**
 * POST /api/disease-history
 * Save a disease prediction (JWT required)
 */
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      predicted_disease,
      confidence,
      remedies,
      all_probabilities,
      top2,
      imageUri,
    } = req.body;

    if (!predicted_disease || confidence === undefined || confidence === null) {
      return res.status(400).json({ message: "Missing prediction data" });
    }

    const saved = await DiseaseHistory.create({
      userId,
      predicted_disease,
      confidence: Number(confidence),
      remedies: Array.isArray(remedies) ? remedies : [],
      all_probabilities: all_probabilities || {},
      top2: top2 || {},
      imageUri: imageUri || "",
    });

    return res.status(201).json({ message: "Saved", item: saved });
  } catch (err) {
    console.error("DiseaseHistory POST error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/disease-history
 * Get latest 50 predictions for logged-in user
 */
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const items = await DiseaseHistory.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({ items });
  } catch (err) {
    console.error("DiseaseHistory GET error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE /api/disease-history/:id
 * (optional) delete one record
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const deleted = await DiseaseHistory.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ message: "Not found" });

    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DiseaseHistory DELETE error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
