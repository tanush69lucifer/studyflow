import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import docsRoutes from "./docs.js";
import { errorHandler, notFound } from "./middleware/errors.js";

// Express 4 doesn't catch rejected promises from async handlers; wrap them.
const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
for (const router of [authRoutes, taskRoutes]) {
  router.stack.forEach(layer => layer.route?.stack.forEach(s => { s.handle = wrap(s.handle); }));
}

const app = express();

const allowed = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",").map(s => s.trim()).filter(Boolean);

app.set("trust proxy", true); // Render/Vercel sit behind a proxy -> real https host

app.use(cors((req, cb) => {
  const origin = req.headers.origin;
  const self = `${req.protocol}://${req.get("host")}`;
  // allow: no Origin (curl/Postman), same site (backend serving the frontend), listed frontends
  if (!origin || origin === self || allowed.includes(origin) || allowed.includes("*")) {
    return cb(null, { origin: true });
  }
  console.warn(`CORS blocked: ${origin} (add it to CLIENT_ORIGIN)`);
  cb(null, { origin: false }); // no CORS headers -> browser blocks the call
}));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});
app.use("/api", docsRoutes); // /api/docs (Swagger), /api/redoc, /api/openapi.json
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", notFound);

// In production, serve the built React app from the same server (one deploy, no CORS).
const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, "../../frontend/dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (req, res) => res.sendFile(path.join(dist, "index.html")));
} else {
  app.get("/", (req, res) => res.json({ message: "StudyFlow API is running. Try GET /api/health" }));
}

app.use(notFound);
app.use(errorHandler);

export default app;