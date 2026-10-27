import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET عمومی: فقط سوالات پاسخ‌داده‌شده
export async function GET() {
  try {
    const rows = await prisma.faqQuestion.findMany({
      where: { status: "answered", NOT: { adminReply: "" } },
      orderBy: { createdAt: "asc" },
      select: { id: true, question: true, adminReply: true },
    });
    const faqs = rows.map((r) => ({ id: r.id, question: r.question, answer: r.adminReply }));
    return NextResponse.json(
      { success: true, faqs },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (error) {
    logger.error("Error fetching public FAQ:", error);
    return NextResponse.json({ success: false, faqs: [] }, { status: 500 });
  }
}
