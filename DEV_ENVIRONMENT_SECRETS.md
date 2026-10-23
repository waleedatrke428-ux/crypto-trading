# 🔐 دليل إدارة الأسرار في بيئة التطوير

## نظرة عامة
بما أنك قمت بربط الكود في GitHub، سنستخدم السحابة لبناء المشروع تلقائياً. هذا الدليل يشرح كيفية إدارة الأسرار بشكل آمن في بيئة التطوير.

---

## 🚨 مبدأ أساسي: لا ترسل الأسرار مباشرة في المحادثة

⚠️ **هام جداً**: لا ترسل مفاتيح API أو أسراراً حساسة مباشرة في المحادثة. بدلاً من ذلك، استخدم إحدى الطرق التالية الآمنة.

---

## 📍 الطرق الآمنة لتزويدي بالأسرار

### الطريقة 1: استخدام ملف .env محلي (الموصى بها للتجربة السريعة)

#### الخطوات:
1. أنشئ ملف `.env` في جذر المشروع
2. أضف الأسرار هناك
3. أرسل لي الملف (لأنه محلي، لن يُلتزم في Git)
4. سأقرأه وأحدث الإعدادات

#### مثال:
```bash
# في جذر المشروع
cat > .env << EOF
TELEGRAM_BOT_TOKEN=your-actual-token-here
BINANCE_API_KEY=your-actual-key-here
BINANCE_API_SECRET=your-actual-secret-here
COINBASE_API_KEY=your-actual-key-here
COINBASE_API_SECRET=your-actual-secret-here
BYBIT_API_KEY=your-actual-key-here
BYBIT_API_SECRET=your-actual-secret-here
STRIPE_SECRET_KEY=sk_test_your-key-here
STRIPE_PUBLISHABLE_KEY=pk_test_your-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-secret-here
EOF
```

#### كيفية تزويدي به:
- شارك محتوى الملف معي في المحادثة
- أو قم بقراءته محلياً وأخبرني بالقيم
- سيكون الملف في جهازك فقط ولن يُرفع إلى GitHub

---

### الطريقة 2: استخدام Firebase Functions Config (للإنتاج)

#### الخطوات:
1. قم بإعداد الأسرار في Firebase Console
2. أرسل لي القيم عبر أي طريقة آمنة
3. سأستخدم Firebase CLI لإعدادها

#### أوامر إعداد الأسرار:
```bash
# Telegram Bot
firebase functions:config:set telegram.token="YOUR_TOKEN"

# Binance
firebase functions:config:set binance.api_key="YOUR_KEY"
firebase functions:config:set binance.api_secret="YOUR_SECRET"

# Coinbase
firebase functions:config:set coinbase.api_key="YOUR_KEY"
firebase functions:config:set coinbase.api_secret="YOUR_SECRET"
firebase functions:config:set coinbase.api_passphrase="YOUR_PASSPHRASE"

# Bybit
firebase functions:config:set bybit.api_key="YOUR_KEY"
firebase functions:config:set bybit.api_secret="YOUR_SECRET"

# Stripe
firebase functions:config:set stripe.secret_key="sk_test_..."
firebase functions:config:set stripe.publishable_key="pk_test_..."
firebase functions:config:set stripe.webhook_secret="whsec_..."
```

#### كيفية تزويدي به:
- شارك القيم معي بشكل منفصل (مثلاً: "Telegram token: 123456789:ABC...")
- سأقوم بإعدادها لك باستخدام الأوامر أعلاه

---

### الطريقة 3: استخدام GitHub Secrets (للبناء التلقائي)

#### الخطوات:
1. اذهب إلى GitHub Repository
2. Settings > Secrets and variables > Actions
3. أضف الأسرار واحدة تلو الأخرى
4. لا تخبرني بالقيم (لأنها في GitHub فقط)

#### الأسرار المطلوبة في GitHub:
```
FIREBASE_PROJECT_ID
FIREBASE_TOKEN
FIREBASE_SERVICE_CREDENTIALS
FIREBASE_APP_ID_ANDROID
```

#### ملاحظة:
- هذه الأسرار خاصة بـ GitHub فقط
- لا تحتاج لمشاركتها معي
- GitHub Actions سيستخدمها تلقائياً

---

### الطريقة 4: استخدام ملف JSON مشفر (متقدم)

#### الخطوات:
1. أنشئ ملف `secrets.json` مع الأسرار
2. شفره باستخدام كلمة مرور
3. أرسل الملف المشفر وكلمة المرور بشكل منفصل

#### مثال:
```bash
# إنشاء ملف الأسرار
cat > secrets.json << EOF
{
  "telegram": {
    "token": "your-token"
  },
  "binance": {
    "apiKey": "your-key",
    "apiSecret": "your-secret"
  }
}
EOF

# تشفير الملف
openssl enc -aes-256-cbc -salt -in secrets.json -out secrets.json.enc

# إرسال الملف المشفر + كلمة المرور
```

---

## 🎯 الطريقة الموصى بها لك

بما أنك تريد تجربة النظام بسرعة، أنصحك بـ:

### للتجربة السريعة:
1. أنشئ ملف `.env` محلي
2. أضف الأسرار الأساسية فقط:
   - `TELEGRAM_BOT_TOKEN`
   - `BINANCE_API_KEY`
   - `BINANCE_API_SECRET`
3. شارك المحتوى معي
4. سأقوم بإعدادها في الكود

### للإنتاج:
1. استخدم Firebase Functions Config
2. أرسل القيم بشكل منفصل
3. سأقوم بإعدادها للأمان

---

## 📋 قائمة الأسرار المطلوبة

### الأسرار الأساسية (للبدء):
```
TELEGRAM_BOT_TOKEN           # مطلوب لبوت تيليجرام
BINANCE_API_KEY             # مطلوب لبيانات السوق
BINANCE_API_SECRET          # مطلوب لبيانات السوق
```

### الأسرار الإضافية (للميزات الكاملة):
```
COINBASE_API_KEY            # اختياري - بيانات إضافية
COINBASE_API_SECRET         # اختياري - بيانات إضافية
COINBASE_API_PASSPHRASE     # اختياري - بيانات إضافية
BYBIT_API_KEY               # اختياري - بيانات إضافية
BYBIT_API_SECRET            # اختياري - بيانات إضافية
```

### أسرار الدفع (للاشتراكات):
```
STRIPE_SECRET_KEY           # مطلوب للدفع الإلكتروني
STRIPE_PUBLISHABLE_KEY      # مطلوب للدفع الإلكتروني
STRIPE_WEBHOOK_SECRET       # مطلوب للدفع الإلكتروني
```

### أسرار Firebase (يتم إعدادها من Firebase Console):
```
FIREBASE_PROJECT_ID         # من Firebase Console
FIREBASE_API_KEY            # من Firebase Console
FIREBASE_AUTH_DOMAIN        # من Firebase Console
FIREBASE_DATABASE_URL      # من Firebase Console
FIREBASE_STORAGE_BUCKET     # من Firebase Console
FIREBASE_MESSAGING_SENDER_ID # من Firebase Console
FIREBASE_APP_ID             # من Firebase Console
```

---

## 🔒 كيف سأقوم بإدارة الأسرار

### في الكود:
سأستخدم المتغيرات البيئية للقراءة:
```typescript
// في Cloud Functions
const telegramToken = process.env.TELEGRAM_BOT_TOKEN ||
                       functions.config().telegram.token;

const binanceApiKey = process.env.BINANCE_API_KEY ||
                      functions.config().binance.api_key;
```

### في Firebase:
سأستخدم Firebase Functions Config:
```typescript
const telegramToken = functions.config().telegram.token;
```

### في GitHub Actions:
سأستخدم GitHub Secrets:
```yaml
env:
  FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

---

## 🚨 ممارسات أمان إضافية

### 1. لا تلتزم الأسرار في Git
تأكد من أن `.gitignore` يحتوي على:
```
.env
.env.local
.env.*.local
secrets.json
secrets.json.enc
*.key
*.secret
```

### 2. استخدم مفاتيح مختلفة للتطوير والإنتاج
- للتطوير: استخدم مفاتيح Test/Dev
- للإنتاج: استخدم مفاتيح Live/Prod

### 3. قلل الصلاحيات
- استخدم Read-Only keys عند الإمكان
- قيد الوصول بـ IP Addresses
- استخدم keys مختلفة لكل بيئة

### 4. تدوير المفاتيح
- غيّر المفاتيح كل 90 يوماً
- غيّرها فوراً عند الشك في الاختراق

---

## 📝 مثال عملي: كيف تبدأ

### الخطوة 1: الحصول على Telegram Bot Token
1. اذهب إلى @BotFather في تيليجرام
2. أرسل `/newbot`
3. اتبع التعليمات
4. احصل على التوكن

### الخطوة 2: الحصول على Binance API Keys
1. سجل في Binance
2. اذهب إلى API Management
3. أنشئ API Key
4. احفظ Key و Secret

### الخطوة 3: إنشاء ملف .env
```bash
cat > .env << EOF
TELEGRAM_BOT_TOKEN=your-telegram-token-here
BINANCE_API_KEY=your-binance-key-here
BINANCE_API_SECRET=your-binance-secret-here
EOF
```

### الخطوة 4: مشاركة معي
انسخ محتوى الملف وأرسله لي في المحادثة:
```
TELEGRAM_BOT_TOKEN=123456789:ABC...
BINANCE_API_KEY=ABC123...
BINANCE_API_SECRET=XYZ789...
```

### الخطوة 5: سأقوم بإعدادها
سأقرأ الملف وأحدث الإعدادات في الكود.

---

## 🆘 إذا كانت لديك أي مخاوف أمنية

إذا كنت قلقاً بشأن مشاركة الأسرار:

1. **استخدم الطريقة 2**: Firebase Functions Config
   - أرسل القيم بشكل منفصل
   - سأقوم بإعدادها مباشرة في Firebase

2. **استخدم الطريقة 4**: ملف مشفر
   - شفر الملف بكلمة مرور
   - أرسل الملف المشفر
   - أرسل كلمة المرور بشكل منفصل

3. **قم بالإعداد بنفسك**:
   - اتبع دليل الأمان: <ref_file file="C:\Users\ب\Desktop\crypto-trading-system\SECURITY_GUIDE.md" />
   - أخبرني عندما تنتهي
   - سأتحقق من الإعدادات

---

## ✅ قائمة التحقق

قبل البدء، تأكد من:

- [ ] قرأت دليل الأمان الشامل
- [ ] اخترت طريقة آمنة لمشاركة الأسرار
- [ ] حصلت على مفاتيح API المطلوبة
- [ ] أنشئت ملف .env (اختياري)
- [ ] أضفت .env إلى .gitignore
- [ ] فهمت أن الأسرار لن تُلتزم في Git

---

## 📞 إذا احتجت مساعدة

إذا كنت محتاراً حول أي جزء:

1. **للأسئلة العامة**: اسألني مباشرة
2. **للأسرار الحساسة**: استخدم إحدى الطرق الآمنة
3. **للإعداد التفصيلي**: راجع دليل الأمان

---

## 🎯 الخلاصة

- لا ترسل الأسرار مباشرة في المحادثة
- استخدم ملف .env محلي للتجربة السريعة
- استخدم Firebase Functions Config للإنتاج
- استخدم GitHub Secrets للبناء التلقائي
- أنا هنا لمساعدتك في الإعداد بأمان

---

🔒 **أمانك هو أولويتنا. نحن نستخدم أفضل الممارسات لحماية أسرارك.**
