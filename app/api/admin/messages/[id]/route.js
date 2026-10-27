import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/admin-guard";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, message: "شناسه پیام معتبر نیست" },
        { status: 400 }
      );
    }

    const authCheck = await guardAdmin(request, { csrf: false });
    if (authCheck.response) return authCheck.response;
    const message = await prisma.contactMessage.findUnique({
      where: { id },
      include: { replies: true },
    });

    if (!message) {
      return NextResponse.json(
        { success: false, message: "پیام یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: {
        ...message,
        _id: message.id,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/messages/[id]]", error);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت پیام" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, message: "شناسه پیام معتبر نیست" },
        { status: 400 }
      );
    }

    const authCheck = await guardAdmin(request, { csrf: true });
    if (authCheck.response) return authCheck.response;

    const body = await request.json();
    const { isRead } = body;

    try {
      const updatedMessage = await prisma.contactMessage.update({
        where: { id },
        data: { isRead: Boolean(isRead) },
        include: { replies: true },
      });

      return NextResponse.json({
        success: true,
        message: "وضعیت پیام به‌روزرسانی شد",
        data: {
          ...updatedMessage,
          _id: updatedMessage.id,
        },
      });
    } catch (prismaError) {
      // اگر رکورد پیدا نشود Prisma خطای P2025 پرتاب می‌کند
      if (prismaError.code === "P2025") {
        return NextResponse.json(
          { success: false, message: "پیام یافت نشد" },
          { status: 404 }
        );
      }
      throw prismaError;
    }
  } catch (error) {
    console.error("[PUT /api/admin/messages/[id]]", error);
    return NextResponse.json(
      { success: false, message: "خطا در بروزرسانی پیام" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, message: "شناسه پیام معتبر نیست" },
        { status: 400 }
      );
    }

    const authCheck = await guardAdmin(request, { csrf: true });
    if (authCheck.response) return authCheck.response;

    try {
      await prisma.contactMessage.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: "پیام با موفقیت حذف شد",
      });
    } catch (prismaError) {
      if (prismaError.code === "P2025") {
        return NextResponse.json(
          { success: false, message: "پیام یافت نشد" },
          { status: 404 }
        );
      }
      throw prismaError;
    }
  } catch (error) {
    console.error("[DELETE /api/admin/messages/[id]]", error);
    return NextResponse.json(
      { success: false, message: "خطا در حذف پیام" },
      { status: 500 }
    );
  }
}
