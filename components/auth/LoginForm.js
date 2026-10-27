"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  HiMail,
  HiLockClosed,
  HiEye,
  HiEyeOff,
  HiExclamation,
  HiArrowLeft,
} from "react-icons/hi";

const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "ایمیل/موبایل یا رمز عبور نادرست است.",
  ACCOUNT_INACTIVE: "این حساب غیرفعال شده است.",
  ACCOUNT_LOCKED: "حساب شما موقتاً قفل شده است.",
  UNAUTHORIZED_ROLE: "فقط مدیران سایت می‌توانند وارد شوند.",
  NO_PASSWORD: "این حساب رمز عبور ندارد. با مدیر سایت تماس بگیرید.",
  RATE_LIMITED: "تعداد تلاش‌های ورود زیاد است. کمی بعد دوباره تلاش کنید.",
  DEFAULT: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
};

function parseAuthError(raw) {
  // Auth.js کد خطا را مستقیم برمی‌گرداند (مثلاً "INVALID_CREDENTIALS")
  if (ERROR_MESSAGES[raw]) return ERROR_MESSAGES[raw];
  if (raw === "CredentialsSignin") return ERROR_MESSAGES.INVALID_CREDENTIALS;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.code === "ACCOUNT_LOCKED") {
      return `حساب شما به دلیل تلاش‌های ناموفق قفل شده است. ${parsed.remainingMinutes} دقیقه دیگر تلاش کنید.`;
    }
    return ERROR_MESSAGES[parsed.code] ?? ERROR_MESSAGES.DEFAULT;
  } catch {
    return ERROR_MESSAGES.DEFAULT;
  }
}

const inputBase =
  "w-full rounded-xl border bg-slate-50 py-3 pr-11 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("لطفاً همه فیلدها را پر کنید.");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        identifier: identifier.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(parseAuthError(res.code || res.error));
        return;
      }

      // ریدایرکت استاندارد و تضمینی با بارگذاری کامل جهت نشستن کوکی سشن
      window.location.href = callbackUrl || "/admin";
    } catch {
      setError(ERROR_MESSAGES.DEFAULT);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          ورود به حساب کاربری
        </h1>
        <p className="text-sm text-slate-500">
          برای ادامه، اطلاعات حساب خود را وارد کنید.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <HiExclamation className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="identifier"
          className="block text-sm font-medium text-slate-700"
        >
          ایمیل یا شماره موبایل
        </label>
        <div className="relative">
          <HiMail className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            id="identifier"
            name="identifier"
            type="text"
            autoComplete="username"
            dir="ltr"
            placeholder="name@example.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={loading}
            className={`${inputBase} border-slate-200 focus:border-blue-500 text-left`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700"
          >
            رمز عبور
          </label>
        </div>
        <div className="relative">
          <HiLockClosed className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            dir="ltr"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className={`${inputBase} border-slate-200 focus:border-blue-500 pl-12 text-left`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-600"
            aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
          >
            {showPassword ? (
              <HiEyeOff className="h-5 w-5" />
            ) : (
              <HiEye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-blue-600 to-cyan-500 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-blue-500/40 hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            در حال ورود...
          </>
        ) : (
          <>
            ورود به پنل
            <HiArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}
