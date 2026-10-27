import zxcvbn from 'zxcvbn';

export function validatePassword(password) {
  if (typeof password !== 'string') return { valid: false, errors: ['رمز عبور نامعتبر است'], strength: 0 };

  const errors = [];

  if (password.length < 8) errors.push('رمز عبور باید حداقل 8 کاراکتر باشد');
  if (password.length > 128) errors.push('رمز عبور نباید بیش از 128 کاراکتر باشد');
  if (!/[a-z]/.test(password)) errors.push('رمز عبور باید شامل حروف کوچک باشد');
  if (!/[A-Z]/.test(password)) errors.push('رمز عبور باید شامل حروف بزرگ باشد');
  if (!/[0-9]/.test(password)) errors.push('رمز عبور باید شامل اعداد باشد');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('رمز عبور باید شامل کاراکترهای خاص باشد');

  const strength = zxcvbn(password);
  if (strength.score < 3) errors.push('رمز عبور بسیار ضعیف است');

  const common = ['password', '12345678', 'qwerty', 'admin', 'letmein'];
  if (common.includes(password.toLowerCase())) errors.push('این رمز عبور بسیار رایج است');

  return { valid: errors.length === 0, errors, strength: strength.score };
}
