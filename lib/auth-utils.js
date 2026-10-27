import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ثوابت نقش‌ها
export const USER_ROLES = Object.freeze({
  ADMIN: "admin",
  USER: "user",
});

// ثوابت دسترسی‌ها جهت سازگاری
export const PERMISSIONS = Object.freeze({
  VIEW_USERS: "view_users",
  EDIT_USER: "edit_user",
  DELETE_USER: "delete_user",
  MANAGE_ROLES: "manage_roles",
  VIEW_CONTENT: "view_content",
  CREATE_CONTENT: "create_content",
  EDIT_CONTENT: "edit_content",
  DELETE_CONTENT: "delete_content",
  VIEW_PORTFOLIO: "view_portfolio",
  CREATE_PORTFOLIO: "create_portfolio",
  EDIT_PORTFOLIO: "edit_portfolio",
  DELETE_PORTFOLIO: "delete_portfolio",
  VIEW_MESSAGES: "view_messages",
  REPLY_MESSAGES: "reply_messages",
  DELETE_MESSAGES: "delete_messages",
  VIEW_ANALYTICS: "view_analytics",
  MANAGE_SETTINGS: "manage_settings",
});

export const ROLE_PERMISSIONS = Object.freeze({
  admin: Object.values(PERMISSIONS),
  user: [],
});

// توابع کمکی همگام
export function isAdmin(user) {
  return user?.role === USER_ROLES.ADMIN;
}

export function isAuthenticated(user) {
  return !!user;
}

export function hasAdminAccess(user) {
  return isAdmin(user);
}

export function isModerator() {
  return false;
}

export function hasPermission(userRole, permission) {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
}

export function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function validatePasswordStrength(password) {
  const minLength = typeof password === "string" && password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return {
    isValid: minLength && hasUppercase && hasLowercase && hasNumber,
    minLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
  };
}

/**
 * بررسی زنده نقش ادمین و فعال بودن حساب کاربری از طریق دیتابیس پریزما
 */
export async function requireLiveAdmin() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        ok: false,
        status: 401,
        message: "لطفاً ابتدا وارد حساب کاربری خود شوید.",
      };
    }

    const liveUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, isActive: true },
    });

    if (!liveUser) {
      return {
        ok: false,
        status: 401,
        message: "کاربر یافت نشد.",
      };
    }

    if (!liveUser.isActive) {
      return {
        ok: false,
        status: 401,
        message: "حساب کاربری شما غیرفعال شده است.",
      };
    }

    if (liveUser.role !== USER_ROLES.ADMIN) {
      return {
        ok: false,
        status: 403,
        message: "شما به این بخش دسترسی ندارید.",
      };
    }

    return {
      ok: true,
      status: 200,
      user: liveUser,
    };
  } catch (error) {
    return {
      ok: false,
      status: 503,
      message: "خطا در برقراری ارتباط با پایگاه داده.",
    };
  }
}

/**
 * متد قدیمی اصلاح شده جهت انطباق با تغییرات جدید بدون شکستن ایمپورت‌ها
 */
export async function verifyRoleFromDB(allowedRoles = [USER_ROLES.ADMIN]) {
  const check = await requireLiveAdmin();
  if (!check.ok) return check;

  if (allowedRoles.length > 0 && !allowedRoles.includes(check.user.role)) {
    return {
      ok: false,
      status: 403,
      message: "عدم تطابق نقش کاربری.",
    };
  }

  return check;
}
