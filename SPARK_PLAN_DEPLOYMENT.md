# 🔥 نشر على خطة Spark المجانية

## ℹ️ حل لمشكلة Blaze Plan

لقد طلبت Firebase ترقية إلى Blaze Plan لـ Cloud Functions. بما أن هذا غير متاحر، قمت بتعديل المشروع للعمل على خطة Spark المجانية.

---

## 📝 الحل المقترح:

### الخيار 1: نشر Hosting فقط (موصى به للبدء)
- نشر تطبيق الويب على Firebase Hosting
- البوت يعمل محلياً على جهازك
- لا يتطلب Blaze Plan

### الخيار 2: استخدام بديل مجاني لـ Cloud Functions
- استخدام Railway.app أو Render مجاني
- نشر Cloud Functions هناك
- ربطها بـ Firebase Firestore

### الخيار 3: تشغيل البوت محلياً
- تشغيل البوت على جهازك كخدمة دائمة
- ربطه بـ Firebase Firestore
- يتطلب جهاز يعمل 24/7

---

## 🚀 الخيار 1: نشر Hosting فقط (الأسهل)

### الخطوة 1: تحديث firebase.json
استخدم `firebase-spark.json` بدلاً من `firebase.json`

### الخطوة 2: نشر Hosting فقط
```bash
npx firebase-tools deploy --only hosting
```

### الخطوة 3: تشغيل البوت محلياً
```bash
cd C:\Users\ب\Desktop\crypto-trading-system
node run-bot-locally.js
```

---

## 🚀 الخيار 2: استخدام Railway.app (موصى به للبوت)

### الخطوة 1: إنشاء حساب على Railway.app
1. اذهب إلى https://railway.app
2. سجل مجاناً
3. ادمع GitHub repository

### الخطوة 2: نشر بوت Railway
1. في Railway، أنشئ مشروع جديد
2. اربط مستودع GitHub
3. Railway سيقوم تلقائياً بنشر ونشر البوت

### الخطوة 3: إضافة متغيرات البيئة في Railway
```
TELEGRAM_BOT_TOKEN=8981731168:AAGn3S28U93TSCWAh1Gg88sVI_kJC9vOrqE
FIREBASE_PROJECT_ID=cryptoalbelhoushiapp
FIREBASE_API_KEY=AIzaSyCeGIRPmwjJluinpFzwYjt-1uCAjhR-b7E
```

---

## 🚀 الخيار 3: تشغيل البوت محلياً كخدمة دائمة

### الخطوة 1: تثبيت PM2 لإدارة العملية
```bash
npm install -g pm2
```

### الخطوة 2: تشغيل البوت بـ PM2
```bash
cd C:\Users\ب\Desktop\crypto-trading-system
pm2 start run-bot-locally.js --name crypto-bot
pm2 save
pm2 startup
```

### الخطوة 3: إعداد إعادة التشغيل التلقائي
PM2 سيقوم تلقائياً بإعادة تشغيل البوت عند إعادة تشغيل الجهاز.

---

## ✅ التوصية النهائية:

**أنصح بـ الخيار 2 (Railway.app)** لأنه:
- مجاني
- سهل الإعداد
- بوت يعمل 24/7 على السحابة
- لا يتطلب Blaze Plan
- يتكامل مع GitHub

**البديل**: الخيار 3 (PM2 محلياً) إذا كان لديك جهاز يعمل باستمرار.

---

## 📞 أي خيار تفضل؟

أخبرني بالخيار الذي تفضله وسأقوم بإعداد الخطوات التفصيلية.
