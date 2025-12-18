// 這是預期後端會回傳的結構
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 一個公用的 apiFetch 程式
/* 
參數是 API 的 URL，以及瀏覽
第二個參數是 fetch 選像，RequestInit 是環境內建的型別，可能有 method 方法、headers 標頭、body 內容等
泛型 T 代表目前不指定 API 回傳的型別 
 */
export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const token = localStorage.getItem('token');
    // 預設 headers（可以擴充、可以被之後的設定覆蓋），預設希望收到的回傳是 JSON 格式，而我送出去的 body 是 application/json 格式
    const defaultHeaders: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    // 從參數取得使用者設定的 headers，如果使用者沒設定就是空物件，然後格式是 key/value
    const userHeaders = (options.headers ?? {}) as Record<string, string>;

    // 如果 body 是 FormData，就不要預設 Content-Type（讓瀏覽器自動處理 boundary）
    const isFormData = options.body instanceof FormData;

    // 合併目前的 headers，先放入預設，再拿使用者的覆蓋
    const headers: Record<string, string> = {
      ...defaultHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...userHeaders,
    };

    // 如果 isFormData 為 true 也就是有上傳檔案，把 headers 中 Content-Type 全部拉掉
    if (isFormData) {
      // 移除 Content-Type，避免破壞 boundary
      delete headers['Content-Type'];
    }

    // 正式發 fetch，先放入全部的 options 內容，再拿調整好的 headers 蓋掉
    const res = await fetch(url, {
      ...options,
      headers,
    });

    // 根據回傳的結果開始整理訊息
    let json: any = null;
    try {
      json = await res.json(); // 嘗試解析 JSON
    } catch (err) {
      // 如果後端根本沒回 JSON（例如 HTML 錯誤頁），就保持 null
    }

    // Step 1: HTTP 層
    if (!res.ok) {
      // 嘗試從 JSON 拿錯誤訊息；若沒有，就用狀態碼補上
      const message =
        (json && (json.message || json.error)) ||
        `HTTP ${res.status} ${res.statusText}`;
      throw new Error(message);
    }

    // Step 2: 業務層
    if (!json.success) {
      throw new Error(json.message || json.error || '操作失敗');
    }

    // Step 3: 返回資料
    return json.data as T;
  } catch (err) {
    // 共用錯誤處理
    console.error('API error:', err);
    throw err; // 讓呼叫端決定要不要顯示 toast
  }
}
