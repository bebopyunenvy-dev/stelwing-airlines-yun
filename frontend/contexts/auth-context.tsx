"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface AuthContent {
  member_id: number;
  email: string;
  nickname: string;
  token: string;
}

const emptyAuth: AuthContent = {
  member_id: 0,
  email: "",
  nickname: "",
  token: "",
};

interface AuthContextType {
  auth: AuthContent;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isReady: boolean;
  getAuthHeader: () => { Authorization: string };
}

const emptyAuthContextType = {
  auth: emptyAuth,
  login: async (email: string, password: string) => false,
  logout: () => {},
  isReady: false,
  getAuthHeader: () => ({ Authorization: "" }),
};

const AuthContext = createContext<AuthContextType>(emptyAuthContextType);
/*
  1. login()
  2. logout()
  3. auth 登入的狀態
  4. get token function() 包一個 headers 物件
  5. authInit (isReady)
*/

AuthContext.displayName = "ShinderAuthContext"; // 方便除錯
const storageKey = "shinder-auth"; // 各組要設定成不同的字串
const API_SERVER =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3007";

// ********************************************
export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [auth, setAuth] = useState(emptyAuth);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const r = await fetch(`${API_SERVER}/api/jwt-login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await r.json();
      console.log({ result });

      if (result.success) {
        // 記錄到 localStorage
        const newAuth: AuthContent = {
          member_id: result.data.member.member_id,
          email: result.data.member.email,
          nickname: result.data.member.nickname,
          token: result.data.token,
        };
        localStorage.setItem(storageKey, JSON.stringify(newAuth));
        setAuth(newAuth);
        const backUrl = searchParams.get("back");
        if (backUrl) {
          router.push(backUrl);
        }
        return true; // 登入成功
      }
    } catch (ex) {}
    return false; // 沒有登入成功
  };

  const logout = () => {
    localStorage.removeItem(storageKey);
    setAuth({ ...emptyAuth });
  };

  const getAuthHeader = () => {
    return {
      Authorization: `Bearer ${auth.token}`,
    };
  };

  useEffect(() => {
    const str = localStorage.getItem(storageKey);
    if (str) {
      try {
        const authData = JSON.parse(str);
        if (authData.token) {
          fetch(`${API_SERVER}/api/jwt-logged-in`, {
            headers: {
              Authorization: `Bearer ${authData.token}`,
            },
          })
            .then((r) => r.json())
            .then((result) => {
              if (result.success) {
                setAuth(authData);
              } else {
                logout(); // token 無效時, 登出
              }
            })
            .catch((ex) => {})
            .finally(() => {
              setIsReady(true); // 完成初始化
            });
        } else {
          setIsReady(true); // 完成初始化
        }
      } catch (ex) {
        
      }
    } else {
      setIsReady(true); // 完成初始化
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, getAuthHeader, isReady }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// 權限管控的勾子
export const useAuthRequired = () => {
  const router = useRouter();
  const { auth, isReady } = useAuth();

  useEffect(() => {
    console.log("useAuthRequired:", { isReady, auth });

    if (isReady && !auth.email) {
      const href = location.href;
      router.push(`/quick-login?back=${href}`);
    }
  }, [auth, isReady]);
};

export default AuthContext;
