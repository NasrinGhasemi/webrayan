import winston from "winston";
import { prisma } from "./prisma";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

export const AUTH_LOG_RETENTION_DAYS = 90;
const PURGE_INTERVAL_MS = 60 * 60 * 1000;
let lastPurgeAt = 0;

// حذف لاگ‌های قدیمی‌تر از مدت نگهداری؛ حداکثر یک‌بار در ساعت اجرا می‌شود.
export async function purgeOldAuthLogs({ force = false } = {}) {
  const now = Date.now();
  if (!force && now - lastPurgeAt < PURGE_INTERVAL_MS) return 0;
  lastPurgeAt = now;
  try {
    const cutoff = new Date(now - AUTH_LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000);
    const { count } = await prisma.authLog.deleteMany({
      where: { timestamp: { lt: cutoff } },
    });
    return count;
  } catch (error) {
    logger.error("Failed to purge old auth logs", {
      error: error instanceof Error ? error.message : String(error),
    });
    return 0;
  }
}

export async function logAuthEvent(type, metadata = {}) {
  try {
    purgeOldAuthLogs();
    await prisma.authLog.create({
      data: {
        type,
        userId: typeof metadata?.userId === "string" ? metadata.userId : null,
        metadata,
        environment: process.env.NODE_ENV || "development",
      },
    });

    logger.info("Auth event recorded", {
      type,
      metadata,
    });
  } catch (error) {
    // خرابی لاگ نباید باعث شکست عملیات اصلی احراز هویت شود.
    logger.error("Failed to record auth event", {
      type,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export default logger;
