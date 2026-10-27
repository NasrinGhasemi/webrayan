import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";
import { contactFormSchema } from "@/lib/schemas";
import { getClientInfo, jsonError, enforceRateLimit, parseBody } from "@/lib/http/request";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// POST: ثبت پیام تماس (عمومی، با محدودیت نرخ)
export async function POST(request) {
  try {
    const { ip, userAgent } = getClientInfo(request);

    const limited = await enforceRateLimit(ip, "contact");
    if (limited) return limited;

    const parsed = await parseBody(request, contactFormSchema);
    if (parsed.error) return parsed.error;
    const d = parsed.data;

    const record = await prisma.contactMessage.create({
      data: {
        name: d.name,
        email: d.email,
        phone: d.phone || null,
        subject: d.subject || "پیام جدید از سایت",
        message: d.message,
        projectType: d.projectType,
        budget: d.budget || null,
        priority: d.priority,
        timeline: d.timeline || null,
        ip,
        userAgent,
        source: "contact_form",
        status: "new",
        isRead: false,
      },
      select: { id: true },
    });

    logger.info("Contact message created", { id: record.id });

    // فقط پیام موفقیت؛ رکورد، IP و User-Agent به کلاینت برگردانده نمی‌شود
    return NextResponse.json(
      { success: true, message: "پیام شما با موفقیت ارسال شد." },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Error creating contact message:", error);
    return jsonError("خطا در پردازش و ارسال پیام.", 500);
  }
}
