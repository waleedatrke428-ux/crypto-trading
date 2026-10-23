# 🚀 نظام التداول الذكي للعملات الرقمية

نظام احترافي ومتكامل لتداول العملات الرقمية والعقود الآجلة، يعتمد كلياً على بيئة سحابية باستخدام Firebase. يدعم **Android** و **Web** فقط.

## ✨ المميزات

### 🤖 الذكاء الاصطناعي
- خوارزمية AI متقدمة للتنبؤ بحركة السوق
- دمج مؤشرات فنية متعددة (MACD, RSI, Fibonacci, Ichimoku, VWAP)
- تعلم آلي لتحسين الدقة مع الوقت

### 📊 المؤشرات الفنية
- **MACD**: تحديد التقاطعات والزخم
- **RSI**: قياس مناطق التشبع الشرائي/البيعي
- **Fibonacci**: حساب مستويات الدعم والمقاومة
- **Ichimoku Cloud**: تحليل الاتجاه العام
- **VWAP**: تحديد السعر العادل المرجح بالحجم

### 📱 البوت والتطبيقات
- **بوت تيليجرام**: استقبال وإرسال الإشارات مع فلترة المحتوى
- **تطبيق Flutter**: يدعم **Android** و **Web**
- **واجهات احترافية**: تصميم عصري وسهل الاستخدام

### 📈 تتبع الأداء
- نظام متقدم لتتبع نسب النجاح والخسارة
- إحصائيات دقيقة لكل إشارة
- تقارير أداء لكل زوج عملات
- حساب معدل الفوز (Win Rate)
- تتبع مدة الصفقات

### 📈 البث الحي
- شارتات حية مع WebSocket
- تحديثات فورية للأسعار
- مؤشرات فنية في الوقت الفعلي

### 💰 نظام الاشتراكات
- **مجاني**: 3 إشارات يومية + شارتات محدودة
- **أساسي ($29/شهر)**: 10 إشارات يومية + شارتات غير محدودة
- **احترافي ($99/شهر)**: إشارات غير محدودة + تحليلات AI مخصصة

### 🔌 تكامل البورصات
- Binance API
- Coinbase API
- Bybit API
- دعم Spot و Futures

### 🎛️ لوحة التحكم الإدارية
- إدارة المستخدمين
- إدارة الاشتراكات
- عرض الإحصائيات
- تتبع الإيرادات
- تقارير الأداء
- **تأكيد الدفع اليدوي** ⭐ جديد
- عرض المدفوعات اليدوية

## 🏗️ البنية المعمارية

```
crypto-trading-system/
├── functions/              # Cloud Functions (Backend)
│   ├── src/
│   │   ├── trading/        # خوارزميات التداول
│   │   │   ├── indicators.ts
│   │   │   ├── ai-algorithm.ts
│   │   │   └── performance-tracker.ts  # تتبع الأداء
│   │   ├── integrations/   # تكامل APIs
│   │   │   ├── binance-api.ts
│   │   │   ├── coinbase-api.ts
│   │   │   └── bybit-api.ts
│   │   ├── telegram/       # بوت تيليجرام
│   │   │   ├── bot.ts
│   │   │   └── content-filter.ts
│   │   ├── subscriptions/  # نظام الاشتراكات
│   │   │   └── plan-manager.ts
│   │   ├── admin/          # API لوحة التحكم
│   │   │   └── dashboard-api.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── app/                    # Flutter App (Android + Web)
│   ├── lib/
│   │   ├── core/           # الإعدادات والثيمات
│   │   │   └── theme/
│   │   ├── features/       # الميزات الرئيسية
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── signals/
│   │   │   ├── charts/
│   │   │   ├── performance/  # عرض الأداء
│   │   │   └── subscriptions/
│   │   ├── services/       # الخدمات
│   │   └── main.dart
│   ├── android/            # إعدادات Android
│   ├── web/                # إعدادات Web
│   └── pubspec.yaml
├── .github/                # GitHub Actions
│   └── workflows/
│       ├── build-android.yml
│       └── build-web.yml
├── firebase.json           # إعدادات Firebase
├── firestore.rules         # قواعد أمان Firestore
├── firestore.indexes.json  # فهارس Firestore
├── DATABASE_SCHEMA.md      # هيكلية قاعدة البيانات
├── SECURITY_GUIDE.md       # دليل الأمان
├── GITHUB_ACTIONS_GUIDE.md # دليل GitHub Actions
└── README.md
```

## 🚀 خطوات التثبيت

### المتطلبات الأساسية
- Node.js 18+
- Flutter 3.0+
- Firebase CLI
- حساب على Firebase Console
- حساب GitHub (للبناء التلقائي)

### 1. إعداد Firebase

راجع دليل الإعداد التفصيلي: <ref_file file="C:\Users\ب\Desktop\crypto-trading-system\SETUP_GUIDE.md" />

```bash
# تثبيت Firebase CLI
npm install -g firebase-tools

# تسجيل الدخول
firebase login

# تهيئة المشروع
firebase init
```

### 2. إعداد Cloud Functions

```bash
cd functions
npm install
npm run build
```

### 3. إعداد تطبيق Flutter (Android + Web)

```bash
cd app
flutter pub get

# Android
flutter run

# Web
flutter run -d chrome
```

### 4. إعداد GitHub Actions

راجع دليل GitHub Actions: <ref_file file="C:\Users\ب\Desktop\crypto-trading-system\GITHUB_ACTIONS_GUIDE.md" />

أضف الأسرار التالية في GitHub Secrets:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_TOKEN`
- `FIREBASE_SERVICE_CREDENTIALS`
- `FIREBASE_APP_ID_ANDROID`

## ⚙️ الإعدادات والأمان

### إدارة الأسرار
راجع دليل الأمان الشامل: <ref_file file="C:\Users\ب\Desktop\crypto-trading-system\SECURITY_GUIDE.md" />

المسارات لإدخال مفاتيح API:
1. **Firebase Functions Config** (للإنتاج) - الطريقة الموصى بها
2. **ملف .env.local** (للتطوير المحلي)
3. **GitHub Secrets** (للبناء التلقائي)

### هيكلية قاعدة البيانات
راجع هيكلية Firestore المفصلة: <ref_file file="C:\Users\ب\Desktop\crypto-trading-system\DATABASE_SCHEMA.md" />

الجداول الرئيسية:
- `users` - المستخدمين والاشتراكات
- `signals` - إشارات التداول
- `signal_performance` - تتبع أداء الإشارات
- `subscription_plans` - خطط الاشتراك
- `payments` - المدفوعات
- `telegram_users` - مستخدمي تيليجرام

## 🔒 الأمان

- مصادقة Firebase Auth
- قواعد Firestore أمنة
- تشفير البيانات في النقل
- فلترة المحتوى في بوت تيليجرام
- إدارة أسرار API الآمنة
- Firebase Functions Config للإنتاج

## 📈 الاستخدام

### تشغيل المشروع محلياً

```bash
# تشغيل Firebase Emulators
firebase emulators:start

# تشغيل Cloud Functions
cd functions && npm run serve

# تشغيل تطبيق Flutter (Android)
cd app && flutter run

# تشغيل تطبيق Flutter (Web)
cd app && flutter run -d chrome
```

### البناء التلقائي عبر GitHub Actions

عند دفع الكود إلى GitHub:
- سيتم بناء APK تلقائياً
- سيتم بناء تطبيق الويب تلقائياً
- سيتم نشر الويب إلى Firebase Hosting (عند push إلى main)

راجع دليل GitHub Actions: <ref_file file="C:\Users\ب\Desktop\crypto-trading-system\GITHUB_ACTIONS_GUIDE.md" />

### النشر على Firebase

```bash
# نشر Cloud Functions
firebase deploy --only functions

# نشر تطبيق الويب
firebase deploy --only hosting

# نشر الكل
firebase deploy
```

## 📊 تتبع الأداء

النظام يتضمن نظام متقدم لتتبع أداء الإشارات:
- نسبة النجاح (Win Rate)
- نسبة الخسارة
- متوسط الربح/الخسارة
- مدة الصفقات
- تتبع حسب زوج العملات

يمكن الوصول إلى هذه البيانات عبر:
- لوحة التحكم الإدارية
- بوت تيليجرام
- تطبيق Flutter (للمشتركين)

## 🎯 خارطة الطريق

- [x] المؤشرات الفنية الأساسية (MACD, RSI, Fibonacci, Ichimoku, VWAP)
- [x] خوارزمية AI بسيطة
- [x] بوت تيليجرام مع فلترة المحتوى
- [x] تطبيق Flutter (Android + Web)
- [x] نظام الاشتراكات (مجاني، أساسي، احترافي)
- [x] نظام تتبع الأداء (نسب النجاح والخسارة)
- [x] تكامل APIs البورصات (Binance, Coinbase, Bybit)
- [x] GitHub Actions للبناء التلقائي
- [x] دليل الأمان الشامل
- [x] هيكلية قاعدة البيانات المفصلة
- [ ] تحسين خوارزمية AI
- [ ] إضافة المزيد من المؤشرات
- [x] نظام إشعارات متقدم
- [x] لوحة تحكم متقدمة
- [x] ميزة تأكيد الدفع اليدوي ⭐ جديد
- [ ] نظام رف الحساب (Backtesting)
- [ ] تحليلات متقدمة ورسوم بيانية

## 📄 الترخيص

هذا المشروع مخصص للاستخدام التعليمي والتجاري. يرجى مراجعة شروط الاستخدام قبل النشر.

## 🤝 المساهمة

نرحب بالمساهمات! يرجى فتح Issue أو Pull Request لتحسين المشروع.

## 📞 الدعم

للاستفسارات والدعم، تواصل معنا عبر:
- البريد الإلكتروني: support@crypto-trading.com
- تيليجرام: @crypto_trading_bot

---

⚠️ **تنبيه**: التداول ينطوي على مخاطر. استخدم هذه الإشارات كمرجع فقط وليس كنصيحة استثمارية.
