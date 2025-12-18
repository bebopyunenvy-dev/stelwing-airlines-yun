import express, { type Request, type Response } from 'express';
import * as crypto from 'crypto';
import { isDev, successResponse, errorResponse } from '../../utils/utils.js';

const router = express.Router();

/** Query 參數型別 */
interface ECPayQuery {
  amount?: string;
  items?: string;
}

// GET /api/ecpay-test-only?amount=1000&items=機票
router.get(
  '/',
  (req: Request<unknown, unknown, unknown, ECPayQuery>, res: Response) => {
    // 目前只需要一個參數，總金額。其它的可以自行設定
    const amount = Number(req.query.amount) || 0;
    const items = req.query.items ?? '';

    const itemName =
      items.split(',').length > 1
        ? items.split(',').join('#')
        : 'Stelwing線上來回機票';

    if (isDev) console.log('amount:', amount);
    if (isDev) console.log('items:', items);
    if (isDev) console.log('itemName:', itemName);

    if (!amount) {
      return errorResponse(res, '缺少總金額');
    }

    // 綠界全方位金流技術文件：
    // https://developers.ecpay.com.tw/?p=2856
    // 信用卡測試卡號：4311-9522-2222-2222 安全碼 222

    //////////////////////// 改以下參數即可 ////////////////////////
    // 一、選擇帳號，是否為測試環境
    const MerchantID = '3002607'; // 必填
    const HashKey = 'pwFHCqoQZGmho4w6'; // 3002607
    const HashIV = 'EkRm7iFT261dpevs'; // 3002607
    const isStage = true; // 測試環境： true；正式環境：false

    // 二、輸入參數
    const TotalAmount = amount; // 整數，不可有小數點。金額不可為0。
    const TradeDesc = '線上付款'; // String(200)
    const ItemName = itemName; // String(400)

    // 付款結果通知回傳網址 (這網址需為可被外部呼叫的網址)
    const ReturnURL = 'https://www.ecpay.com.tw';

    // (二選一) 前端成功頁面 api 路由
    // const OrderResultURL = 'http://localhost:3000/flight-booking/checkout/success';

    // 改用 ClientBackURL：讓使用者在綠界完成頁點「返回商店」時回到這個頁面
const ClientBackURL =
  'http://localhost:3000/flight-booking/checkout/success';

    const ChoosePayment = 'ALL';

    //////////////////////// 以下參數不用改 ////////////////////////
    const stage = isStage ? '-stage' : '';
    const algorithm = 'sha256';
    const digest: crypto.BinaryToTextEncoding = 'hex';
    const APIURL = `https://payment${stage}.ecpay.com.tw//Cashier/AioCheckOut/V5`;

    const now = new Date();
    const MerchantTradeNo = `od${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now
      .getDate()
      .toString()
      .padStart(2, '0')}${now
      .getHours()
      .toString()
      .padStart(2, '0')}${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}${now
      .getSeconds()
      .toString()
      .padStart(2, '0')}${now
      .getMilliseconds()
      .toString()
      .padStart(2, '0')}`;

    const MerchantTradeDate = now.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    // 三、計算 CheckMacValue 之前
    const ParamsBeforeCMV: Record<string, string | number> = {
      MerchantID,
      MerchantTradeNo,
      MerchantTradeDate: MerchantTradeDate.toString(),
      PaymentType: 'aio',
      EncryptType: 1,
      TotalAmount,
      TradeDesc,
      ItemName,
      ReturnURL,
      ChoosePayment,
      // OrderResultURL,
        ClientBackURL,
    };

    // 四、計算 CheckMacValue
    function DotNETURLEncode(str: string): string {
      const list: Record<string, string> = {
        '%2D': '-',
        '%5F': '_',
        '%2E': '.',
        '%21': '!',
        '%2A': '*',
        '%28': '(',
        '%29': ')',
        '%20': '+',
      };

      let result = str;
      Object.entries(list).forEach(([encoded, decoded]) => {
        const regex = new RegExp(encoded, 'g');
        result = result.replace(regex, decoded);
      });

      return result;
    }

    function CheckMacValueGen(
      parameters: Record<string, string | number>,
      algo: string,
      dig: crypto.BinaryToTextEncoding
    ): string {
      const step0 = Object.entries(parameters)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      const step1 = step0
        .split('&')
        .sort((a, b) => {
          const keyA = a.split('=')[0];
          const keyB = b.split('=')[0];
          return keyA.localeCompare(keyB);
        })
        .join('&');

      const step2 = `HashKey=${HashKey}&${step1}&HashIV=${HashIV}`;
      const step3 = DotNETURLEncode(encodeURIComponent(step2));
      const step4 = step3.toLowerCase();
      const step5 = crypto.createHash(algo).update(step4).digest(dig);
      const step6 = step5.toUpperCase();
      return step6;
    }

    const CheckMacValue = CheckMacValueGen(
      ParamsBeforeCMV,
      algorithm,
      digest
    );

    // 五、將所有的參數製作成 payload
    const AllParams: Record<string, string | number> = {
      ...ParamsBeforeCMV,
      CheckMacValue,
    };

    // 六、將 action + params 回傳給前端，由前端產生 form 並送出到綠界
    successResponse(res, { action: APIURL, params: AllParams });
  }
);

export default router;
