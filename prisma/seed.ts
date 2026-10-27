// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@webrayan.com';
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'SecurePass2026!', 10);

  // بررسی وجود ادمین برای جلوگیری از بازنویسی داده‌های تستی دیگر
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'مدیر وب‌رایان',
        password: hashedPassword,
        role: 'ADMIN', // یا فیلدی که برای سطح دسترسی داری
      },
    });
    console.log('✅ ادمین پیش‌فرض با موفقیت ساخته شد.');
  } else {
    console.log('ℹ️ کاربر ادمین از قبل وجود دارد.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
