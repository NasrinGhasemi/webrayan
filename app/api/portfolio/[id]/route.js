import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireLiveAdmin } from "@/lib/auth-utils";
import { csrfProtection } from "@/lib/csrf";
import { portfolioProjectSchema } from "@/lib/schemas";
import { jsonError, parseBody } from "@/lib/http/request";
import logger from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: یک پروژه (ادمین)
export async function GET(request, { params }) {
  const auth = await requireLiveAdmin();
  if (!auth.ok) return jsonError(auth.message || "دسترسی غیرمجاز", auth.status || 401);

  const { id } = await params;
  try {
    const project = await prisma.portfolioProject.findUnique({ where: { id } });
    if (!project) return jsonError("پروژه موردنظر پیدا نشد", 404);
    return NextResponse.json({ success: true, project });
  } catch (error) {
    logger.error("Error fetching portfolio project:", error);
    return jsonError("خطا در دریافت پروژه", 500);
  }
}

// PUT: ویرایش کامل (ادمین + CSRF)
export async function PUT(request, { params }) {
  const auth = await requireLiveAdmin();
  if (!auth.ok) return jsonError(auth.message || "دسترسی غیرمجاز", auth.status || 401);

  const csrf = await csrfProtection(request);
  if (!csrf.success) return jsonError(csrf.error, csrf.status);

  const { id } = await params;
  const parsed = await parseBody(request, portfolioProjectSchema);
  if (parsed.error) return parsed.error;
  const d = parsed.data;

  try {
    const exists = await prisma.portfolioProject.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return jsonError("پروژه موردنظر پیدا نشد", 404);

    const project = await prisma.portfolioProject.update({
      where: { id },
      data: {
        ...d,
        year: d.year || String(new Date().getFullYear()),
        client: d.client?.trim() || null,
        duration: d.duration?.trim() || null,
        tech: d.tech.map((t) => t.trim()).filter(Boolean),
      },
    });
    return NextResponse.json({ success: true, project });
  } catch (error) {
    logger.error("Error updating portfolio project:", error);
    return jsonError("خطا در ویرایش پروژه", 500);
  }
}

// DELETE: حذف (ادمین + CSRF)
export async function DELETE(request, { params }) {
  const auth = await requireLiveAdmin();
  if (!auth.ok) return jsonError(auth.message || "دسترسی غیرمجاز", auth.status || 401);

  const csrf = await csrfProtection(request);
  if (!csrf.success) return jsonError(csrf.error, csrf.status);

  const { id } = await params;
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
