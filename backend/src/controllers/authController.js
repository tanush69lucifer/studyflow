import jwt from "jsonwebtoken";
import User from "../models/User.js";

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

// POST /api/auth/register  body: { name, email, password }
export async function register(req, res) {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }
  if (String(password).length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }
  const user = await User.create({ name, email, password });
  res.status(201).json({ message: "Account created", token: signToken(user), user });
}

// POST /api/auth/login  body: { email, password }
export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json({ message: "Logged in", token: signToken(user), user });
}

// GET /api/auth/me  (protected)
export function me(req, res) {
  res.json({ user: req.user });
}
