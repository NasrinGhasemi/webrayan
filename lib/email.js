
import nodemailer from 'nodemailer';

//  ایجاد transporter برای ارسال ایمیل
  // پشتیبانی از Gmail، Mailgun، SendGrid و سایر سرویس‌ها

const createTransporter = () => {
  // بررسی وجود تنظیمات SMTP
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️ SMTP credentials not configured. Email sending will fail.');
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // تنظیمات اضافی برای Gmail
    ...(process.env.SMTP_HOST === 'smtp.gmail.com' && {
      tls: {
        rejectUnauthorized: false
      }
    })
  });
};

// ایجاد یک instance از transporter
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

// تنظیمات ایمیل

const getFromAddress = () => {
  const name = process.env.SMTP_FROM_NAME || 'وب‌رایان';
  const email = process.env.SMTP_FROM || process.env.SMTP_USER;
  return `"${name}" <${email}>`;
};

// قالب‌های ایمیل
// قالب پایه HTML ایمیل

const getBaseTemplate = (content) => `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Tahoma, Arial, sans-serif;
      background-color: #f4f7fa;
      margin: 0;
      padding: 20px;
      direction: rtl;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 30px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .content p {
      color: #333;
      font-size: 16px;
      line-height: 1.8;
      margin-bottom: 15px;
    }

    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white !important;
      padding: 15px 40px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      font-size: 16px;
      margin: 20px 0;
      transition: transform 0.2s;
    }
    .button:hover {
      transform: scale(1.05);
    }
    .info-box {
      background: #fff8e1;
      border-right: 4px solid #ffc107;
      padding: 15px 20px;
      margin: 20px 0;
      text-align: right;
      border-radius: 8px;
    }
    .info-box p {
      color: #856404;
      font-size: 14px;
      margin: 5px 0;
    }
    .footer {
      background: #f8f9fa;
      padding: 25px;
      text-align: center;
    }
    .footer p {
      color: #999;
      font-size: 12px;
      line-height: 1.6;
    }
    .divider {
      height: 1px;
      background: #e9ecef;
      margin: 25px 0;
    }
    .warning {
      color: #dc3545;
      font-size: 14px;
      margin-top: 20px;
    }
    @media (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">
      <div class="divider"></div>
      <p>© 2025 وب‌رایان - تمامی حقوق محفوظ است</p>
      <p>این ایمیل به صورت خودکار ارسال شده است، لطفاً به آن پاسخ ندهید.</p>
    </div>
  </div>
</body>
</html>
`;

// توابع ارسال ایمیل

// 1)  ارسال ایمیل بازیابی رمز عبور
export async function sendPasswordResetEmail(email, name, resetUrl) {
  try {
    const transporter = getTransporter();

    const content = `
      <div class="header" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
        <h1>🔑 بازیابی رمز عبور</h1>
      </div>
      <div class="content">
        <p>سلام <strong>${name}</strong> عزیز،</p>
        <p>درخواست بازیابی رمز عبور برای حساب شما دریافت شد.</p>
        <p>برای تنظیم رمز عبور جدید، روی دکمه زیر کلیک کنید:</p>

        <center>
          <a href="${resetUrl}" class="button">بازیابی رمز عبور</a>
        </center>

        <div class="info-box">
          <p>⏰ این لینک تا <strong>1 ساعت</strong> معتبر است.</p>
          <p>⚠️ اگر شما این درخواست را نداده‌اید، این ایمیل را نادیده بگیرید.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: getFromAddress(),
      to: email,
      subject: '🔑 بازیابی رمز عبور وب‌رایان',
      html: getBaseTemplate(content)
    });

    console.log('✅ ایمیل بازیابی رمز عبور ارسال شد:', info.messageId);

    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('❌ خطا در ارسال ایمیل بازیابی رمز عبور:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

//  2) ارسال ایمیل تأیید حساب کاربری
export async function sendVerificationEmail(email, name, verifyUrl) {
  try {
    const transporter = getTransporter();

    const content = `
      <div class="header" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
        <h1>✅ تأیید حساب کاربری</h1>
      </div>
      <div class="content">
        <p>سلام <strong>${name}</strong> عزیز،</p>
        <p>از ثبت‌نام شما در <strong>وب‌رایان</strong> خوشحالیم! 🎉</p>
        <p>برای تکمیل ثبت‌نام و فعال‌سازی حساب خود، روی دکمه زیر کلیک کنید:</p>

        <center>
          <a href="${verifyUrl}" class="button">تأیید ایمیل</a>
        </center>

        <div class="info-box">
          <p>⏰ این لینک تا <strong>24 ساعت</strong> معتبر است.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: getFromAddress(),
      to: email,
      subject: '✅ تأیید حساب کاربری وب‌رایان',
      html: getBaseTemplate(content)
    });

    console.log('✅ ایمیل تأیید حساب ارسال شد:', info.messageId);

    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('❌ خطا در ارسال ایمیل تأیید حساب:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

//  3) ارسال پاسخ ایمیل 
export async function sendContactReplyEmail({
  message,
  replyText,
}) {
  if (!message?.email) {
    throw new Error("Contact message email is missing");
  }

  if (!replyText?.trim()) {
    throw new Error("Reply text is empty");
  }

  const transporter = getTransporter();

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const safeName = escapeHtml(message.name);
  const safeSubject = escapeHtml(message.subject);
  const safeOriginalMessage = escapeHtml(message.message);
  const safeReply = escapeHtml(replyText).replace(/\r?\n/g, "<br />");

  await transporter.sendMail({
    from: getFromAddress(),
    to: message.email,
    subject: `پاسخ به پیام شما: ${message.subject}`,
    html: getBaseTemplate(`
      <h2>سلام ${safeName}</h2>

      <p>
        پیام شما با موضوع
        <strong>${safeSubject}</strong>
        بررسی شد.
      </p>

      <p><strong>متن پیام شما:</strong></p>

      <blockquote>
        ${safeOriginalMessage}
      </blockquote>

      <p><strong>پاسخ وب‌رایان:</strong></p>

      <p>${safeReply}</p>

      <hr />

      <p>
        با احترام<br />
        تیم وب‌رایان
      </p>
    `),
  });
}

