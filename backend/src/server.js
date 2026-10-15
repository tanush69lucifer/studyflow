import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing in backend/.env");
  process.exit(1);
}

connectDB(process.env.MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`StudyFlow API on http://localhost:${PORT}`)))
  .catch(err => {
    console.error("Could not connect to MongoDB:", err.message);
    console.error("Check MONGODB_URI, the DB user/password, and Atlas Network Access (allow your IP or 0.0.0.0/0).");
    process.exit(1);
  });
