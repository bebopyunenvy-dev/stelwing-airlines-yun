"use client";

export async function apiFetch(url: string, options: RequestInit = {}) {
  // 取 token
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

    console.log(token);
  // 合併 headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let res: Response;

  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err) {
    // 🎯 fetch 根本沒送出去（URL錯 / CORS / 伺服器沒開）
    console.error("❌ FETCH FAILED:", err);
    throw new Error("無法連線到伺服器，請稍後再試。");
  }

  // 回傳不是 JSON 時避免爆掉（例如 204）
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  // 🎯 如果是 token 過期
  if (res.status === 401) {
    console.warn("⚠ Token 過期或無效，登出並導向登入頁");

    localStorage.removeItem("token");
    window.location.href = "/member-center/login";
    return;
  }

  if (!res.ok) {
    console.error("❌ API 錯誤回應：", data);
    throw new Error(data?.message || "操作失敗，請稍後再試。");
  }

  return data?.data ?? data;
}
