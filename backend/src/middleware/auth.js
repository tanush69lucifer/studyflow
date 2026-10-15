import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Reads "Authorization: Bearer <token>", verifies it and attaches req.user.
export async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Not authorized: token missing" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "Not authorized: user no longer exists" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Not authorized: invalid or expired token" });
  }
}
