import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { CredentialsSignin } from "next-auth";

import { prisma } from "@/lib/prisma";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limiter";
import { getClientIp } from "@/lib/http/client-ip";
import { logAuthEvent } from "@/lib/logger";

const ADMIN_ROLE = "admin";

/**
 * خطای قابل نمایش به کاربر. Auth.js فقط «code» کلاس CredentialsSignin را
 * به کلاینت می‌رساند (res.error)؛ پیام خطای عادی به کلاینت نمی‌رسد.
 */
class AuthFailure extends CredentialsSignin {
  constructor(code) {
    super();
    this.code = code;
  }
}

/**
 * WebRayan Auth (Prisma/PostgreSQL)
 * - Credentials login via email or phone
 * - Admin-only authentication (no public user login)
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        // IMPORTANT: schema.prisma field name
        ["password"]: { label: "Password", type: "password" },
      },

      async authorize(credentials, request) {
        const reqIp = request?.headers ? getClientIp(request.headers) : "unknown";
        const reqUa = request?.headers?.get?.("user-agent") || "unknown";
        let attemptedUserId = null;
        try {
          const identifier = String(credentials?.identifier || "").trim();
          const password = String(credentials?.["password"] || "");

          if (!identifier || !password) {
            throw new AuthFailure("INVALID_CREDENTIALS");
          }

          const normalizedIdentifier = identifier.toLowerCase();

          // محدودیت تلاش ورود: هم برای (آی‌پی + حساب) و هم کلی برای آی‌پی
          const ip = request?.headers ? getClientIp(request.headers) : "unknown";
          const accountKey = `${ip}:${normalizedIdentifier}`;
          const [perAccount, perIp] = await Promise.all([
            checkRateLimit(accountKey, "login"),
            checkRateLimit(ip, "login", 20),
          ]);
          if (!perAccount.success || !perIp.success) {
            throw new AuthFailure("RATE_LIMITED");
          }
          const isEmail = normalizedIdentifier.includes("@");

          const user = await prisma.user.findFirst({
            where: isEmail
              ? { email: normalizedIdentifier }
              : { phone: normalizedIdentifier },
            select: {
              id: true,
              // IMPORTANT: schema.prisma field name
              ["password"]: true,
              role: true,
              isActive: true,
            },
          });

          if (!user) {
            throw new AuthFailure("INVALID_CREDENTIALS");
          }
          attemptedUserId = user.id;

          if (!user.isActive) {
            throw new AuthFailure("ACCOUNT_INACTIVE");
          }

          // Admin-only login requirement
          if (user.role !== ADMIN_ROLE) {
            throw new AuthFailure("UNAUTHORIZED_ROLE");
          }

          const storedPassword = user["password"];
          if (!storedPassword) {
            throw new AuthFailure("NO_PASSWORD");
          }

          const isValid = await bcrypt.compare(password, storedPassword);
          if (!isValid) {
            throw new AuthFailure("INVALID_CREDENTIALS");
          }

          resetRateLimit(accountKey, "login");

          // Update lastLogin (best-effort)
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          });

          await logAuthEvent("LOGIN", { userId: user.id, ip: reqIp, userAgent: reqUa });
          return { id: user.id, role: user.role };
        } catch (err) {
          // فقط ایمیل/شناسه ورودی ذخیره نمی‌شود (حریم خصوصی)؛ دلیل خطا ثبت می‌شود
          await logAuthEvent("FAILED_LOGIN", {
            userId: attemptedUserId,
            reason: err?.code || "UNKNOWN",
            ip: reqIp,
            userAgent: reqUa,
          });
          // NextAuth expects: null -> invalid credentials (but no custom error page message)
          // We throw JSON-stringified errors so UI can parse it if needed (your LoginForm already does this style).
          throw err;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // initial sign-in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.lastRoleCheck = Date.now();
        return token;
      }

      // periodic role re-check (every 5 minutes)
      const lastCheck = typeof token.lastRoleCheck === "number" ? token.lastRoleCheck : 0;
      if (!token.id) return token;

      if (Date.now() - lastCheck > 5 * 60 * 1000) {
        const liveUser = await prisma.user.findUnique({
          where: { id: String(token.id) },
          select: { role: true, isActive: true },
        });

        // user removed or disabled => invalidate session
        if (!liveUser || !liveUser.isActive) {
          delete token.id;
          delete token.role;
          token.lastRoleCheck = Date.now();
          return token;
        }

        token.role = liveUser.role;
        token.lastRoleCheck = Date.now();
      }

      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
