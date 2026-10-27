import mongoose from "mongoose";
import connectDB from "../lib/mongoose.js";

async function setupIndexes() {
  const conn = await connectDB();
  const db = conn.db;

  // users: email و phone توسط اسکیمای Mongoose مدیریت می‌شوند
  // (models/User.js) — اینجا تکرار نمی‌کنیم تا index conflict نخوریم
  await db.collection("users").createIndexes([
    { key: { role: 1 } },
    { key: { createdAt: -1 } },
  ]);

  await db.collection("otps").createIndexes([
    { key: { identifier: 1, used: 1 } },
    { key: { expiresAt: 1 }, expireAfterSeconds: 0 },
  ]);

  await db.collection("sessions").createIndexes([
    { key: { sessionToken: 1 }, unique: true },
    { key: { userId: 1 } },
    { key: { expiresAt: 1 }, expireAfterSeconds: 0 },
  ]);

  await db.collection("reset_tokens").createIndexes([
    { key: { token: 1 }, unique: true },
    { key: { expiresAt: 1 }, expireAfterSeconds: 0 },
  ]);

  console.log("✅ All indexes created successfully");
}

setupIndexes()
  .catch((err) => {
    console.error("❌ Index setup failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
