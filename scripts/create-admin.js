   import { PrismaClient } from '@prisma/client';
   import bcrypt from 'bcryptjs';

   const prisma = new PrismaClient();

   async function main() {
     const email = process.env.ADMIN_EMAIL || 'admin@webrayandev.ir';
     const rawPassword = 'webR@2026'; // رمز دلخواه خودت
     const hashedPassword = await bcrypt.hash(rawPassword, 12);

     const admin = await prisma.user.upsert({
       where: { email },
       update: {
         password: hashedPassword,
         role: 'admin',
         isActive: true,
       },
       create: {
         name: 'Admin WebRayan',
         email,
         password: hashedPassword,
         role: 'admin',
         isActive: true,
         provider: 'credentials',
       },
     });

     console.log(`✅ ادمین با موفقیت ایجاد/به‌روزرسانی شد: ${admin.email}`);
   }

   main()
     .catch((e) => {
       console.error('❌ خطا در ساخت ادمین:', e);
       process.exit(1);
     })
     .finally(async () => {
       await prisma.$disconnect();
     });
