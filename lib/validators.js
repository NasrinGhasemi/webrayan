// تبدیل اعداد فارسی/عربی به انگلیسی
export function toEnglishDigits(str) {
  if (!str) return "";
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  let result = str.toString();

  for (let i = 0; i < 10; i++) {
    result = result
      .replace(new RegExp(persianDigits[i], "g"), i.toString())
      .replace(new RegExp(arabicDigits[i], "g"), i.toString());
  }
  return result;
}

// ✅ Helper برای خطا
function error(message, code = "INVALID", color = "red") {
  return {
    isValid: false,
    error: { message, code, color },
  };
}

// ✅ اعتبارسنجی نام
export function validateName(name) {
  if (!name || typeof name !== "string") {
    return error("نام الزامی است", "REQUIRED_NAME");
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return error("نام باید حداقل ۲ کاراکتر باشد", "NAME_TOO_SHORT");
  }

  if (trimmed.length > 50) {
    return error("نام نباید بیشتر از ۵۰ کاراکتر باشد", "NAME_TOO_LONG");
  }

  const nameRegex = /^[\u0600-\u06FFa-zA-Z\s]+$/;
  if (!nameRegex.test(trimmed)) {
    return error("نام فقط می‌تواند شامل حروف و فاصله باشد", "INVALID_NAME");
  }

  return { isValid: true, value: trimmed };
}

// ✅ اعتبارسنجی ایمیل
export function validateEmail(email) {
  if (!email || typeof email !== "string") {
    return error("ایمیل الزامی است", "REQUIRED_EMAIL");
  }

  const trimmed = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return error("فرمت ایمیل نامعتبر است", "INVALID_EMAIL");
  }

  if (trimmed.length > 100) {
    return error("ایمیل بیش از حد طولانی است", "EMAIL_TOO_LONG");
  }

  return { isValid: true, value: trimmed };
}

// ✅ اعتبارسنجی موبایل
export function validatePhone(phone) {
  if (!phone || typeof phone !== "string") {
    return error("شماره موبایل الزامی است", "REQUIRED_PHONE");
  }

  const normalized = toEnglishDigits(phone).trim().replace(/\s+/g, "");

  // 09xxxxxxxxx | +989xxxxxxxxx | 0098... | 98...
  if (!/^(?:\+98|0098|98|0)?9\d{9}$/.test(normalized)) {
    return error("شماره موبایل نامعتبر است", "INVALID_PHONE");
  }

  const stripped = normalized.replace(/^(\+98|0098|98)/, "");
  const value = stripped.startsWith("0") ? stripped : "0" + stripped;

  return { isValid: true, value }; // خروجی نرمال‌شده: 09xxxxxxxxx
}

// ✅ اعتبارسنجی رمز عبور
export function validatePassword(password) {
  if (!password || typeof password !== "string") {
    return error("رمز عبور الزامی است", "REQUIRED_PASSWORD");
  }

  if (password.length < 8) {
    return error("رمز عبور باید حداقل ۸ کاراکتر باشد", "PASSWORD_TOO_SHORT");
  }

  if (password.length > 100) {
    return error("رمز عبور بیش از حد طولانی است", "PASSWORD_TOO_LONG");
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter || !hasNumber) {
    return error(
      "رمز عبور باید شامل حروف و اعداد باشد",
      "WEAK_PASSWORD",
      "orange",
    );
  }

  return { isValid: true, value: password };
}

export function getPasswordStrength(password) {
  if (!password) {
    return {
      score: 0,
      label: "خیلی ضعیف",
      color: "red",
    };
  }

  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) {
    return { score, label: "ضعیف", color: "red" };
  }

  if (score === 3) {
    return { score, label: "متوسط", color: "orange" };
  }

  return { score, label: "قوی", color: "green" };
}
