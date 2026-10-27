import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/admin-guard";
import { purgeOldAuthLogs } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parsePositiveInteger(value, fallback, maximum) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.min(parsed, maximum);
}

export async function GET(request) {
  try {
    const authCheck = await guardAdmin(request, { csrf: false });
    if (authCheck.response) return authCheck.response;
    const { searchParams } = new URL(request.url);
    const page = parsePositiveInteger(searchParams.get("page"), 1, Number.MAX_SAFE_INTEGER);
    const limit = parsePositiveInteger(searchParams.get("limit"), 50, 100);

    const type = searchParams.get("type")?.trim();
    const userId = searchParams.get("userId")?.trim();

    const where = {};
    if (type) { where.type = type; }
    if (userId) { where.userId = userId; }

    const skip = (page - 1) * limit;
    await purgeOldAuthLogs();

    const [logs, total] = await prisma.$transaction([
      prisma.authLog.findMany({
        where,
        orderBy: { timestamp: "desc" },
        skip,
        take: limit,
      }),
      prisma.authLog.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: logs.map(log => ({
        ...log,
        _id: log.id, // سازگاری با _id
        ip: log.metadata?.ip ?? null,
        userAgent: log.metadata?.userAgent ?? null,
        reason: log.metadata?.reason ?? null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/auth-logs]", error);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت لاگ‌های امنیتی سیستم" },
      { status: 500 }
    );
  }
}

// حذف یک رکورد: DELETE /api/admin/auth-logs?id=...
// حذف همه:       DELETE /api/admin/auth-logs?all=true
export async function DELETE(request) {
  try {
    const authCheck = await guardAdmin(request, { csrf: true });
    if (authCheck.response) return authCheck.response;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")?.trim();
    const all = searchParams.get("all") === "true";

    if (!id && !all) {
      return NextResponse.json(
        { success: false, message: "شناسه لاگ یا all=true لازم است" },
        { status: 400 }
      );
    }

    const { count } = await prisma.authLog.deleteMany({
      where: all ? {} : { id },
    });
    return NextResponse.json({ success: true, deleted: count });
  } catch (error) {
    console.error("[DELETE /api/admin/auth-logs]", error);
    return NextResponse.json(
      { success: false, message: "خطا در حذف لاگ" },
      { status: 500 }
    );
  }
}
