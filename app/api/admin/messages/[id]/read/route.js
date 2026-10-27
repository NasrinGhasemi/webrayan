import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/admin-guard";

export async function PATCH(req, { params }) {
  try {
    const authCheck = await guardAdmin(req, { csrf: true });
    if (authCheck.response) return authCheck.response;

    const { id } = await params;
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });

    return NextResponse.json({ success: true, message: "پیام خوانده شد.", data: updated });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ success: false, message: "پیام یافت نشد." }, { status: 404 });
    }
    console.error("[ADMIN_MESSAGE_READ_ERROR]", error);
    return NextResponse.json({ success: false, message: "خطای سرور" }, { status: 500 });
  }
}
