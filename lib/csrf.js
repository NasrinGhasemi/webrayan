import crypto from "crypto";

const MAX_AGE_MS = 2 * 60 * 60 * 1000; // ۲ ساعت

function getSecret() {
  const s = process.env.CSRF_SECRET || process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("CSRF_SECRET (یا AUTH_SECRET) تنظیم نشده است");
  return s;
}

const sign = (payload) => crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");

/** توکن: nonce.timestamp.hmac */
export function generateCsrfToken() {
  const payload = `${crypto.randomBytes(24).toString("hex")}.${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyCsrfToken(token) {
  if (typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [nonce, ts, mac] = parts;
  const age = Date.now() - Number(ts);
  if (!Number.isFinite(age) || age < 0 || age > MAX_AGE_MS) return false;
  try {
    const a = Buffer.from(mac, "hex");
    const b = Buffer.from(sign(`${nonce}.${ts}`), "hex");
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** برای route handlerهایی که متد تغییردهنده دارند */
export async function csrfProtection(request) {
  if (!verifyCsrfToken(request.headers.get("x-csrf-token"))) {
    return { success: false, status: 403, error: "توکن CSRF نامعتبر است" };
  }
  return { success: true };
}
