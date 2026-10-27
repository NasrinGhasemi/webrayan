import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireLiveAdmin } from "@/lib/auth-utils";
import { csrfProtection } from "@/lib/csrf";
import { portfolioProjectSchema, portfolioUpdateSchema } from "@/lib/schemas";
import { jsonError, parseBody } from "@/lib/http/request";
import logger from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: لیست پروژه‌ها
// کاربر عمومی فقط پروژه‌های منتشرشده را می‌بیند؛ ادمین می‌تواند فیلتر کند.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = (searchParams.get("search") || "").trim().slice(0, 100);
    const usePage = searchParams.has("page");
    const pageSize = [10, 20, 50].includes(Number(searchParams.get("pageSize")))
      ? Number(searchParams.get("pageSize"))
      : 10;
    const limit = usePage
      ? pageSize
      : Math.min(Math.max(parseInt(searchParams.get("limit") || "50", 10) || 50, 1), 100);
    const requestedPage = Math.max(parseInt(searchParams.get("page") || "1", 10) || 1, 1);
    const skipParam = Math.max(parseInt(searchParams.get("skip") || "0", 10) || 0, 0);

    const admin = await requireLiveAdmin();
    const base = {};
    if (admin.ok) {
      const p = searchParams.get("published");
      if (p === "true") base.published = true;
      if (p === "false") base.published = false;
    } else {
      base.published = true;
    }
    const searchWhere = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};
    const where = { ...base, ...searchWhere };
    if (category) where.category = category;

    const countsPromise = usePage
      ? prisma.portfolioProject.groupBy({ by: ["category"], where: { ...base, ...searchWhere }, _count: { _all: true } })
      : null;

    const total = await prisma.portfolioProject.count({ where });
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const page = Math.min(requestedPage, totalPages);
    const skip = usePage ? (page - 1) * limit : skipParam;

    const projects = await prisma.portfolioProject.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    });

    let counts;
    if (countsPromise) {
      const groups = await countsPromise;
      counts = { all: groups.reduce((n, g) => n + g._count._all, 0) };
      for (const g of groups) counts[g.category] = g._count._all;
    }

    return NextResponse.json({
      success: true,
      projects,
      pagination: usePage
        ? { total, limit, skip, page, pageSize: limit, totalPages, hasMore: page < totalPages }
        : { total, limit, skip, hasMore: skip + projects.length < total },
      ...(counts && { counts }),
    }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } });
  } catch (error) {
    logger.error("Error fetching portfolio projects:", error);
    return jsonError("خطا در دریافت پروژه‌ها", 500);
  }
}

// POST: ایجاد پروژه (ادمین + CSRF)
export async function POST(request) {
  const auth = await requireLiveAdmin();
  if (!auth.ok) return jsonError(auth.message || "دسترسی غیرمجاز", auth.status || 401);

  const csrf = await csrfProtection(request);
  if (!csrf.success) return jsonError(csrf.error, csrf.status);

  const parsed = await parseBody(request, portfolioProjectSchema);
  if (parsed.error) return parsed.error;
  const d = parsed.data;

  try {
    const project = await prisma.portfolioProject.create({
      data: {
        ...d,
        year: d.year || String(new Date().getFullYear()),
        client: d.client?.trim() || null,
        duration: d.duration?.trim() || null,
        tech: d.tech.map((t) => t.trim()).filter(Boolean),
      },
    });
    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    logger.error("Error creating portfolio project:", error);
    return jsonError("خطا در ایجاد پروژه", 500);
  }
}

// PUT: ویرایش پروژه (ادمین + CSRF). شناسه در بدنه است.
export async function PUT(request) {
  const auth = await requireLiveAdmin();
  if (!auth.ok) return jsonError(auth.message || "دسترسی غیرمجاز", auth.status || 401);

  const csrf = await csrfProtection(request);
  if (!csrf.success) return jsonError(csrf.error, csrf.status);

  const parsed = await parseBody(request, portfolioUpdateSchema);
  if (parsed.error) return parsed.error;
  const { id, ...updates } = parsed.data;

  try {
    const exists = await prisma.portfolioProject.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return jsonError("پروژه موردنظر پیدا نشد", 404);

    const project = await prisma.portfolioProject.update({ where: { id }, data: updates });
    return NextResponse.json({ success: true, project });
  } catch (error) {
    logger.error("Error updating portfolio project:", error);
    return jsonError("خطا در ویرایش پروژه", 500);
  }
}

// DELETE: حذف پروژه (ادمین + CSRF). شناسه در query string است.
export async function DELETE(request) {
  const auth = await requireLiveAdmin();
  if (!auth.ok) return jsonError(auth.message || "دسترسی غیرمجاز", auth.status || 401);

  const csrf = await csrfProtection(request);
  if (!csrf.success) return jsonError(csrf.error, csrf.status);

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return jsonError("شناسه پروژه الزامی است", 400);

  try {
    const exists = await prisma.portfolioProject.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return jsonError("پروژه موردنظر پیدا نشد", 404);

    await prisma.portfolioProject.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "پروژه با موفقیت حذف شد" });
  } catch (error) {
    logger.error("Error deleting portfolio project:", error);
    return jsonError("خطا در حذف پروژه", 500);
  }
}
