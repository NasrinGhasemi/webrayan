import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// نشست‌ها JWT هستند و در دیتابیس ذخیره نمی‌شوند.
// «نشست فعال» = ادمین‌های فعالی که در طول عمر توکن (۷ روز) وارد شده‌اند.
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export async function GET(request) {
  try {
    const authCheck = await guardAdmin(request, { csrf: false });
    if (authCheck.response) return authCheck.response;

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit"), 10) || 10, 1), 100);
    const since = new Date(Date.now() - SESSION_MAX_AGE_MS);

    const where = { isActive: true, role: "admin", lastLogin: { gt: since } };
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        orderBy: { lastLogin: "desc" },
        take: limit,
        select: { id: true, name: true, email: true, lastLogin: true },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      total,
      data: users.map((u) => ({
        _id: u.id,
        id: u.id,
        userId: u.id,
        name: u.name,
        email: u.email,
        lastLogin: u.lastLogin,
        expires: new Date(u.lastLogin.getTime() + SESSION_MAX_AGE_MS),
      })),
    });
  } catch (error) {
    console.error("[GET /api/admin/sessions]", error);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت نشست‌های فعال" },
      { status: 500 }
    );
  }
}
