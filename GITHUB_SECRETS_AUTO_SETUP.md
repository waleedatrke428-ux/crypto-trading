# 🔐 إعداد GitHub Secrets تلقائياً - جميع القيم جاهزة

يرجى إضافة هذه الأسرار في GitHub Repository:
https://github.com/waleedatrke428-ux/crypto-trading/settings/secrets/actions

---

## 📋 القيم الجاهزة للنسخ واللصق:

### 1. FIREBASE_PROJECT_ID
```
cryptoalbelhoushiapp
```

### 2. FIREBASE_APP_ID_ANDROID
```
1:828452986160:android:8d234ee794a868449e7cf5
```

### 3. FIREBASE_TOKEN
**للحصول على هذا التوكن**، شغّل هذا الأمر في Terminal:
```bash
npm install -g firebase-tools
firebase login:ci
```
ثم انسخ التوكن الناتج.

**أو إذا كنت تريد استخدام التوكن المؤقت للتجربة**، سأقوم بتوفيره قريباً.

### 4. FIREBASE_SERVICE_CREDENTIALS
**للحصول على هذا**:
1. اذهب إلى Firebase Console: https://console.firebase.google.com/project/cryptoalbelhoushiapp/settings/serviceaccounts/adminsdk
2. انقر على "Generate new private key"
3. حمّل الملف
4. افتح الملف في المفكرة
5. انسخ محتوى JSON بالكامل
6. الصقه كـ Secret

---

## 🚀 خطوات الإضافة السريعة:

### الخطوة 1: اذهب إلى GitHub
https://github.com/waleedatrke428-ux/crypto-trading/settings/secrets/actions

### الخطوة 2: أضف الأسرار

لإضافة كل سر:
1. اضغط `New repository secret`
2. **Name**: الاسم من القائمة أعلاه
3. **Secret**: القيمة من القائمة أعلاه
4. اضغط `Add secret`

### الخطوة 3: تكرر للأسرار الأربعة

---

## ⚡ الحل البديل: نشر يدوي على Firebase

بما أن إضافة GitHub Secrets قد يستغرق وقتاً، سأقوم بنشر النظام على Firebase مباشرة الآن لتشغيل البوت.

قم بتشغيل هذا الملف:
```
C:\Users\ب\Desktop\crypto-trading-system\deploy.bat
```

سيتولى:
1. تثبيت Firebase CLI
2. تسجيل الدخول
3. تهيئة المشروع
4. نشر Cloud Functions

---

## 🤖 لتشغيل البوت الآن بدون نشر:

يمكننا تشغيل Bot محلياً باستخدام Node.js مباشرة:

```bash
cd C:\Users\ب\Desktop\crypto-trading-system\functions
npm install
npm run build
node -e "require('./lib/telegram/bot').TelegramBotService;"
```

سأقوم بإنشاء سكريبت بسيط لذلك.
