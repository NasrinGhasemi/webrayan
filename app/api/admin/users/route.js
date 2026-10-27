import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/admin-guard";
import bcrypt from "bcryptjs";

export async function GET(request) {
  try {
    const authCheck = await guardAdmin(request, { csrf: false });
    if (authCheck.response) return authCheck.response;
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
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
        // password عامداً انتخاب نمی‌شود تا امن بماند
      },
    });

    return NextResponse.json({
      success: true,
      users: users.map((u) => ({
        ...u,
        _id: u.id, // سازگاری صددرصدی با فرانت‌اند که به _id نیاز دارد
      })),
    });
  } catch (error) {
    console.error("[GET /api/admin/users]", error);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت لیست کاربران" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authCheck = await guardAdmin(request, { csrf: true });
    if (authCheck.response) return authCheck.response;

    const body = await request.json();
    const { name, email, password, role, isActive } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "فیلدهای اجباری را تکمیل کنید" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // بررسی تکراری بودن ایمیل با استفاده از Prisma
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "کاربر با این ایمیل از قبل وجود دارد" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: role || "user",
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    // حذف فیلد پسورد از پاسخ خروجی
    const { password: _, ...userResponse } = newUser;

    return NextResponse.json(
      {
        success: true,
        message: "کاربر جدید با موفقیت ایجاد شد",
        user: {
          ...userResponse,
          _id: userResponse.id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/admin/users]", error);
    return NextResponse.json(
      { success: false, message: "خطا در ایجاد کاربر جدید" },
      { status: 500 }
    );
  }
}
