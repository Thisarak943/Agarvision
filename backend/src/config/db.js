const mongoose = require("mongoose");

async function connectDB(MONGO_URI) {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("⚠️  Server will run WITHOUT database (for testing only)");
    // process.exit(1); // Commented out to allow server to run
  }
}

module.exports = connectDB;
