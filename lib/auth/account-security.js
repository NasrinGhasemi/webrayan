// lib/auth/account-security.js
import { prisma } from "@/lib/prisma";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 30 * 60 * 1000; // 30 دقیقه

export async function checkAccountLock(identifier) {
  const normalizedEmail = identifier?.includes("@")
    ? identifier.toLowerCase().trim()
    : null;
  const normalizedPhone = !identifier?.includes("@") ? identifier?.trim() : null;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
        ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
      ],
    },
    select: { lockUntil: true, failedLoginAttempts: true },
  });

  if (!user) return { locked: false };

  if (user.lockUntil && user.lockUntil > new Date()) {
    const remainingMinutes = Math.ceil(
      (user.lockUntil.getTime() - Date.now()) / 60000
    );
    return {
      locked: true,
      remainingMinutes,
      message: `حساب شما به مدت ${remainingMinutes} دقیقه قفل شده است`,
    };
  }

  return { locked: false };
}

export async function recordFailedLogin(userId) {
  // atomic-ish increment in SQL via update with increment
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      failedLoginAttempts: { increment: 1 },
      lastFailedLogin: new Date(),
    },
    select: { failedLoginAttempts: true },
  });

  // lock after reaching threshold
  if (updated.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        lockUntil: new Date(Date.now() + LOCK_DURATION_MS),
        failedLoginAttempts: 0,
      },
      select: { id: true },
    });
    return 0;
  }

  return updated.failedLoginAttempts;
}

export async function resetFailedLogins(userId) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      failedLoginAttempts: 0,
      lockUntil: null,
    },
    select: { id: true },
  });
}
