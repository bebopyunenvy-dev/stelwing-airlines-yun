/**
 * STELWING - 表單驗證工具
 * 統一管理表單驗證邏輯
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Email 驗證
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 電話號碼驗證（台灣手機格式）
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^09\d{8}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ''));
};

// 密碼強度驗證（至少 6 個字符）
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// 信用卡號驗證（簡單格式檢查）
export const validateCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s|-/g, '');
  return /^\d{13,19}$/.test(cleaned);
};

// 信用卡到期日期驗證（MM/YY 格式）
export const validateExpiry = (expiry: string): boolean => {
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(expiry)) return false;

  const [month, year] = expiry.split('/');
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  const expiryYear = parseInt(year);
  const expiryMonth = parseInt(month);

  if (expiryYear < currentYear) return false;
  if (expiryYear === currentYear && expiryMonth < currentMonth) return false;

  return true;
};

// CVC 驗證
export const validateCVC = (cvc: string): boolean => {
  return /^\d{3,4}$/.test(cvc);
};

// 登入表單驗證
export const validateLoginForm = (
  email: string,
  password: string
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!email.trim()) {
    errors.email = '請輸入電子郵件';
  } else if (!validateEmail(email)) {
    errors.email = '請輸入有效的電子郵件格式';
  }

  if (!password.trim()) {
    errors.password = '請輸入密碼';
  } else if (!validatePassword(password)) {
    errors.password = '密碼至少需要 6 個字符';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// 註冊表單驗證
export const validateRegisterForm = (
  email: string,
  password: string,
  confirmPassword: string,
  firstName: string,
  lastName: string,
  phone: string
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!firstName.trim()) {
    errors.firstName = '請輸入姓氏';
  }

  if (!lastName.trim()) {
    errors.lastName = '請輸入名字';
  }

  if (!email.trim()) {
    errors.email = '請輸入電子郵件';
  } else if (!validateEmail(email)) {
    errors.email = '請輸入有效的電子郵件格式';
  }

  if (!phone.trim()) {
    errors.phone = '請輸入電話號碼';
  } else if (!validatePhone(phone)) {
    errors.phone = '請輸入有效的台灣手機號碼（09xxxxxxxx）';
  }

  if (!password.trim()) {
    errors.password = '請輸入密碼';
  } else if (!validatePassword(password)) {
    errors.password = '密碼至少需要 6 個字符';
  }

  if (!confirmPassword.trim()) {
    errors.confirmPassword = '請確認密碼';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = '密碼不一致';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// 結帳表單驗證
export const validateCheckoutForm = (
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  cardNumber: string,
  expiry: string,
  cvc: string
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!firstName.trim()) {
    errors.firstName = '請輸入姓氏';
  }

  if (!lastName.trim()) {
    errors.lastName = '請輸入名字';
  }

  if (!phone.trim()) {
    errors.phone = '請輸入電話號碼';
  } else if (!validatePhone(phone)) {
    errors.phone = '請輸入有效的台灣手機號碼';
  }

  if (!email.trim()) {
    errors.email = '請輸入電子郵件';
  } else if (!validateEmail(email)) {
    errors.email = '請輸入有效的電子郵件格式';
  }

  if (!cardNumber.trim()) {
    errors.cardNumber = '請輸入信用卡號';
  } else if (!validateCreditCard(cardNumber)) {
    errors.cardNumber = '請輸入有效的信用卡號';
  }

  if (!expiry.trim()) {
    errors.expiry = '請輸入有效日期';
  } else if (!validateExpiry(expiry)) {
    errors.expiry = '請輸入有效的日期（MM/YY）';
  }

  if (!cvc.trim()) {
    errors.cvc = '請輸入 CVC 碼';
  } else if (!validateCVC(cvc)) {
    errors.cvc = '請輸入 3-4 位數字的 CVC 碼';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
