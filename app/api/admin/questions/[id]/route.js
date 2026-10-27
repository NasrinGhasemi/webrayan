import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

// آپدیت وضعیت سوال (مثلاً تغییر به answered)
export async function PATCH(request, { params }) {
  try {
    const authCheck = await guardAdmin(request, { csrf: true });
    if (authCheck.response) return authCheck.response;

    const { id } = await params;
    const body = await request.json();
    const { status, adminReply } = body;

    const validStatuses = ["new", "reviewing", "answered", "rejected"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "وضعیت نامعتبر است" },
        { status: 400 }
      );
    }

    const updated = await prisma.faqQuestion.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(typeof adminReply === "string" && { adminReply }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "وضعیت سوال با موفقیت به‌روزرسانی شد",
      data: { ...updated, _id: updated.id },
    });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "سوال مورد نظر یافت نشد" },
        { status: 404 }
      );
    }
    console.error("[PATCH /api/admin/questions/[id]]", error);
    return NextResponse.json(
      { success: false, message: "خطای سرور در به‌روزرسانی سوال" },
      { status: 500 }
    );
  }
}

// حذف سوال
export async function DELETE(request, { params }) {
  try {
    const authCheck = await guardAdmin(request, { csrf: true });
    if (authCheck.response) return authCheck.response;

    const { id } = await params;

    await prisma.faqQuestion.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "سوال با موفقیت حذف شد",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "سوال مورد نظر یافت نشد" },
        { status: 404 }
      );
    }
    console.error("[DELETE /api/admin/questions/[id]]", error);
    return NextResponse.json(
      { success: false, message: "خطای سرور در حذف سوال" },
      { status: 500 }
    );
  }
}
