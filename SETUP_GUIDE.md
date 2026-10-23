# 📖 دليل الإعداد والتشغيل

## 🎯 الخطوة 1: إعداد مشروع Firebase

### 1. إنشاء مشروع Firebase
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. أنشئ مشروع جديد
3. أضف تطبيق ويب (للتطبيق Flutter)
4. احصل على إعدادات Firebase

### 2. تثبيت Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 3. تهيئة المشروع
```bash
cd crypto-trading-system
firebase init
```

اختر الخيارات التالية:
- Functions: Yes
- Firestore: Yes
- Hosting: Yes
- Storage: Yes

## 🎯 الخطوة 2: إعداد Cloud Functions

### 1. تثبيت الحزم
```bash
cd functions
npm install
```

### 2. إعداد متغيرات البيئة
```bash
firebase functions:config:set telegram.token="YOUR_TELEGRAM_BOT_TOKEN"
firebase functions:config:set binance.api_key="YOUR_BINANCE_API_KEY"
firebase functions:config:set binance.api_secret="YOUR_BINANCE_API_SECRET"
```

### 3. بناء المشروع
```bash
npm run build
```

### 4. اختبار محلياً
```bash
firebase emulators:start
```

## 🎯 الخطوة 3: إعداد تطبيق Flutter

### 1. تثبيت Flutter
```bash
# تأكد من تثبيت Flutter
flutter --version

# تثبيت الحزم
cd app
flutter pub get
```

### 2. إعداد Firebase في Flutter
```bash
flutter pub add firebase_core firebase_auth cloud_firestore
```

### 3. إضافة ملف google-services.json
1. من Firebase Console، اذهب إلى Project Settings
2. أضف تطبيق Android
3. حمّل ملف google-services.json
4. ضعه في `app/android/app/`

### 4. تشغيل التطبيق
```bash
# على محاكي Android
flutter run

# على iOS
flutter run -d ios

# على الويب
flutter run -d chrome
```

## 🎯 الخطوة 4: إعداد بوت تيليجرام

### 1. إنشاء بوت تيليجرام
1. اذهب إلى [@BotFather](https://t.me/botfather) على تيليجرام
2. أرسل `/newbot`
3. اتبع التعليمات
4. احصل على توكن البوت

### 2. تفعيل البوت
```bash
# استدعاء Cloud Function لتهيئة البوت
curl -X POST https://your-project.cloudfunctions.net/initTelegramBot \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_BOT_TOKEN"}'
```

### 3. اختبار البوت
1. اذهب إلى البوت على تيليجرام
2. أرسل `/start`
3. تأكد من استجابة البوت

## 🎯 الخطوة 5: إعداد APIs البورصات

### Binance API
1. سجل في [Binance](https://www.binance.com/en)
2. اذهب إلى API Management
3. أنشئ API Key
4. احفظ API Key و Secret

### Coinbase API
1. سجل في [Coinbase](https://www.coinbase.com)
2. اذهب إلى API Settings
3. أنشئ API Key
4. احفظ API Key و Secret

### Bybit API
1. سجل في [Bybit](https://www.bybit.com)
2. اذهب إلى API Management
3. أنشئ API Key
4. احفظ API Key و Secret

## 🎯 الخطوة 6: إعداد Stripe للدفع

### 1. إنشاء حساب Stripe
1. سجل في [Stripe](https://stripe.com)
2. احصل على API Keys

### 2. إعداد Webhook
```bash
firebase functions:config:set stripe.secret_key="sk_test_..."
firebase functions:config:set stripe.publishable_key="pk_test_..."
firebase functions:config:set stripe.webhook_secret="whsec_..."
```

### 3. نشر Webhook URL
1. بعد نشر Cloud Functions
2. أضف Webhook URL في Stripe Dashboard
3. Webhook URL: `https://your-project.cloudfunctions.net/stripeWebhook`

## 🎯 الخطوة 7: نشر النظام

### 1. نشر Cloud Functions
```bash
firebase deploy --only functions
```

### 2. نشر Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 3. نشر Firestore Indexes
```bash
firebase deploy --only firestore:indexes
```

### 4. نشر Hosting
```bash
firebase deploy --only hosting
```

### 5. نشر الكل
```bash
firebase deploy
```

## 🎯 الخطوة 8: تشغيل النظام

### بدء توليد الإشارات تلقائياً
النظام سينشئ إشارات تلقائياً كل 30 دقيقة عبر Pub/Sub Scheduler.

### توليد إشارة يدوياً
```bash
curl -X POST https://your-project.cloudfunctions.net/generateSignal \
  -H "Content-Type: application/json" \
  -d '{
    "pair": "BTCUSDT",
    "type": "SPOT",
    "timeframe": "1h"
  }'
```

## 🔍 المراقبة والصيانة

### عرض Logs
```bash
firebase functions:log
```

### مراقبة Firestore
1. اذهب إلى Firebase Console
2. Firestore Database
3. راقب البيانات والإشارات

### مراقبة Functions
1. اذهب إلى Firebase Console
2. Functions
3. راقب الأداء والاستخدام

## 📊 لوحة التحكم الإدارية

### الوصول إلى لوحة التحكم
1. نشر لوحة التحكم (React)
2. الوصول عبر Firebase Hosting
3. تسجيل الدخول بحساب Admin

### الميزات المتاحة
- عرض الإحصائيات
- إدارة المستخدمين
- إدارة الاشتراكات
- عرض الإشارات
- تتبع الإيرادات

## ⚠️ ملاحظات مهمة

1. **الأمان**: لا تشارك مفاتيح API مع أي شخص
2. **النسخ الاحتياطي**: قم بعمل نسخ احتياطي لقاعدة البيانات بانتظام
3. **المراقبة**: راقب استخدام Cloud Functions لتجنب الفواتير المرتفعة
4. **التحديثات**: حدث الحزم بانتظام للحصول على أحدث الميزات والأمان

## 🆘 استكشاف الأخطاء

### البوت لا يستجيب
- تأكد من توكن البوت صحيح
- تحقق من Logs في Firebase Console
- تأكد من تهيئة البوت بشكل صحيح

### الإشارات لا تُنشأ
- تحقق من APIs البورصات
- تأكد من الاتصال بالإنترنت
- راقب Logs للبحث عن الأخطاء

### التطبيق لا يتصل بـ Firebase
- تأكد من إعدادات Firebase صحيحة
- تحقق من قواعد Firestore
- راجل Console في التطبيق

## 📞 الدعم

إذا واجهت أي مشاكل:
1. راجع Logs في Firebase Console
2. تحقق من الوثائق
3. تواصل مع الدعم الفني

---

🎉 مبروك! لقد قمت بإعداد نظام التداول الذكي بنجاح.
