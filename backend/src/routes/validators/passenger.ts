export type PassengerPayload = {
  gender: 'M' | 'F';
  firstName: string;
  lastName: string;
  birthday: string; // YYYY-MM-DD
  nationality: string; // ISO-2
  passportNo: string;
  passportExpiry: string; // YYYY-MM-DD
};

export type PassengerErrors = Partial<Record<keyof PassengerPayload, string>>;

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export function validatePassenger(payload: PassengerPayload): PassengerErrors {
  const errors: PassengerErrors = {};

  const firstName = payload.firstName.trim();
  const lastName = payload.lastName.trim();
  const passport = payload.passportNo.trim();

  // 名字
  if (!firstName) {
    errors.firstName = '請填寫名字（First name）';
  } else if (!/^[A-Z]+$/.test(firstName)) {
    errors.firstName = '請以護照上的英文大寫填寫，不含空格或符號';
  }

  // 姓氏
  if (!lastName) {
    errors.lastName = '請填寫姓氏（Last name）';
  } else if (!/^[A-Z]+$/.test(lastName)) {
    errors.lastName =
      '請以護照上的英文大寫填寫，不含空格或符號（FNU 亦須大寫）';
  }

  // 生日
  if (!payload.birthday) {
    errors.birthday = '請選擇生日';
  } else if (!dateRegex.test(payload.birthday)) {
    errors.birthday = '生日格式需為 YYYY-MM-DD';
  }

  // 國籍
  if (!payload.nationality || payload.nationality.length !== 2) {
    errors.nationality = '請選擇國籍';
  }

  // 護照號碼（依國籍判斷）
  if (!passport) {
    errors.passportNo = '請填寫護照號碼';
  } else {
    if (payload.nationality === 'TW') {
      // 台灣護照：1 英文 + 8 數字
      if (!/^[A-Z][0-9]{8}$/.test(passport)) {
        errors.passportNo =
          '台灣護照格式為 1 碼英文大寫 + 8 碼數字，請勿輸入空格或符號';
      }
    } else {
      // 一般通用：6–9 碼英文大寫或數字
      if (!/^[A-Z0-9]{6,9}$/.test(passport)) {
        errors.passportNo =
          '護照號碼僅能填寫 6–9 碼英文大寫與數字，請勿輸入空格或符號';
      }
    }
  }

  // 護照效期
  if (!payload.passportExpiry) {
    errors.passportExpiry = '請選擇護照到期日';
  } else if (!dateRegex.test(payload.passportExpiry)) {
    errors.passportExpiry = '護照到期日格式需為 YYYY-MM-DD';
  }

  return errors;
}
