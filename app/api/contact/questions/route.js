import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";
import { faqQuestionSchema } from "@/lib/schemas";
import { getClientInfo, jsonError, enforceRateLimit, parseBody } from "@/lib/http/request";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// POST: ثبت سوال عمومی (با محدودیت نرخ)
export async function POST(request) {
  try {
    const { ip, userAgent } = getClientInfo(request);

    const limited = await enforceRateLimit(ip, "faq-question");
    if (limited) return limited;

    const parsed = await parseBody(request, faqQuestionSchema);
    if (parsed.error) return parsed.error;
    const d = parsed.data;

    await prisma.faqQuestion.create({
      data: {
        name: d.name,
        email: d.email,
        question: d.question,
        status: "new",
        adminReply: "",
        ip,
        userAgent,
      },
    });

    return NextResponse.json(
      { success: true, message: "سوال شما با موفقیت ثبت شد و پس از بررسی نمایش داده خواهد شد." },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Error creating FAQ question:", error);
    return jsonError("خطا در ثبت سوال. لطفاً دوباره تلاش کنید.", 500);
  }
}
