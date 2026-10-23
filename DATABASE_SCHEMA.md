# 📊 هيكلية قاعدة البيانات (Firestore Schema)

## نظرة عامة
يستخدم النظام Firestore كقاعدة بيانات رئيسية. تم تصميم الجداول بشكل متعارف (Normalized) لضمان الأداء العالي وسهولة الصيانة.

---

## 📁 الجداول الرئيسية

### 1. users (المستخدمين)
يخزن معلومات المستخدمين واشتراكاتهم.

```typescript
{
  uid: string;                    // معرف المستخدم الفريد
  email: string;                 // البريد الإلكتروني
  displayName?: string;          // الاسم المعروض
  photoURL?: string;             // رابط الصورة الشخصية
  createdAt: Timestamp;          // تاريخ إنشاء الحساب
  lastLoginAt: Timestamp;        // آخر تسجيل دخول
  subscription: {
    planId: string;              // معرف الخطة (free, basic, premium)
    status: 'active' | 'cancelled' | 'expired'; // حالة الاشتراك
    startDate: Timestamp;        // تاريخ بدء الاشتراك
    endDate?: Timestamp;         // تاريخ انتهاء الاشتراك
    signalsUsedToday: number;    // عدد الإشارات المستخدمة اليوم
    lastReset: Timestamp;        // آخر إعادة تعيين للعداد
    stripeSubscriptionId?: string; // معرف اشتراك Stripe
  };
  preferences: {
    language: 'ar' | 'en';       // اللغة المفضلة
    notifications: boolean;      // تفعيل الإشعارات
    darkMode: boolean;           // الوضع الليلي
  };
  telegramChatId?: string;       // معرف الدردشة في تيليجرام
}
```

**الفهارس المطلوبة:**
- `subscription.status` (ascending)
- `subscription.planId` (ascending)

---

### 2. signals (الإشارات)
يخزن جميع إشارات التداول المولدة.

```typescript
{
  id: string;                    // معرف الإشارة الفريد
  pair: string;                  // زوج العملات (BTCUSDT, ETHUSDT)
  type: 'SPOT' | 'FUTURES';     // نوع التداول
  signal: 'BUY' | 'SELL' | 'HOLD'; // نوع الإشارة
  confidence: number;           // ثقة الإشارة (0-1)
  entryPrice: number;            // سعر الدخول
  takeProfit: number;            // سعر الهدف
  stopLoss: number;             // سعر وقف الخسارة
  timeframe: string;            // الإطار الزمني (1h, 4h, 1d)
  timestamp: Timestamp;          // وقت إنشاء الإشارة
  indicators: {
    macd: {
      macd: number;
      signal: number;
      histogram: number;
      bullish: boolean;
    };
    rsi: number;                 // قيمة RSI
    fibonacci: {
      high: number;
      low: number;
      levels: object;
    };
    ichimoku: {
      tenkanSen: number;
      kijunSen: number;
      senkouSpanA: number;
      senkouSpanB: number;
      bullish: boolean;
    };
    vwap: number;                // قيمة VWAP
  };
  aiProbability: number;         // احتمالية الذكاء الاصطناعي
  isBroadcasted: boolean;        // هل تم بثها في تيليجرام
}
```

**الفهارس المطلوبة:**
- `timestamp` (descending)
- `pair` (ascending) + `timestamp` (descending)
- `type` (ascending) + `timestamp` (descending)

---

### 3. signal_performance (أداء الإشارات)
يخزن تتبع أداء كل إشارة (نسب النجاح والخسارة).

```typescript
{
  signalId: string;              // معرف الإشارة المرجعي
  pair: string;                  // زوج العملات
  type: 'SPOT' | 'FUTURES';     // نوع التداول
  entryPrice: number;            // سعر الدخول
  takeProfit: number;            // سعر الهدف
  stopLoss: number;             // سعر وقف الخسارة
  signal: 'BUY' | 'SELL';        // نوع الإشارة
  timestamp: Timestamp;          // وقت إنشاء الإشارة
  status: 'PENDING' | 'PROFIT' | 'LOSS' | 'BREAKEVEN'; // حالة الإشارة
  exitPrice?: number;            // سعر الخروج
  profitLoss?: number;           // الربح/الخسارة المطلق
  profitLossPercentage?: number; // نسبة الربح/الخسارة
  duration?: number;             // مدة الصفقة (بالساعات)
  hitTakeProfit?: boolean;       // هل تم الوصول للهدف
  hitStopLoss?: boolean;         // هل تم الوصول لوقف الخسارة
  updatedAt?: Timestamp;        // آخر تحديث
}
```

**الفهارس المطلوبة:**
- `signalId` (ascending) + `status` (ascending)
- `timestamp` (descending)
- `pair` (ascending) + `timestamp` (descending)

---

### 4. subscription_plans (خطط الاشتراك)
يخزن خطط الاشتراك المتاحة.

```typescript
{
  id: string;                    // معرف الخطة (free, basic, premium)
  name: string;                  // اسم الخطة
  nameAr: string;                // اسم الخطة بالعربية
  price: number;                 // السعر
  currency: string;              // العملة (USD)
  interval: 'monthly' | 'yearly'; // فترة الفوترة
  features: string[];            // قائمة الميزات
  featuresAr: string[];          // قائمة الميزات بالعربية
  signalsPerDay: number;         // عدد الإشارات اليومية (-1 للغير محدود)
  chartsAccess: 'limited' | 'unlimited'; // الوصول للشارتات
  aiAnalysis: boolean;           // تحليلات AI
  prioritySupport: boolean;      // دعم مخصص
  stripePriceId?: string;        // معرف السعر في Stripe
  isActive: boolean;             // هل الخطة نشطة
  createdAt: Timestamp;          // تاريخ الإنشاء
  updatedAt: Timestamp;          // آخر تحديث
}
```

---

### 5. payments (المدفوعات)
يخزن سجل المدفوعات.

```typescript
{
  id: string;                    // معرف الدفعة
  userId: string;                // معرف المستخدم
  planId: string;                // معرف الخطة
  amount: number;                // المبلغ
  currency: string;              // العملة
  status: 'pending' | 'completed' | 'failed' | 'refunded'; // حالة الدفعة
  paymentMethod: string;         // طريقة الدفع (stripe)
  stripePaymentIntentId?: string; // معرف الدفعة في Stripe
  timestamp: Timestamp;          // وقت الدفعة
  metadata: {
    planName: string;
    planPrice: number;
  };
}
```

**الفهارس المطلوبة:**
- `userId` (ascending) + `timestamp` (descending)
- `timestamp` (ascending)
- `status` (ascending)

---

### 6. telegram_users (مستخدمي تيليجرام)
يخزن معلومات مستخدمي بوت تيليجرام.

```typescript
{
  chatId: string;                // معرف الدردشة (Document ID)
  userId?: string;               // معرف المستخدم في Firebase (إذا تم الربط)
  username?: string;             // اسم المستخدم في تيليجرام
  firstName?: string;            // الاسم الأول
  lastName?: string;             // الاسم الأخير
  joinedAt: Timestamp;           // تاريخ الانضمام
  subscription: {
    planId: string;              // معرف الخطة
    status: 'active' | 'cancelled';
    signalsUsedToday: number;
    lastReset: Timestamp;
  };
  lastActiveAt: Timestamp;      // آخر نشاط
  isBlocked: boolean;            // هل تم حظر المستخدم
}
```

---

### 7. performance_stats (إحصائيات الأداء)
يخزن إحصائيات الأداء المجمعة.

```typescript
{
  id: string;                    // معرف الإحصائية (Document ID)
  type: 'overall' | 'daily' | 'weekly' | 'monthly'; // نوع الإحصائية
  date: Timestamp;               // التاريخ (للإحصائيات اليومية/الأسبوعية/الشهرية)
  stats: {
    totalSignals: number;
    profitSignals: number;
    lossSignals: number;
    breakevenSignals: number;
    winRate: number;
    totalProfitLoss: number;
    averageProfitLoss: number;
    averageDuration: number;
  };
  byPair: {
    [pair: string]: {
      totalSignals: number;
      winRate: number;
      totalProfitLoss: number;
    };
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### 8. system_logs (سجلات النظام)
يخزن سجلات النظام للأغراض التدقيقية.

```typescript
{
  id: string;                    // معرف السجل (Document ID)
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;               // رسالة السجل
  source: string;                // المصدر (functions, bot, api)
  userId?: string;               // معرف المستخدم (إذا كان متعلق بمستخدم)
  metadata: object;             // بيانات إضافية
  timestamp: Timestamp;          // وقت السجل
}
```

---

## 🔗 العلاقات بين الجداول

```
users (1) ----< (1) signal_performance
users (1) ----< (N) payments
users (1) ----< (1) telegram_users (اختياري)

signals (1) ----< (1) signal_performance
subscription_plans (1) ----< (N) users
subscription_plans (1) ----< (N) payments
```

---

## 📊 استعلامات شائعة

### الحصول على إشارات المستخدم بناءً على اشتراكه
```typescript
const user = await firestore.collection('users').doc(userId).get();
const plan = await firestore.collection('subscription_plans').doc(user.subscription.planId).get();
const limit = plan.signalsPerDay === -1 ? undefined : plan.signalsPerDay;

const signals = await firestore
  .collection('signals')
  .orderBy('timestamp', descending: true)
  .limit(limit || 10)
  .get();
```

### الحصول على تاريخ أداء الإشارات
```typescript
const performance = await firestore
  .collection('signal_performance')
  .where('status', 'in', ['PROFIT', 'LOSS', 'BREAKEVEN'])
  .orderBy('timestamp', descending: true)
  .limit(50)
  .get();
```

### الحصول على إحصائيات الأداء لزوج معين
```typescript
const pairStats = await firestore
  .collection('signal_performance')
  .where('pair', '==', 'BTCUSDT')
  .where('status', 'in', ['PROFIT', 'LOSS'])
  .get();
```

---

## 🔒 قواعد الأمان

تم تعريف قواعد الأمان في `firestore.rules` لضمان:
- المستخدمون يمكنهم قراءة بياناتهم فقط
- الإشارات يمكن قراءتها من قبل المشتركين فقط
- المدفوعات يمكن قراءتها من قبل المستخدم المالك فقط
- الإحصائيات يمكن قراءتها من قبل Admin فقط

---

## 📈 تحسينات الأداء

1. **استخدام الفهارس المركبة**: للتحسين من سرعة الاستعلامات المعقدة
2. **تقسيم البيانات**: استخدام pagination لتقليل حجم البيانات المحملة
3. **التخزين المؤقت**: استخدام Cloud Functions لتجميع الإحصائيات وتخزينها
4. **حذف البيانات القديمة**: استخدام Cloud Scheduler لحذف البيانات القديمة تلقائياً

---

## 🔄 صيانة قاعدة البيانات

### النسخ الاحتياطي التلقائي
يتم نسخ Firestore تلقائياً بواسطة Firebase. يمكن تفعيل النسخ الاحتياطي المخصص من Firebase Console.

### تنظيف البيانات القديمة
```typescript
// Cloud Function لتنظيف الإشارات القديمة
export const cleanupOldSignals = functions.pubsub
  .schedule('0 0 * * *') // يومياً في منتصف الليل
  .onRun(async (context) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90); // 90 يوم

    const oldSignals = await firestore
      .collection('signals')
      .where('timestamp', '<', cutoffDate)
      .get();

    const batch = firestore.batch();
    oldSignals.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  });
```

---

⚠️ **ملاحظة مهمة**: يجب نشر الفهارس المحددة في `firestore.indexes.json` بعد إنشاء قاعدة البيانات.
