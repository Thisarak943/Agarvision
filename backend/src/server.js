require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const diseaseHistoryRoutes = require("./routes/diseaseHistory");

const app = express();

// allow Expo Go / mobile
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => res.send("AgarVision API running ✅"));

app.use("/api/auth", authRoutes);
app.use("/api/disease-history", diseaseHistoryRoutes);

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, "0.0.0.0", () =>
    console.log(`✅ Server running on http://0.0.0.0:${PORT}`)
  );
});
