import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { guardAdmin } from '@/lib/admin-guard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const authCheck = await guardAdmin(request);
    if (authCheck.response) return authCheck.response;

    const [
      totalUsers,
      portfolioCount,
      publishedPortfolio,
      totalMessages,
      unreadMessages,
      readMessages,
      unrepliedMessages,
      repliedMessages,
      totalQuestions,
      unreadQuestions,
      answeredQuestions,
      failedLogins24h,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.portfolioProject.count(),
      prisma.portfolioProject.count({ where: { published: true } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.contactMessage.count({ where: { isRead: true, isReplied: false } }),
      prisma.contactMessage.count({ where: { isReplied: false } }),
      prisma.contactMessage.count({ where: { isReplied: true } }),
      prisma.faqQuestion.count(),
      prisma.faqQuestion.count({ where: { status: "new" } }),
      prisma.faqQuestion.count({ where: { status: "answered" } }),
      prisma.authLog.count({
        where: { type: "FAILED_LOGIN", timestamp: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        usersCount: totalUsers,
        messagesCount: totalMessages,
        unreadMessages: unreadMessages,
        portfolioCount: portfolioCount,
        publishedPortfolio,
        repliedMessages,
        unrepliedMessages,
        questionsCount: totalQuestions,
        unreadQuestions,
        answeredQuestions,
        failedLogins24h,
      },
       messages: {
      total: totalMessages,
      unread: unreadMessages,
      read: readMessages,
      unreplied: unrepliedMessages,
      replied: repliedMessages,
    },
    });
  } catch (error) {
    console.error("[GET /api/admin/stats]", error);
    return NextResponse.json(
      { success: false, message: "خطا در محاسبات آمار پنل" },
      { status: 500 }
    );
  }
}

