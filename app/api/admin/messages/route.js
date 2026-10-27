import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

const ALLOWED_PAGE_SIZES = [10, 20, 50];

const STATUS_WHERE = {
  unread: { isRead: false },
  read: { isRead: true, isReplied: false },
  replied: { isReplied: true },
  unreplied: { isReplied: false },
};

export async function GET(req) {
  try {
    const authCheck = await guardAdmin(req, { csrf: false });
    if (authCheck.response) return authCheck.response;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const search = (searchParams.get("search") || "").trim().slice(0, 100);
    const requestedSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const pageSize = ALLOWED_PAGE_SIZES.includes(requestedSize) ? requestedSize : 10;
    const requestedPage = Math.max(parseInt(searchParams.get("page") || "1", 10) || 1, 1);

    const searchWhere = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { subject: { contains: search, mode: "insensitive" } },
            { message: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const where = { ...searchWhere, ...(STATUS_WHERE[status] || {}) };

    const select = {
      id: true,
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
      status: true,
      isRead: true,
      isReplied: true,
      readAt: true,
      repliedAt: true,
      createdAt: true,
    };

    // شمارش تب‌ها (بدون در نظر گرفتن جستجو) برای نمایش تعداد روی هر تب
    const [all, unread, read, replied, unreplied, total] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: STATUS_WHERE.unread }),
      prisma.contactMessage.count({ where: STATUS_WHERE.read }),
      prisma.contactMessage.count({ where: STATUS_WHERE.replied }),
      prisma.contactMessage.count({ where: STATUS_WHERE.unreplied }),
      prisma.contactMessage.count({ where }),
    ]);

    const totalPages = Math.max(Math.ceil(total / pageSize), 1);
    const page = Math.min(requestedPage, totalPages);

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({
      success: true,
      data: messages,
      messages,
      pagination: { page, pageSize, total, totalPages },
      counts: { all, unread, read, replied, unreplied },
    });
  } catch (error) {
    console.error("Error fetching admin messages:", error);
    return NextResponse.json(
      { success: false, message: "خطای سرور در دریافت پیام‌ها" },
      { status: 500 }
    );
  }
}
