import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdmin() {
  const newEmail = "admin@webrayandev.ir";
  const newPassword = "webR@2026";
  const adminName = "مدیر سیستم";

  console.log("⏳ در حال هش کردن رمز عبور و اتصال به دیتابیس...");
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: newEmail },
    update: {
      password: hashedPassword,
      role: "admin",
      isActive: true,
      failedLoginAttempts: 0,
      lockUntil: null,
    },
    create: {
      name: adminName,
      email: newEmail,
      password: hashedPassword,
      role: "admin",
      isActive: true,
      provider: "credentials",
    },
  });

  console.log("=========================================");
  console.log("✅ ادمین با موفقیت ذخیره و فعال شد!");
  console.log(`📧 ایمیل (نام کاربری): ${admin.email}`);
  console.log(`🔑 رمز عبور جدید: ${newPassword}`);
  console.log("=========================================");
}

resetAdmin()
  .catch((err) => {
    console.error("❌ خطا در تغییر رمز عبور:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
