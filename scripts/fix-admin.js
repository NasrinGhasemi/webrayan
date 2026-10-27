const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = "admin@webrayandev.ir"; // همون ایمیلی که باهاش لاگین می‌کنی

  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      role: "admin",
      isActive: true // اگر این فیلد در اسکیما هست
    },
  });

  console.log("✅ کاربر با موفقیت به ادمین ارتقا یافت:", updatedUser);
}

main().catch(console.error).finally(() => prisma.$disconnect());
