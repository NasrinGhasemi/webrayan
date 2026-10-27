import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/admin-guard";

export async function POST(req, { params }) {
  try {
    const authCheck = await guardAdmin(req, { csrf: true });
    if (authCheck.response) return authCheck.response;

    const { id } = await params;
    const body = await req.json();
    const replyText = (body?.text || body?.replyText)?.trim();

    if (!replyText) {
      return NextResponse.json({ success: false, message: "متن پاسخ الزامی است." }, { status: 400 });
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: {
        isReplied: true,
        status: "replied",
        repliedAt: new Date(),
        replyText,
        isRead: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "پاسخ با موفقیت ثبت شد.",
      data: updated,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ success: false, message: "پیام مورد نظر یافت نشد." }, { status: 404 });
    }
    console.error("[ADMIN_MESSAGE_REPLY_ERROR]", error);
    return NextResponse.json({ success: false, message: "خطای سرور" }, { status: 500 });
  }
}
