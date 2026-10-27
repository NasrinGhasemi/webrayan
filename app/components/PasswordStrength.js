'use client';

import { useMemo } from 'react';

/**
 * کامپوننت نمایش قدرت رمز عبور
 * @param {Object} props - Props component
 * @param {string} props.password - رمز عبور برای بررسی قدرت
 * @param {boolean} props.show - نمایش یا عدم نمایش نشانگر
 */
export default function PasswordStrength({ password, show }) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    // محاسبه امتیاز
    if (checks.length) score += 20;
    if (checks.lowercase) score += 20;
    if (checks.uppercase) score += 20;
    if (checks.number) score += 20;
    if (checks.special) score += 20;

    // تعیین برچسب و رنگ
    let label, color;
    if (score <= 40) {
      label = 'ضعیف';
      color = 'bg-red-500';
    } else if (score <= 60) {
      label = 'متوسط';
      color = 'bg-orange-500';
    } else if (score <= 80) {
      label = 'خوب';
      color = 'bg-yellow-500';
    } else {
      label = 'عالی';
      color = 'bg-green-500';
    }

    return { score, label, color, checks };
  }, [password]);

  if (!show || !password) return null;

  return (
    <div className="space-y-2 mt-2">
      {/* نوار پیشرفت */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${strength.color} transition-all duration-300 ease-out`}
            style={{ width: `${strength.score}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600 min-w-[40px]">
          {strength.label}
        </span>
      </div>

      {/* راهنمای بهبود رمز عبور */}
      {strength.score < 100 && (
        <div className="space-y-1">
          <p className="text-xs text-gray-600 font-medium">
            برای رمز عبور قوی‌تر:
          </p>
          <ul className="space-y-1 text-xs text-gray-500">
            {!strength.checks.length && (
              <li className="flex items-center gap-1">
                <span className="text-red-500">✗</span>
                حداقل 8 کاراکتر
              </li>
            )}
            {!strength.checks.lowercase && (
              <li className="flex items-center gap-1">
                <span className="text-red-500">✗</span>
                حروف کوچک (a-z)
              </li>
            )}
            {!strength.checks.uppercase && (
              <li className="flex items-center gap-1">
                <span className="text-red-500">✗</span>
                حروف بزرگ (A-Z)
              </li>
            )}
            {!strength.checks.number && (
              <li className="flex items-center gap-1">
                <span className="text-red-500">✗</span>
                اعداد (0-9)
              </li>
            )}
            {!strength.checks.special && (
              <li className="flex items-center gap-1">
                <span className="text-red-500">✗</span>
                کاراکترهای خاص (!@#$...)
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
