import ms from "ms";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { readFile, writeFile } from "fs/promises";
import type { Response } from "express";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 判斷是否為開發環境
export const isDev = process.env.NODE_ENV === "development";

// 轉換時間戳記為多久前
export const timeAgo = (timestamp?: string | Date, timeOnly = false): string => {
  if (!timestamp) return "never";
  return `${ms(Date.now() - new Date(timestamp).getTime())}${
    timeOnly ? "" : " ago"
  }`;
};

// 讀取 JSON 檔案
export const readJsonFile = async <T = any>(pathname: string): Promise<T> => {
  const data = await readFile(path.join(process.cwd(), pathname));
  return JSON.parse(data.toString());
};

// 寫入 JSON 檔案
export const writeJsonFile = async (
  pathname: string,
  jsonOrObject: any,
  folder = "./"
): Promise<boolean> => {
  try {
    const data =
      typeof jsonOrObject === "object"
        ? JSON.stringify(jsonOrObject)
        : jsonOrObject;

    await writeFile(path.join(process.cwd(), folder + pathname), data);
    return true;
  } catch (e) {
    if (isDev) console.log(e);
    return false;
  }
};

// 顯示 console.log 行號
export const extendLog = () => {
  ["log", "warn", "error"].forEach((methodName) => {
    const originalMethod = console[methodName as keyof Console] as Function;

    console[methodName as keyof Console] = (...args: any[]) => {
      try {
        throw new Error();
      } catch (error: any) {
        originalMethod.apply(console, [
          error.stack
            .split("\n")[2]
            .trim()
            .substring(3)
            .replace(__dirname, "")
            .replace(/\s\(./, " at ")
            .replace(/\)/, ""),
          "\n",
          ...args,
        ]);
      }
    };
  });
};

// 檢查空物件
export const isEmpty = (obj: Record<string, any>): boolean => {
  for (const key in obj) return false;
  return true;
};

// 轉成 kebab-case
export const toKebabCase = (str: string): string => {
  return (
    str &&
    str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )!
      .map((x) => x.toLowerCase())
      .join("-")
  );
};

// 載入 .env
export const loadEnv = (fileExt = "") => {
  dotenv.config({ path: fileExt ? `.env${fileExt}` : `.env` });
};

// 時區轉換
export function convertTimeZone(
  date: Date,
  timeZoneFrom: string | null = "UTC",
  timeZoneTo: string | null = "Asia/Taipei"
): Date {
  const dateFrom =
    timeZoneFrom == null
      ? date
      : new Date(
          date.toLocaleString("en-US", {
            timeZone: timeZoneFrom,
          })
        );

  const dateTo =
    timeZoneTo == null
      ? date
      : new Date(
          date.toLocaleString("en-US", {
            timeZone: timeZoneTo,
          })
        );

  return new Date(date.getTime() + dateTo.getTime() - dateFrom.getTime());
}

// 時區轉換後格式化
export function dateToStringWithTimeZone(
  date: Date,
  timeZone = "Asia/Taipei"
): string {
  date = convertTimeZone(date, "UTC", timeZone);

  const year = date.getUTCFullYear().toString().padStart(4, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 成功回應
export const successResponse = (
  res: Response,
  data: any = null,
  status = 200
) => {
  return res.status(status).json({ status: "success", data });
};

// 錯誤回應
export const errorResponse = (res: Response, error: any, status = 200) => {
  if (isDev) console.log(error);

  const message = error?.name?.includes("Prisma")
    ? "資料庫查詢錯誤"
    : error?.message || "發生錯誤";

  return res.status(status).json({ status: "error", message });
};

// 驗證 id 必須為正整數
export const validatedParamId = (id: any) => {
  const paramIdSchema = z.number().int().positive();
  const validated = paramIdSchema.safeParse(Number(id));

  if (!validated.success) {
    if (isDev) console.log(validated.error);
    throw new Error("缺少必要參數，或參數格式不正確");
  }
};

// Zod schema bind
export const safeParseBindSchema =
  (schemaObj: Record<string, any> | null = null) =>
  (validatedObj: Record<string, any> | null = null) => {
    if (!schemaObj || !validatedObj) {
      throw new Error("檢驗函式缺少必要參數，或參數格式不正確");
    }

    const prop = Object.keys(validatedObj)[0];
    const data = validatedObj[prop];

    const validated = schemaObj[prop]?.safeParse(data);

    if (!validated?.success) {
      if (isDev) console.log(validated?.error);
      throw new Error("資料格式不正確");
    }
  };
