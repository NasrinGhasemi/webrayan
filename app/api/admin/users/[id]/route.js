import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/admin-guard";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, message: "شناسه کاربر معتبر نیست" },
        { status: 400 }
      );
    }

    const authCheck = await guardAdmin(request, { csrf: false });
    if (authCheck.response) return authCheck.response;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: { ...user, _id: user.id },
    });
  } catch (error) {
    console.error("[GET /api/admin/users/[id]]", error);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت اطلاعات کاربر" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, message: "شناسه کاربر معتبر نیست" },
        { status: 400 }
      );
    }

    const authCheck = await guardAdmin(request, { csrf: true });
    if (authCheck.response) return authCheck.response;

    const currentAdminId = authCheck.user.id;
    const body = await request.json();
    const { name, email, role, isActive } = body;

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "کاربر مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    // قانون فاز ۵: جلوگیری از غیرفعال‌سازی یا سلب نقش ادمین از خود
    if (id === currentAdminId) {
      if (isActive === false) {
        return NextResponse.json(
          { success: false, message: "شما نمی‌توانید حساب کاربری فعال خود را غیرفعال کنید" },
          { status: 400 }
        );
      }
      if (role && role !== "admin") {
        return NextResponse.json(
          { success: false, message: "شما نمی‌توانید نقش مدیریت خود را سلب کنید" },
          { status: 400 }
        );
      }
    }

    // قانون فاز ۵: جلوگیری از قفل شدن پنل (بررسی آخرین ادمین فعال سیستم)
    if (isActive === false || (role && role !== "admin")) {
      const activeAdminsCount = await prisma.user.count({
        where: {
          role: "admin",
          isActive: true,
        },
      });

      if (
        activeAdminsCount <= 1 &&
        targetUser.role === "admin" &&
        targetUser.isActive === true
      ) {
        return NextResponse.json(
          { success: false, message: "خطای امنیتی: سیستم باید حداقل دارای یک ادمین فعال باشد" },
          { status: 400 }
        );
      }
    }

    // آماده‌سازی داده‌های آپدیت
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email.trim().toLowerCase();
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updatedUserRaw = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password: _, ...updatedUser } = updatedUserRaw;

    return NextResponse.json({
      success: true,
      message: "اطلاعات کاربر با موفقیت به‌روزرسانی شد",
      user: { ...updatedUser, _id: updatedUser.id },
    });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "کاربر مورد نظر یافت نشد" },
        { status: 404 }
      );
    }
    console.error("[PUT /api/admin/users/[id]]", error);
    return NextResponse.json(
      { success: false, message: "خطا در به‌روزرسانی اطلاعات کاربر" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, message: "شناسه کاربر معتبر نیست" },
        { status: 400 }
      );
    }

    const authCheck = await guardAdmin(request, { csrf: true });
    if (authCheck.response) return authCheck.response;

    const currentAdminId = authCheck.user.id;

    // قانون فاز ۵: جلوگیری از حذف خود ادمین جاری
    if (id === currentAdminId) {
      return NextResponse.json(
        { success: false, message: "شما مجاز به حذف حساب کاربری خود نیستید" },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // قانون فاز ۵: جلوگیری از حذف آخرین ادمین فعال
    if (targetUser.role === "admin" && targetUser.isActive === true) {
      const activeAdminsCount = await prisma.user.count({
        where: {
          role: "admin",
          isActive: true,
        },
      });

      if (activeAdminsCount <= 1) {
        return NextResponse.json(
          { success: false, message: "حذف آخرین ادمین فعال سیستم مقدور نیست" },
          { status: 400 }
        );
      }
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "حساب کاربری با موفقیت حذف شد",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }
    console.error("[DELETE /api/admin/users/[id]]", error);
    return NextResponse.json(
      { success: false, message: "خطا در حذف کاربر" },
      { status: 500 }
    );
  }
}
