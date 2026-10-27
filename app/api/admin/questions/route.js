import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where = {};
    if (status && status !== "all") {
      where.status = status;
    }

    const questions = await prisma.faqQuestion.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const formattedQuestions = questions.map((q) => ({
      ...q,
      _id: q.id,
    }));

    return NextResponse.json({
      success: true,
      data: formattedQuestions,
    });
  } catch (error) {
    console.error("[GET /api/admin/questions]", error);
    return NextResponse.json(
      { success: false, message: "خطای سرور در دریافت سوالات" },
      { status: 500 }
    );
  }
}
