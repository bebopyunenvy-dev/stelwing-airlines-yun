import { useState } from 'react';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface DFLoginPageProps {
  onLoginSuccess: () => void;
  onLoginFailed?: () => void;
  onRegisterClick?: () => void;
}

export function DFLoginPage({
  onLoginSuccess,
  onLoginFailed,
  onRegisterClick,
}: DFLoginPageProps) {
  const [subscriptionCode, setSubscriptionCode] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 清除之前的錯誤
    setErrors({});
    const newErrors: Record<string, string> = {};

    // 驗證表單
    if (!subscriptionCode.trim()) {
      newErrors.subscriptionCode = '請輸入訂位代號';
    }

    if (!lastName.trim()) {
      newErrors.lastName = '請輸入姓氏';
    }

    if (!firstName.trim()) {
      newErrors.firstName = '請輸入名字';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = '請同意隱私權政策和使用條款';
    }

    // 如果有錯誤，顯示並返回
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('請填寫所有必填欄位');
      return;
    }

    // 驗證通過，執行登入
    toast.success('登入成功！');
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <h1
            style={{
              fontSize: '1.5rem',
              lineHeight: '2rem',
              fontWeight: '600',
            }}
            className="mb-2"
          >
            免稅商品請填寫取貨資訊
          </h1>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div>
              <Label htmlFor="subscriptionCode">訂位代號</Label>
              <Input
                id="subscriptionCode"
                type="text"
                placeholder="Enter order code"
                value={subscriptionCode}
                onChange={(e) => {
                  setSubscriptionCode(e.target.value);
                  if (errors.subscriptionCode) {
                    setErrors({ ...errors, subscriptionCode: '' });
                  }
                }}
                className={`mt-1 ${errors.subscriptionCode ? 'border-red-500' : ''}`}
              />
              {errors.subscriptionCode && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.subscriptionCode}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">姓</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName) {
                    setErrors({ ...errors, lastName: '' });
                  }
                }}
                className={`mt-1 ${errors.lastName ? 'border-red-500' : ''}`}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="firstName">名</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errors.firstName) {
                    setErrors({ ...errors, firstName: '' });
                  }
                }}
                className={`mt-1 ${errors.firstName ? 'border-red-500' : ''}`}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => {
                    setAgreeTerms(checked as boolean);
                    if (errors.agreeTerms) {
                      setErrors({ ...errors, agreeTerms: '' });
                    }
                  }}
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  我已閱讀並同意貴商店的隱私權政策和使用條款和條件，標記相關資訊。
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="text-sm text-red-500 mt-1">{errors.agreeTerms}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)]/90 text-white h-12"
            >
              確認
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">or</p>
              <Button
                type="button"
                variant="link"
                onClick={onRegisterClick}
                className="mt-2 text-[var(--df-accent-gold)]"
              >
                加入會員
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative bg-gradient-to-br from-blue-100 to-blue-50">
        <ImageWithFallback
          src="/images/dutyfree/login.jpg"
          alt="Travel"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
