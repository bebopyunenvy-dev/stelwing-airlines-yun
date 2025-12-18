// // 🔹2️⃣ /login（登入）

// // 後端的工作：接收 email、password → 查資料庫 → 驗證密碼 → 回傳 JWT token。

// // 前端要做的：
// // 做一個「登入頁面」（例如 member-center/login/page.tsx），
// // 表單填帳號密碼 → 送出 → 拿到 token → 存在 localStorage（或 cookie）。
// "use client";
// import { useState } from "react";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleLogin = async () => {
//     const res = await fetch("http://localhost:3001/api/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();
//     if (res.ok) {
//       localStorage.setItem("token", data.token);
//       setMessage("登入成功！");
//     } else {
//       setMessage(data.message);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded-xl shadow-md w-[400px]">
//         <h1 className="text-2xl font-bold mb-4 text-center">會員登入</h1>
//         <input
//           className="border p-2 w-full mb-3 rounded"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           className="border p-2 w-full mb-3 rounded"
//           type="password"
//           placeholder="密碼"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button
//           onClick={handleLogin}
//           className="bg-blue-600 text-white p-2 rounded w-full"
//         >
//           登入
//         </button>
//         <p className="text-center mt-3 text-gray-700">{message}</p>
//       </div>
//     </div>
//   );
// }
// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault()
//     const res = await fetch("http://localhost:3007/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();
//     if (res.ok) {
//       localStorage.setItem("token", data.token);
//       setMessage("登入成功！");
//       router.push("/member-center/login")
//     } else {
//       setMessage(data.message || "登入失敗");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded-xl shadow-md w-[400px]">
//         <h1 className="text-2xl font-bold mb-4 text-center">會員登入</h1>
//      <form onSubmit={handleLogin}>
//         <input
//           className="border p-2 w-full mb-3 rounded"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           className="border p-2 w-full mb-3 rounded"
//           type="password"
//           placeholder="密碼"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button
//           className="bg-blue-600 text-white p-2 rounded w-full"
//         >
//           登入
//         </button>
//         </form>
//         <p className="text-center mt-3 text-gray-700">{message}</p>
//       </div>
//     </div>
//   );
// }
'use client';

import { useAuth } from '@/app/context/auth-context';
import { useToast } from '@/app/context/toast-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type PropsWithChildren,
} from 'react';

// 💡 Stelwing UI 元件
const Button = ({
  children,
  className = '',
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) => (
  <button
    {...props}
    className={`px-4 py-2 rounded bg-[#1F2E3C] text-white hover:bg-[#DCBB87] hover:text-[#1F2E3C] transition disabled:opacity-60 ${className}`}
  >
    {children}
  </button>
);

const Input = ({
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full border border-[#BA9A60] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#BA9A60] ${className}`}
  />
);

const Card = ({
  children,
  className = '',
}: PropsWithChildren<{ className?: string }>) => (
  <div
    className={`rounded-xl border border-[#BA9A60] bg-white p-6 shadow-md ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({
  children,
  className = '',
}: PropsWithChildren<{ className?: string }>) => (
  <div
    className={`text-center text-2xl font-semibold mb-4 text-[#1F2E3C] ${className}`}
  >
    {children}
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, login: authLogin } = useAuth();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!email.trim() || !password.trim()) {
      setMessage('請輸入信箱與密碼');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:3007/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('login status =', res.status);

      const data = await res.json();
      console.log('login response json =', data);

      if (res.ok && data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('stelwing_token', data.token);
          console.log(
            'stelwing_token after setItem =',
            localStorage.getItem('stelwing_token')
          );
        }

        authLogin(data.token);

        showToast({
          title: '登入成功',
          message: '歡迎回來，祝旅程愉快！',
          type: 'success',
        });

        setTimeout(() => router.push('/member-center'), 1000);
      } else {
        setMessage(data.message || '帳號或密碼錯誤');
      }
    } catch (error) {
      console.error('登入錯誤：', error);
      setMessage('伺服器連線錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      router.push(`/member-center`);
    }
  }, [isLoggedIn]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F6F7] py-10">
      <Card className="w-[420px]">
        <CardHeader>會員登入</CardHeader>
        <form onSubmit={handleLogin} className="space-y-5">
          {/* 訊息區塊（自動判斷樣式） */}
          {message && (
            <p
              className={`text-center text-sm py-2 rounded ${
                message.includes('成功')
                  ? 'text-[#1F2E3C] bg-[#DCBB87]'
                  : 'text-[#B91C1C] bg-[#FEE2E2]'
              }`}
            >
              {message}
            </p>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-[#1F2E3C] font-medium mb-2"
            >
              電子信箱
            </label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[#1F2E3C] font-medium mb-2"
            >
              密碼
            </label>
            <Input
              id="password"
              type="password"
              placeholder="請輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? '登入中…' : '登入'}
          </Button>

          <p className="text-center text-sm text-[#1F2E3C] mt-2">
            還沒有帳號？
            <Link
              href="/member-center/register"
              className="text-[#BA9A60] font-medium hover:underline ml-1"
            >
              立即註冊
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
