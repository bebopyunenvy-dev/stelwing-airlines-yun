// #region 關於 serializeBigInt
// 

// #endregion

// 參數 obj 的型別定義為 any，函式 serializeBigInt 的回傳值型別定義也是 any
export function serializeBigInt(value: any): any {
    // 如果 value 為 null 或 undefined，不做處裡，回傳原本的 value
    // [！] 因為 typeof null 會為 object，所以這行一定要在第一個
    if (value === null || value === undefined) return value;

    // 如果 value 是一個 bigint
    if (typeof value === "bigint") {
        // 把它轉成 string 
        return value.toString();
    }

    if (value instanceof Date) {
    // 如果 value 是一個 date，將 Date 轉成 ISO 字串（例如 2025-10-30T06:13:00.000Z）
    return value.toISOString();
    }

    // 如果 value 是一個陣列
    if (Array.isArray(value)) {
        // 將陣列用 map 巡每一個項目，並對每一個項目做 serializeBigInt 判別
        return value.map(serializeBigInt);
    }

    // 如果 value 是一個物件
    if (typeof value === "object") {
        // 建立一個新的空物件來存處理後的屬性
        const newObj: any = {};

        // value 現在是物件，把所有的 key 跑一次迴圈
        for (const key in value) {
            // 將這個 key 放進新的物件 newObj 當它的 key，而這個 key 的值，是原本 value 物件的 key 對應的值，做 serializeBigInt 後的值
            newObj[key] = serializeBigInt(value[key]);
        }

        return newObj;
    }

    // 如果 value 不是 null、undefined、bigint、陣列、物件，就 return value
    return value;
};