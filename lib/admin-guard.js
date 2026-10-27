import { NextResponse } from "next/server";
import { requireLiveAdmin } from "@/lib/auth-utils";
import { csrfProtection } from "@/lib/csrf";

/**
 * نگهبان یکپارچه روت‌های ادمین: احراز هویت زنده + (اختیاری) CSRF.
 * خروجی: { response } در صورت رد، یا { user } در صورت موفقیت.
 */
export async function guardAdmin(request, { csrf = false } = {}) {
  const auth = await requireLiveAdmin();
  if (!auth.ok) {
    return {
      response: NextResponse.json(
        { success: false, message: auth.message || "دسترسی غیرمجاز" },
        { status: auth.status || 403 }
      ),
    };
  }
  if (csrf) {
    const check = await csrfProtection(request);
    if (!check.success) {
      return {
        response: NextResponse.json(
          { success: false, message: check.error || "توکن CSRF نامعتبر است" },
          { status: check.status || 403 }
        ),
      };
    }
  }
  return { user: auth.user };
}
