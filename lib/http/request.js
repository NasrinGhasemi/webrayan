import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limiter";
import { getClientIp } from "@/lib/http/client-ip";

export function getClientInfo(request) {
  const h = request.headers;
  const ip = getClientIp(h);
  return { ip, userAgent: (h.get("user-agent") || "unknown").slice(0, 300) };
}

export const jsonError = (message, status = 400, extra = {}) =>
  NextResponse.json({ success: false, message, ...extra }, { status });

/** @returns {Promise<NextResponse|null>} پاسخ 429 یا null */
export async function enforceRateLimit(ip, type) {
  const r = await checkRateLimit(ip, type);
  if (r.success) return null;
  return NextResponse.json(
    { success: false, message: "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی بعد تلاش کنید." },
    { status: 429, headers: { "Retry-After": String(r.retryAfter ?? 60) } },
  );
}

/** parse + validate با zod */
export async function parseBody(request, schema) {
  let raw;
  try {
    raw = await request.json();
  } catch {
    return { error: jsonError("بدنه درخواست نامعتبر است", 400) };
  }
  const res = schema.safeParse(raw);
  if (!res.success) {
    const errors = {};
    for (const i of res.error.issues) errors[i.path.join(".") || "_"] ??= i.message;
    return { error: jsonError(Object.values(errors)[0] || "داده نامعتبر است", 400, { errors }) };
  }
  return { data: res.data };
}
