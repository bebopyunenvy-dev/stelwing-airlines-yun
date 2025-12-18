// #region 這個檔案是幹嘛用的
// 這段程式用來「驗證使用者的 JWT Token 是否是有效的，有效的話，就將使用者的核心資料掛載到 Request 請求上，後端程式就可以判定「啊，這就是 ID XX 的使用者，通過放行」。

// 舉例路由 /me
// router.get("/me", authMiddleware, async (req: Request, res: Response) => { 巴拉巴拉程式碼
// 當使用者對 /me 這個 API 發請求的時候，就會中途插入 authMiddleware 驗證的環節。如果 JWT token 有效，就進行資料庫撈取、回傳個人資料，如果 token 無效，就拒絕這個 Request 請求，不讓使用者進一步取得他人的個資。

// 所以任何攸關「必須是使用者才可以取得的資訊」，都必須在路由掛上 authMiddleware。
// #endregion

// #region import 的部分
// 因為我們現在寫的是類別 type 定義嚴謹的 TypeScript，而我們程式的參數用到了 Request、Response、Next，這些參數有複雜的資料結構，自己定義太麻煩，所以我們引用 express 幫我們寫好的版本。

// 如何驗證 JWT token 是不是真的，自己寫也太麻煩，所以引用 jsonwebtoken 幫我們寫好的。

// 而第一行提到，如果 token 有效，就要將使用者的核心資料掛到 Request 上，而核心資料 (例如使用者 id) 就存在 Payload 裡，但核心資料裡面有什麼因開發者而異，你可能因為系統需求還放了使用者的帳號名稱、角色權限等，也會放入 token 多久後會過期，這整包資料也需要定義 type 類別，而因為資料裡放什麼是我們決定的，所以就要自己寫 type，沒辦法像前面兩個一樣引用別人的。

// 題外話，Payload 不是加密的，只是用 Base64Url 編碼，誰都可以解開看到內容，所以極重要的個資不要放這裡。
// #endregion
import type { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import type { JwtPayload } from "../interfaces/index.js";

// #region 設定 JWT 金鑰
// 前面提到 Payload 沒有加密，所以判斷 token 有沒有效，是看 JWT 第三段「簽章」的「密鑰 secret」，因為我們要驗證密鑰，所以要從 .env 檔把我們設定的密鑰取出來比對

// #endregion
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// 擴展 Request 型別以包含 JWT 用戶資訊
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// #region 驗證 JWT 是否有效的實際程式
// function 需要三個參數：Request 請求、Response 回覆、next 

// 如果 token 無效，就回傳 401 錯誤
// 如果 token 有效，則解析取出 Payload，

// #endregion
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // #region 取得 JWT token
  // 前端登入成功後，會將 JWT token 存在 localStorage 或 Cookie 等地方
  // 而前端發 Request 來時，會自己把 token 取出來，放到 Request 的 Headers 裡，並將欄位命名為 authorization
  // 前端會這樣寫：
  // fetch("/api/protected", {
  //   headers: {
  //     "Authorization": `Bearer ${token}`
  //   }
  // });
  // 所以我們這時候就要把這個 token 取出來，並且命名為變數 authorization
  // #endregion
  const authorization = req.headers.authorization;

  // 如果 authorization 沒東西或者開頭不是 Bearer 就直接踢出去，回傳狀態 401 錯誤   
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "未提供 token" });
  }

  // 因為前端在 headers 放 token 時，前面會加 "Bearer " 七個字，所以驗證時要去掉
  const token = authorization.substring(7); 

  try {
    // 使用 jwt 提供的驗證套件 verify，放入取出的 token 和我們自己設定的金鑰，解析後認定它是 JwtPayload 格式，並且把這包資料命名為 decoded
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // 成功 → 掛載使用者資訊
    req.user = decoded;
    res.locals.user = decoded;
    res.locals.isAuthenticated = true;

    next();
  } catch (err) {
    return res.status(401).json({ message: "token 不合法或者已過期" });
  }
}