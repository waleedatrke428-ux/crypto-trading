# 🔐 دليل الأمان وإدارة الأسرار

## نظرة عامة
يستخدم هذا المشروع عدة مفاتيح API سرية يجب إدارتها بعناية لضمان أمان النظام.

---

## 📍 مسارات إدخال مفاتيح API السرية

### 1. Firebase Configuration (إعدادات Firebase)

#### المسار 1: Firebase Console (الطريقة الموصى بها)
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك
3. اذهب إلى Project Settings (⚙️)
4. في تبويب General، ستجد:
   - Project ID
   - API Key
   - Auth Domain
   - Database URL
   - Storage Bucket
   - Messaging Sender ID
   - App ID

#### المسار 2: ملف .env.local (للتطوير المحلي)
```bash
# أنشئ الملف في:
crypto-trading-system/.env.local

# المحتوى:
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

#### المسار 3: Firebase Functions Config (للإنتاج)
```bash
# استخدم Firebase CLI:
firebase functions:config:set firebase.project_id="your-project-id"
firebase functions:config:set firebase.api_key="your-api-key"
```

---

### 2. Telegram Bot Token

#### المسار 1: Firebase Functions Config (الموصى به للإنتاج)
```bash
firebase functions:config:set telegram.token="YOUR_BOT_TOKEN"
```

#### المسار 2: ملف .env.local (للتطوير)
```bash
# أضف إلى .env.local:
TELEGRAM_BOT_TOKEN=your-bot-token
```

#### كيفية الحصول على التوكن:
1. اذهب إلى [@BotFather](https://t.me/botfather) على تيليجرام
2. أرسل `/newbot`
3. اتبع التعليمات
4. احصل على التوكن (يبدأ بـ `bot` متبوعاً بنص طويل)

---

### 3. Binance API Keys

#### المسار 1: Firebase Functions Config (الموصى به للإنتاج)
```bash
firebase functions:config:set binance.api_key="YOUR_API_KEY"
firebase functions:config:set binance.api_secret="YOUR_API_SECRET"
```

#### المسار 2: ملف .env.local (للتطوير)
```bash
# أضف إلى .env.local:
BINANCE_API_KEY=your-api-key
BINANCE_API_SECRET=your-api-secret
```

#### كيفية الحصول على المفاتيح:
1. سجل في [Binance](https://www.binance.com/en)
2. اذهب إلى API Management
3. أنشئ API Key جديد
4. حدد الصلاحيات:
   - Enable Reading
   - Enable Spot & Margin Trading (اختياري)
   - Enable Futures (اختياري)
5. ⚠️ **مهم**: اربط IP Addresses للوصول الآمن
6. احفظ API Key و Secret

---

### 4. Coinbase API Keys

#### المسار 1: Firebase Functions Config (الموصى به للإنتاج)
```bash
firebase functions:config:set coinbase.api_key="YOUR_API_KEY"
firebase functions:config:set coinbase.api_secret="YOUR_API_SECRET"
firebase functions:config:set coinbase.api_passphrase="YOUR_PASSPHRASE"
```

#### المسار 2: ملف .env.local (للتطوير)
```bash
# أضف إلى .env.local:
COINBASE_API_KEY=your-api-key
COINBASE_API_SECRET=your-api-secret
COINBASE_API_PASSPHRASE=your-passphrase
```

#### كيفية الحصول على المفاتيح:
1. سجل في [Coinbase](https://www.coinbase.com)
2. اذهب إلى API Settings
3. أنشئ API Key جديد
4. حدد الصلاحيات:
   - View
   - Trade (اختياري)
5. احفظ API Key, Secret, و Passphrase

---

### 5. Bybit API Keys

#### المسار 1: Firebase Functions Config (الموصى به للإنتاج)
```bash
firebase functions:config:set bybit.api_key="YOUR_API_KEY"
firebase functions:config:set bybit.api_secret="YOUR_API_SECRET"
```

#### المسار 2: ملف .env.local (للتطوير)
```bash
# أضف إلى .env.local:
BYBIT_API_KEY=your-api-key
BYBIT_API_SECRET=your-api-secret
```

#### كيفية الحصول على المفاتيح:
1. سجل في [Bybit](https://www.bybit.com)
2. اذهب إلى API Management
3. أنشئ API Key جديد
4. حدد الصلاحيات:
   - Read-Only (للقراءة فقط)
   - Contract Trading (للتداول)
5. احفظ API Key و Secret

---

### 6. Stripe Keys (للدفع الإلكتروني)

#### المسار 1: Firebase Functions Config (الموصى به للإنتاج)
```bash
firebase functions:config:set stripe.secret_key="sk_test_..."
firebase functions:config:set stripe.publishable_key="pk_test_..."
firebase functions:config:set stripe.webhook_secret="whsec_..."
```

#### المسار 2: ملف .env.local (للتطوير)
```bash
# أضف إلى .env.local:
STRIPE_SECRET_KEY=sk_test_your-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

#### كيفية الحصول على المفاتيح:
1. سجل في [Stripe](https://stripe.com)
2. اذهب إلى Developers > API keys
3. ستجد:
   - Publishable key (pk_test_...) - آمن للاستخدام في الـ Frontend
   - Secret key (sk_test_...) - ⚠️ سري جداً، استخدم في Backend فقط
4. للإنتاج، استخدم المفاتيح التي تبدأ بـ `sk_live_` و `pk_live_`
5. اذهب إلى Webhooks لإنشاء Webhook Secret

---

## 🔒 أفضل ممارسات الأمان

### 1. عدم الالتزام بالأسرار في Git
⚠️ **أبداً** تلتزم ملفات تحتوي على أسرار في Git. تأكد من أن `.gitignore` يحتوي على:
```
.env
.env.local
.env.*.local
firebase.json.local
*.key
*.secret
service-account.json
```

### 2. استخدام Firebase Functions Config للإنتاج
Firebase Functions Config هو الطريقة الأكثر أماناً لتخزين الأسرار في الإنتاج:
```bash
# عرض التكوين الحالي
firebase functions:config:get

# تعيين قيمة
firebase functions:config:set service.key="value"

# حذف قيمة
firebase functions:config:unset service.key
```

### 3. استخدام Service Account Keys (للتطوير المحلي)
للتطوير المحلي، قد تحتاج إلى Service Account Key:
1. اذهب إلى Firebase Console > Project Settings > Service Accounts
2. انقر على "Generate new private key"
3. حمّل ملف JSON
4. ⚠️ **مهم**: احفظ الملف في مكان آمن
5. أضف مسار الملف إلى متغير البيئة:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
```

### 4. تقييد الصلاحيات
عند إنشاء API Keys، قلل الصلاحيات إلى الحد الأدنى المطلوب:
- استخدم Read-Only keys عند الإمكان
- قيد الوصول بـ IP Addresses
- استخدم keys مختلفة للتطوير والإنتاج

### 5. تدوير المفاتيح (Key Rotation)
قم بتغيير المفاتيح بشكل دوري:
- كل 90 يوماً للمفاتيح الحساسة
- فوراً عند وجود شك في اختراق
- عند تغيير أعضاء الفريق

### 6. مراقبة الاستخدام
راقب استخدام API Keys:
- راقب Logs في Firebase Console
- استخدم StackDriver للمراقبة المتقدمة
• أضف تنبيهات للاستخدام غير المعتاد

---

## 🔐 قراءة الأسرار في الكود

### في Cloud Functions
```typescript
import * as functions from 'firebase-functions';

// قراءة من Firebase Functions Config
const telegramToken = functions.config().telegram.token;
const binanceApiKey = functions.config().binance.api_key;
const binanceApiSecret = functions.config().binance.api_secret;

// استخدامها
console.log('Telegram Token:', telegramToken);
```

### في Flutter App
```dart
// لقراءة إعدادات Firebase، استخدم firebase_options.dart
// يتم إنشاؤه تلقائياً بواسطة FlutterFire CLI

import 'firebase_options.dart';

await Firebase.initializeApp(
  options: DefaultFirebaseOptions.currentPlatform,
);
```

---

## 🛡️ حماية البيانات الحساسة

### 1. تشفير البيانات في Firestore
لتشفير البيانات الحساسة قبل تخزينها:
```typescript
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
const iv = crypto.randomBytes(16);

function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encrypted: string): string {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### 2. استخدام Firebase Security Rules
تأكد من أن قواعد Firestore صارمة:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. التحقق من المصدر (Source Verification)
في Cloud Functions، تحقق من مصدر الطلب:
```typescript
export const generateSignal = functions.https.onRequest(async (req, res) => {
  // تحقق من الـ Origin
  const allowedOrigins = ['https://your-domain.com'];
  const origin = req.headers.origin;

  if (!allowedOrigins.includes(origin)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  // بقية الكود...
});
```

---

## 📋 قائمة التحقق قبل النشر

قبل نشر المشروع، تأكد من:

- [ ] جميع الأسرار في Firebase Functions Config (ليست في الكود)
- [ ] `.env.local` في `.gitignore`
- [ ] مفاتيح API Production فقط (مفاتيح live وليست test)
- [ ] IP Addresses مقيدة في APIs
- [ ] قواعد Firestore أمنة
- [ ] Webhook Secret من Stripe مضبوط
- [ ] نسخ احتياطي لقاعدة البيانات مفعّل
- [ ] مراقبة وإشعارات مفعّلة

---

## 🚨 الاستجابة للاختراق

إذا كنت تشك في اختراق:

1. **فوراً**:
   - قم بإبطال جميع API Keys
   - غيّر كلمات المرور
   - راقب السجلات

2. **خلال 24 ساعة**:
   - قم بتدوير المفاتيح
   - راجع قواعد الأمان
   - راجع Logs

3. **خلال أسبوع**:
   - قم بمراجعة شاملة للنظام
   - نفذ اختبار اختراق
   - حدّث سياسات الأمان

---

## 📞 موارد إضافية

- [Firebase Security Best Practices](https://firebase.google.com/docs/security)
- [Stripe Security Guide](https://stripe.com/docs/security)
- [Binance API Security](https://binance-docs.github.io/apidocs/spot/en/#api-key)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)

---

⚠️ **تنبيه أخير**: الأمان هو مسؤولية مستمرة. راقب النظام بانتظام وحدّث الإجراءات الأمنية حسب الحاجة.
