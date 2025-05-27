const express = require('express');
const ecpay_payment = require('ecpay_aio_nodejs');

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 綠界參數設定
const options = {
    "OperationMode": "Test", // Test 或 Production
    "MercProfile": {
        "MerchantID": process.env.MERCHANT_ID,
        "HashKey": process.env.HASH_KEY,
        "HashIV": process.env.HASH_IV,
    },
    "IgnorePayment": [
        // 根據需求設定不要的付款方式
    ],
    "IsProjectContractor": false
};

// 基本路由
app.get('/', (req, res) => {
    res.send('ECPay 付款服務已啟動');
});

// 建立訂單路由
app.post('/create-order', (req, res) => {
    // 訂單資料
    const MerchantTradeDate = new Date().toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Taipei'
    }).replace(/[/:]/g, '').replace(/ /g, '');

    const base_param = {
        MerchantTradeNo: 'ecpay' + MerchantTradeDate,
        MerchantTradeDate: MerchantTradeDate,
        TotalAmount: '100',
        TradeDesc: '測試交易',
        ItemName: '測試商品',
        ReturnURL: `${process.env.BASE_URL}/receive`,

    };

    const create = ecpay_payment.payment_client.aio_check_out_all(options, base_param);
    res.send(create);
});

// 付款結果接收
app.post('/receive', (req, res) => {
    console.log('付款結果:', req.body);
    
    // 檢查付款結果
    const check_mac_value = ecpay_payment.payment_client.helper.gen_chk_mac_value(options, req.body);
    
    if (check_mac_value === req.body.CheckMacValue) {
        console.log('付款驗證成功');
        res.send('1|OK'); // 回傳給綠界
    } else {
        console.log('付款驗證失敗');
        res.send('0|ERROR');
    }
});

app.listen(PORT, () => {
    console.log(`伺服器運行在 port ${PORT}`);
});
