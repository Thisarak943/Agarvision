const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isValidEmail, isValidPassword } = require("../utils/validators");
const auth = require("../middleware/auth");

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// ✅ Register
router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, phone, address, password } = req.body;

    if (!firstname || !lastname || !email || !phone || !address || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 chars and include letters + numbers"
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email: email.toLowerCase(),
      phone,
      address,
      passwordHash,
      isEmailVerified: true
    });

    // You can auto-login after register (token), OR force login screen.
    const token = signToken(user._id.toString());

    return res.status(201).json({
      message: "Registered successfully",
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
      return res.status(401).json({ message: "Invalid email or password" });

    // If you later enforce verification, switch this to false-by-default and block login.
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Email not verified",
        unverified_email: user.email,
        can_resend_verification: true
      });
    }

    const token = signToken(user._id.toString());

    return res.json({
      message: "Login success",
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get profile (test token works)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
