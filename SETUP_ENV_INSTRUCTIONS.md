# 📝 تعليمات إنشاء ملف .env.local

بما أن ملفات `.env` محمية في `.gitignore` لأسباب أمنية، قم بإنشاء الملف يدوياً:

## الخطوات:

### 1. افتح المفكرة أو أي محرر نصوص

### 2. انسخ المحتوى التالي:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=cryptoalbelhoushiapp
FIREBASE_API_KEY=AIzaSyCeGIRPmwjJluinpFzwYjt-1uCAjhR-b7E
FIREBASE_APP_ID=1:828452986160:android:8d234ee794a868449e7cf5
FIREBASE_MESSAGING_SENDER_ID=828452986160
FIREBASE_STORAGE_BUCKET=cryptoalbelhoushiapp.firebasestorage.app

# Telegram Bot Token
TELEGRAM_BOT_TOKEN=8981731168:AAGn3S28U93TSCWAh1Gg88sVI_kJC9vOrqE

# Binance API Keys (يمكن إضافتها لاحقاً)
BINANCE_API_KEY=
BINANCE_API_SECRET=

# Coinbase API Keys (اختياري)
COINBASE_API_KEY=
COINBASE_API_SECRET=
COINBASE_API_PASSPHRASE=

# Bybit API Keys (اختياري)
BYBIT_API_KEY=
BYBIT_API_SECRET=

# Stripe Keys (للدفع الإلكتروني)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Firebase Web Configuration
FIREBASE_WEB_API_KEY=
FIREBASE_AUTH_DOMAIN=
```

### 3. احفظ الملف بالاسم:
`.env.local`

### 4. احفظه في المسار:
`C:\Users\ب\Desktop\crypto-trading-system\.env.local`

---

## ✅ بعد الإنشاء:

أخبرني عندما تنتهي، وسأقوم بتحديث الكود لقراءة هذه القيم.

---

## 📌 ملاحظة هامة:

تم بالفعل إعداد:
- ✅ Telegram Bot Token: `8981731168:AAGn3S28U93TSCWAh1Gg88sVI_kJC9vOrqE`
- ✅ Firebase Android Config

متبقي:
- ⏳ بيانات إعدادات الويب (يمكن إضافتها لاحقاً)
- ⏳ Binance API Keys (اختياري - يمكن إضافتها لاحقاً)
