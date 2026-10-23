# 🔐 إعداد GitHub Secrets للبناء التلقائي

المشروع الآن مرفوع على GitHub: https://github.com/waleedatrke428-ux/crypto-trading.git

---

## 📋 الأسرار المطلوبة في GitHub

نحتاج إلى إضافة الأسرار التالية في GitHub Repository Settings:

### 1. Firebase Secrets

#### FIREBASE_PROJECT_ID
- **القيمة**: `cryptoalbelhoushiapp`
- **الوصف**: معرف مشروع Firebase

#### FIREBASE_TOKEN
- **كيفية الحصول عليه**:
  ```bash
  firebase login:ci
  ```
  سيتم فتح المتصفح وتسجيل الدخول، ثم سيظهر التوكن.

#### FIREBASE_SERVICE_CREDENTIALS
- **كيفية الحصول عليه**:
  1. اذهب إلى Firebase Console
  2. Project Settings > Service Accounts
  3. انقر على "Generate new private key"
  4. حمّل ملف JSON
  5. انسخ محتوى الملف بالكامل (JSON كامل)
  6. الصقه كـ Secret

#### FIREBASE_APP_ID_ANDROID
- **القيمة**: `1:828452986160:android:8d234ee794a868449e7cf5`
- **الوصف**: معرف تطبيق Firebase لنظام Android

---

## 📝 خطوات الإضافة:

### 1. اذهب إلى GitHub Repository
https://github.com/waleedatrke428-ux/crypto-trading/settings/secrets/actions

### 2. أضف كل سر على حدة:

لإضافة سر:
1. اضغط `New repository secret`
2. **Name**: اسم السر (مثلاً: `FIREBASE_PROJECT_ID`)
3. **Secret**: القيمة
4. اضغط `Add secret`

### 3. الأسرار المطلوبة:

```
FIREBASE_PROJECT_ID = cryptoalbelhoushiapp
FIREBASE_APP_ID_ANDROID = 1:828452986160:android:8d234ee794a868449e7cf5
FIREBASE_TOKEN = (من firebase login:ci)
FIREBASE_SERVICE_CREDENTIALS = (محتوى ملف JSON)
```

---

## ✅ بعد الإضافة:

بعد إضافة جميع الأسرار، سيبدأ GitHub Actions في العمل تلقائياً عند:
- Push إلى الفرع `main`
- Pull Request إلى `main`
- أو تشغيل يدوي من تبويب Actions

---

## 🚀 اختبار البناء التلقائي:

بعد إضافة الأسرار، ادفع أي تغيير صغير لاختبار البناء:

```bash
cd C:\Users\ب\Desktop\crypto-trading-system
echo "# Test" >> README.md
git add .
git commit -m "Test GitHub Actions"
git push origin main
```

ثم راقب البناء في:
https://github.com/waleedatrke428-ux/crypto-trading/actions

---

## 📞 إذا واجهت مشاكل:

- تأكد من صحة FIREBASE_TOKEN
- تأكد من أن FIREBASE_SERVICE_CREDENTIALS هو JSON كامل
- راقب Logs في GitHub Actions للأخطاء

---

## 🎯 الخلاصة:

✅ المشروع مرفوع على GitHub
⏳ إضافة GitHub Secrets المطلوبة
🚀 سيبدأ البناء التلقائي بعد إضافة الأسرار
