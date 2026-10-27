/**
 * Environment Variables Validation
 * اعتبارسنجی متغیرهای محیطی با Zod
 */

import { z } from "zod";
import logger from "@/lib/logger";

/**
 * Environment Schema
 */
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // NextAuth
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL باید یک URL معتبر باشد"),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET باید حداقل 32 کاراکتر باشد"),

  // Admin Config (Optional)
  ADMIN_EMAIL: z
    .string()
    .email("ADMIN_EMAIL باید یک ایمیل معتبر باشد")
    .optional(),

  // OAuth (Optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // Upstash Redis (Optional - but recommended for production)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Analytics (Optional)
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),

  // Verification (Optional)
  GOOGLE_SITE_VERIFICATION: z.string().optional(),
  YANDEX_VERIFICATION: z.string().optional(),
});

/**
 * Environment Schema (Runtime)
 * فقط فیلدهای ضروری
 */
const envSchemaRuntime = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXTAUTH_URL: z.string().min(1, "NEXTAUTH_URL الزامی است"),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET باید حداقل 32 کاراکتر باشد"),
});

/**
 * Validate Environment Variables
 */
function validateEnv() {
  try {
    // اول فقط فیلدهای ضروری را چک کن
    const parsed = envSchemaRuntime.safeParse(process.env);

    if (!parsed.success) {
      logger.error("❌ خطا در اعتبارسنجی متغیرهای محیطی:", parsed.error);
      logger.error("فیلدهای ضروری:", parsed.error.flatten().fieldErrors);

      // در production خطا پرتاب کن
      if (process.env.NODE_ENV === "production") {
        throw new Error("متغیرهای محیطی ضروری تنظیم نشده‌اند");
      } else {
        logger.warn("⚠️ برخی متغیرهای محیطی تنظیم نشده‌اند");
      }
    }

    // بررسی اختیاری‌ها و نمایش warning
    if (
      !process.env.UPSTASH_REDIS_REST_URL &&
      process.env.NODE_ENV === "production"
    ) {
      logger.warn(
        "⚠️ UPSTASH_REDIS_REST_URL تنظیم نشده - Rate Limiting از Memory استفاده می‌کند",
      );
    }

    if (!process.env.ADMIN_EMAIL) {
      logger.info(
        "ℹ️  ADMIN_EMAIL تنظیم نشده - کاربر admin باید از پنل ایجاد شود",
      );
    }

    logger.info("متغیرهای محیطی معتبر هستند");

    return parsed.data || process.env;
  } catch (error) {
    logger.error("خطای کلی در اعتبارسنجی محیط", error);
    throw error;
  }
}

/**
 * Get Environment Variables (Validated)
 */
export function getEnv() {
  return validateEnv();
}

/**
 * Check if environment is production
 */
export function isProduction() {
  return process.env.NODE_ENV === "production";
}

/**
 * Check if environment is development
 */
export function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

/**
 * Check if environment is test
 */
export function isTest() {
  return process.env.NODE_ENV === "test";
}

/**
 * Get Base URL
 */
export function getBaseUrl() {
  return process.env.NEXTAUTH_URL || "http://localhost:3000";
}

/**
 * Check if Redis is configured
 */
export function isRedisConfigured() {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

/**
 * Check if OAuth is configured
 */
export function isGoogleOAuthConfigured() {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function isGitHubOAuthConfigured() {
  return !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
}

/**
 * Check if Analytics is configured
 */
export function isAnalyticsConfigured() {
  return !!(
    process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID
  );
}

// اجرای اعتبارسنجی در زمان import (فقط یکبار)
if (typeof window === "undefined") {
  // فقط در سمت سرور
  try {
    validateEnv();
  } catch (error) {
    // در development فقط warning نمایش بده
    if (process.env.NODE_ENV !== "production") {
      console.warn("⚠️ Warning: Environment validation failed in development");
    } else {
      // در production خطا پرتاب کن
      throw error;
    }
  }
}

/**
 * Export validated env (for type safety in the future)
 */
export const env = process.env;

export default env;
