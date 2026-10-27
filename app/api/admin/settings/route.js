import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/admin-guard";
import { z } from "zod";


const str = (max) => z.string().trim().max(max).optional().default("");
const settingsSchema = z
  .object({
    siteName: str(100),
    siteDescription: str(500),
    email: str(150),
    phone: str(30),
    address: str(300),
    socialLinks: z
      .object({
        telegram: str(200),
        instagram: str(200),
        linkedin: str(200),
        github: str(200),
      })
      .partial()
      .optional()
      .default({}),
  })
  .strip();

export const dynamic = "force-dynamic";

// GET: دریافت تنظیمات سامانه
export async function GET(req) {
  try {
    const authCheck = await guardAdmin(req, { csrf: false });
    if (authCheck.response) return authCheck.response;
    let settingRecord = await prisma.setting.findUnique({
      where: { key: "general_settings" },
    });

    if (!settingRecord) {
      return NextResponse.json({
        success: true,
        data: {
          siteName: "وب‌رایان",
          siteDescription: "سامانه جامع مدیریت و خدمات وب",
          email: "info@webrayan.ir",
          phone: "021-12345678",
          address: "تهران، ایران",
          socialLinks: {
            telegram: "",
            instagram: "",
            linkedin: "",
            github: "",
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: settingRecord.value,
    });
  } catch (error) {
    console.error("GET /api/admin/settings error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در بارگذاری اطلاعات از سرور." },
      { status: 500 }
    );
  }
}

// PUT: ذخیره یا به‌روزرسانی تنظیمات سامانه
export async function PUT(req) {
  try {
    const authCheck = await guardAdmin(req, { csrf: true });
    if (authCheck.response) return authCheck.response;

    const parsed = settingsSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "داده‌های تنظیمات نامعتبر است." },
        { status: 400 }
      );
    }
    const body = parsed.data;

    const updatedSetting = await prisma.setting.upsert({
      where: { key: "general_settings" },
      update: { value: body },
      create: {
        key: "general_settings",
        value: body,
      },
    });

    return NextResponse.json({
      success: true,
      message: "تنظیمات با موفقیت ذخیره شد.",
      data: updatedSetting.value,
    });
  } catch (error) {
    console.error("PUT /api/admin/settings error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ذخیره تنظیمات." },
      { status: 500 }
    );
  }
}
