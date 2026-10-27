import { LRUCache } from "lru-cache";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/** تنظیم هر limiter: ttl بر حسب ms و سقف پیش‌فرض تلاش */
const CONFIG = {
  login: { windowMs: 15 * 60_000, max: 5 },
  register: { windowMs: 60 * 60_000, max: 5 },
  "forgot-password": { windowMs: 15 * 60_000, max: 5 },
  "reset-password": { windowMs: 15 * 60_000, max: 5 },
  contact: { windowMs: 60 * 60_000, max: 5 },
  "faq-question": { windowMs: 60 * 60_000, max: 5 },
};

const memory = Object.fromEntries(
  Object.entries(CONFIG).map(([k, v]) => [k, new LRUCache({ max: 5000, ttl: v.windowMs })]),
);

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

const remote = {};
function getRemote(type, max) {
  if (!redis) return null;
  const key = `${type}:${max}`;
  remote[key] ??= new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, `${Math.round(CONFIG[type].windowMs / 1000)} s`),
    prefix: `rl:${key}`,
  });
  return remote[key];
}

/**
 * @param {string} identifier مثلاً IP
 * @param {keyof typeof CONFIG} type
 * @param {number} [maxAttempts]
 * @returns {Promise<{success:boolean, retryAfter?:number, remaining?:number}>}
 */
export async function checkRateLimit(identifier, type = "login", maxAttempts) {
  const cfg = CONFIG[type];
  if (!cfg) throw new Error(`Unknown rate limiter type: ${type}`);
  const max = maxAttempts ?? cfg.max;

  const rl = getRemote(type, max);
  if (rl) {
    try {
      const r = await rl.limit(identifier);
      return {
        success: r.success,
        remaining: r.remaining,
        retryAfter: r.success ? undefined : Math.max(1, Math.ceil((r.reset - Date.now()) / 1000)),
      };
    } catch {
      // Redis در دسترس نیست: به حافظه محلی برمی‌گردیم (نه اینکه محدودیت را حذف کنیم)
    }
  }

  const cache = memory[type];
  const count = cache.get(identifier) || 0;
  if (count >= max) {
    return { success: false, retryAfter: Math.max(1, Math.ceil(cache.getRemainingTTL(identifier) / 1000)) };
  }
  // پنجره از اولین تلاش شروع می‌شود؛ ttl باقی‌مانده حفظ می‌شود
  const remaining = cache.getRemainingTTL(identifier);
  cache.set(identifier, count + 1, count > 0 && remaining > 0 ? { ttl: remaining } : undefined);
  return { success: true, remaining: max - count - 1 };
}

export function resetRateLimit(identifier, type = "login") {
  memory[type]?.delete(identifier);
}
