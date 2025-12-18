"use client";

import { createContext, useContext, useEffect, useState } from "react";
// 🔼【保留】每次路由變化重新檢查 token
import { usePathname } from "next/navigation";

// ========================================
// ✅ Auth Context：集中管理登入狀態
// ========================================
interface AuthContextType {
  isLoggedIn: boolean;
  avatar: string;
  member: any;
  login: (token: string) => void;
  logout: () => void;
  refresh: () => void; // 重新抓後端資料
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatar, setAvatar] = useState("/avatars/default.png");
  const [member, setMember] = useState<any>(null);

  // ✅【保留】這行沒有刪掉：用來監聽路由變化
  const pathname = usePathname();

  // ========================================
  // ⭐ 主要登入狀態同步 function
  // ========================================
  const loadMember = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setMember(null);
      setAvatar("/avatars/default.png");
      return;
    }

    try {
      const res = await fetch("http://localhost:3007/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!data.ok) {
        setIsLoggedIn(false);
        setMember(null);
        setAvatar("/avatars/default.png");
      } else {
        setIsLoggedIn(true);
        setMember(data.member);

        // =====================================================
        // ❌ 舊版寫法（保留備份，不再使用）
        //    後端沒有 data.member.avatar 這個欄位
        // setAvatar(data.member?.avatar?.imagePath || "/avatars/default.png");
        //
        // ✅ 新版寫法：
        //    後端 /verify 回傳的是 avatarOption：
        //    member.avatarOption.imagePath
        // =====================================================
        setAvatar(
          data.member?.avatarOption?.imagePath || "/avatars/default.png"
        );
      }
    } catch (err) {
      console.error("Auth verify error:", err);
      setIsLoggedIn(false);
      setMember(null);
      setAvatar("/avatars/default.png");
    }
  };

  // ========================================
  // ⭐ 提供給 Login 頁面呼叫
  // ========================================
  const login = (token: string) => {
    localStorage.setItem("token", token); // ← 儲存 token

    setIsLoggedIn(true);
    // ✅ 登入後立刻同步會員資料（更新 Header 頭像 & 狀態）
    loadMember();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMember(null);
    setAvatar("/avatars/default.png");
  };

  const refresh = () => loadMember();

  // ❌【舊版備註】原本只有 mount 時跑一次：
  // useEffect(() => {
  //   loadMember();
  // }, []);

  // ✅【現在】每次路由變化都重新檢查 token
  useEffect(() => {
    loadMember();
  }, [pathname]); // ← 這裡完全保留你的作法，只是上面改了 avatar 欄位

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, avatar, member, login, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ 專門給元件用的 Hook
export const useAuth = () => useContext(AuthContext)!;
