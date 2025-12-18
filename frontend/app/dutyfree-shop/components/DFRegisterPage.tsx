import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { validateRegisterForm } from '../utils/validation';
import { toast } from 'sonner';

interface DFRegisterPageProps {
  onRegisterSuccess: () => void;
  onBackToLogin?: () => void;
}

export function DFRegisterPage({
  onRegisterSuccess,
  onBackToLogin,
}: DFRegisterPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // 驗證表單
    const validation = validateRegisterForm(
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error('請檢查表單填寫');
      return;
    }

    if (!agreeTerms) {
      toast.error('請同意隱私權政策和使用條款');
      return;
    }

    // 驗證通過
    toast.success('註冊成功！');
    onRegisterSuccess();
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
            加入會員
          </h1>
          <p className="text-gray-600 mb-8">創建您的 STELWING 帳戶</p>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <Label htmlFor="registerEmail">電子郵件</Label>
              <Input
                id="registerEmail"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({ ...errors, email: '' });
                  }
                }}
                className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">電話號碼</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="09xxxxxxxx"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) {
                    setErrors({ ...errors, phone: '' });
                  }
                }}
                className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
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
              <Label htmlFor="registerPassword">密碼</Label>
              <Input
                id="registerPassword"
                type="password"
                placeholder="至少 6 個字元"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: '' });
                  }
                }}
                className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">確認密碼</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="再次輸入密碼"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) {
                    setErrors({ ...errors, confirmPassword: '' });
                  }
                }}
                className={`mt-1 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="registerTerms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) =>
                    setAgreeTerms(checked as boolean)
                  }
                />
                <label
                  htmlFor="registerTerms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  我已閱讀並同意貴商店的隱私權政策和使用條款和條件，標記相關資訊。
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)]/90 text-white h-12"
              disabled={!agreeTerms}
            >
              註冊
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                已經有帳戶了？{' '}
                <Button
                  type="button"
                  variant="link"
                  onClick={onBackToLogin}
                  className="p-0 h-auto text-[var(--df-accent-gold)]"
                >
                  返回登入
                </Button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative bg-gradient-to-br from-blue-100 to-blue-50">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1609765685592-703a97c877ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwbGFuZSUyMHdpbmRvdyUyMHRyYXZlbHxlbnwxfHx8fDE3NjEzNzcwMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Travel"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
