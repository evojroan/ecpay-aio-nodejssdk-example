const express = require("express");
require("dotenv").config();
const ECPayPayment = require("ecpay_aio_nodejs");
const options = require('./config/ecpay_options.js'); 

const ecpayInstance = new ECPayPayment(options);

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 基本路由
app.get("/", (req, res) => {
  res.send("ECPay OK");
});

// 建立訂單路由
app.post("/create-order", (req, res) => {
  const MerchantTradeDate = new Date().toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Taipei",
  });

  const base_param = {
    MerchantTradeNo: "ecpay" + Date.now(), // 改用時間戳記
    MerchantTradeDate: MerchantTradeDate,
    TotalAmount: "100",
    TradeDesc: "測試交易",
    ItemName: "測試商品",
    ReturnURL: `https://www.ecpay.com.tw`,
  };

  // 使用正確的實例調用方法
  const create = ecpayInstance.payment_client.aio_check_out_all(base_param);
  res.send(create);
});

app.listen(PORT, () => {
  console.log(`伺服器運行在 port ${PORT}`);
});
