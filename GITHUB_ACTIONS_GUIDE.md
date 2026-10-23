# 🚀 دليل GitHub Actions - البناء التلقائي

## نظرة عامة
يستخدم المشروع GitHub Actions لبناء نسخ Android و Web تلقائياً عند كل دفع (push) إلى الفرع الرئيسي. بما أنك قمت بربط الكود في GitHub، سيتم استخدام السحابة لبناء المشروع تلقائياً.

---

## 🌟 لماذا GitHub Actions؟

### الفوائد:
- ✅ بناء تلقائي موثوق
- ✅ توفير الوقت والجهد
- ✅ اكتشاف الأخطاء مبكراً
- ✅ نشر سهل وسريع
- ✅ عدم الحاجة لبيئة بناء محلية
- ✅ بناء متس عبر مختلف الأجهزة

### البناء في السحابة:
- يتم البناء على خوادم GitHub
- لا حاجة لتثبيت Flutter أو Node.js محلياً
- البناء يتم تلقائياً عند كل push
- النتائج متاحة للتنزيل فوراً

---

## 📋 الـ Workflows المتاحة

### 1. Build Android APK
**الملف**: `.github/workflows/build-android.yml`

**المهام**:
- بناء APK Release للإنتاج
- بناء APK Debug للتطوير
- رفع الـ APKs كـ Artifacts
- (اختياري) رفع إلى Firebase App Distribution

**الحداث**: يتم تشغيله عند:
- Push إلى `main` أو `develop`
- Pull Request إلى `main`
- تشغيل يدوي (workflow_dispatch)

**المدة**: ~5-10 دقائق

---

### 2. Build Web App
**الملف**: `.github/workflows/build-web.yml`

**المهام**:
- بناء تطبيق الويب (Release)
- رفع البناء كـ Artifact
- نشر تلقائي إلى Firebase Hosting (عند push إلى main)
- بناء ونشر Cloud Functions

**الحداث**: يتم تشغيله عند:
- Push إلى `main` أو `develop`
- Pull Request إلى `main`
- تشغيل يدوي (workflow_dispatch)

**المدة**: ~3-5 دقائق

---

## 🔑 إعداد الأسرار في GitHub Secrets

### ⚠️ ملاحظة هامة
الأسرار في GitHub Secrets تُستخدم للبناء التلقائي فقط. لا تحتاج لمشاركتها معي. يمكنك إضافتها بنفسك في GitHub.

### الخطوة 1: الذهاب إلى GitHub Secrets
1. اذهب إلى مستودع المشروع على GitHub
2. اضغط على `Settings`
3. اضغط على `Secrets and variables` > `Actions`
4. اضغط على `New repository secret`

### الخطوة 2: إضافة الأسرار المطلوبة

#### للبناء Android:
```
FIREBASE_APP_ID_ANDROID
```
- **الوصف**: معرف تطبيق Firebase لنظام Android
- **كيفية الحصول عليه**:
  1. اذهب إلى Firebase Console
  2. Project Settings > General
  3. في قسم Your apps، انسخ App ID للتطبيق Android

#### للبناء Web:
```
FIREBASE_PROJECT_ID
```
- **الوصف**: معرف مشروع Firebase
- **كيفية الحصول عليه**:
  1. اذهب إلى Firebase Console
  2. Project Settings > General
  3. انسخ Project ID

```
FIREBASE_TOKEN
```
- **الوصف**: توكن Firebase CLI للنشر
- **كيفية الحصول عليه**:
  ```bash
  firebase login:ci
  ```
  سيتم فتح المتصفح وسيظهر توكن. انسخه وأضفه كـ Secret.

```
FIREBASE_SERVICE_CREDENTIALS
```
- **الوصف**: بيانات اعتماد خدمة Firebase بصيغة JSON
- **كيفية الحصول عليه**:
  1. اذهب إلى Firebase Console
  2. Project Settings > Service Accounts
  3. انقر على "Generate new private key"
  4. حمّل ملف JSON
  5. انسخ محتوى الملف بالكامل وأضفه كـ Secret

---

## � إدارة الأسرار للبناء السحابي

### الأسرار في GitHub Secrets
هذه الأسرار خاصة بـ GitHub فقط وتُستخدم للبناء التلقائي. **لا تحتاج لمشاركتها معي**.

### الأسرار في ملف .env المحلي
هذه الأسرار تُستخدم للتطوير المحلي فقط. يمكنك مشاركتها معي للإعداد.

### الأسرار في Firebase Functions Config
هذه الأسرار تُستخدم في الإنتاج. يمكنك مشاركتها معي للإعداد.

### التوصية
1. **للتجربة السريعة**: استخدم ملف `.env` محلي وشاركه معي
2. **للإنتاج**: استخدم Firebase Functions Config
3. **للبناء التلقائي**: استخدم GitHub Secrets (أضفها بنفسك)

راجع دليل إدارة الأسرار في بيئة التطوير: <ref_file file="C:\Users\ب\Desktop\crypto-trading-system\DEV_ENVIRONMENT_SECRETS.md" />

---

## �🛠️ كيفية العمل مع GitHub Actions

### البناء المحلي قبل الرفع
قبل دفع الكود، من الأفضل البناء محلياً للتأكد من عدم وجود أخطاء:

```bash
# بناء Android
cd app
flutter build apk --release

# بناء Web
flutter build web --release
```

### الدفع والبناء التلقائي
عند دفع الكود إلى GitHub:
```bash
git add .
git commit -m "Add new feature"
git push origin main
```

سيتم تشغيل GitHub Actions تلقائياً.

### مراقبة البناء
1. اذهب إلى مستودع المشروع على GitHub
2. اضغط على `Actions`
3. راقب حالة الـ Workflows

### تنزيل الـ Artifacts
1. بعد اكتمال البناء، اضغط على الـ Workflow
2. في قسم Artifacts، انقر على الـ Artifact المطلوب
3. سيتم تنزيله تلقائياً

---

## 📱 نشر تطبيق Android

### الطريقة 1: عبر Firebase App Distribution (موصى به)
1. تأكد من إضافة `FIREBASE_APP_ID_ANDROID` و `FIREBASE_SERVICE_CREDENTIALS`
2. عند اكتمال البناء، سيتم رفع الـ APK تلقائياً إلى Firebase App Distribution
3. يمكنك دعوة المختبرين عبر Firebase Console

### الطريقة 2: تنزيل وتوزيع يدوي
1. تنزيل الـ Artifact من GitHub Actions
2. توزيعه على المختبرين أو رفعه إلى Google Play Console

### للإنتاج على Google Play
لرفع التطبيق إلى Google Play Store، تحتاج إلى:
1. إنشاء حساب Google Play Developer ($25)
2. إنشاء تطبيق في Google Play Console
3. رفع الـ APK أو AAB
4. ملء المعلومات المطلوبة
5. نشر التطبيق

---

## 🌐 نشر تطبيق الويب

### النشر التلقائي
عند دفع الكود إلى فرع `main`:
1. سيتم بناء تطبيق الويب
2. سيتم نشره تلقائياً إلى Firebase Hosting
3. سيكون متاحاً على: `https://your-project.web.app`

### النشر اليدوي
إذا كنت تريد النشر من جهازك:
```bash
firebase deploy --only hosting
```

---

## 🔧 تخصيص الـ Workflows

### تغيير إصدار Flutter
في ملف `.github/workflows/build-android.yml`:
```yaml
- name: Setup Flutter
  uses: subosito/flutter-action@v2
  with:
    flutter-version: '3.16.0'  # غيّر هذا الرقم
    channel: 'stable'
```

### تغيير وقت الاحتفاظ بالـ Artifacts
```yaml
- name: Upload APK
  uses: actions/upload-artifact@v4
  with:
    name: release-apk
    path: app/build/app/outputs/flutter-apk/app-release.apk
    retention-days: 30  # غيّر هذا الرقم
```

### إضافة متغيرات بيئة
```yaml
- name: Build APK (Release)
  working-directory: ./app
  run: flutter build apk --release
  env:
    ENV_VAR: value
```

---

## 🐛 استكشاف الأخطاء

### فشل البناء بسبب التبعيات
```bash
# تأكد من تحديث pubspec.yaml
flutter pub get

# تأكد من عدم وجود تبعيات محظورة
flutter pub outdated
```

### فشل النشر إلى Firebase
1. تأكد من صحة `FIREBASE_TOKEN`
2. تأكد من صحة `FIREBASE_SERVICE_CREDENTIALS`
3. تأكد من أن Project ID صحيح

### فشل النشر إلى Firebase App Distribution
1. تأكد من إضافة `FIREBASE_APP_ID_ANDROID`
2. تأكد من أن التطبيق موجود في Firebase Console

---

## 📊 تحسينات إضافية

### إضافة اختبارات
يمكنك إضافة خطوة لتشغيل الاختبارات قبل البناء:
```yaml
- name: Run tests
  working-directory: ./app
  run: flutter test
```

### إضافة Code Analysis
```yaml
- name: Analyze code
  working-directory: ./app
  run: flutter analyze
```

### إشاء Release Notes
يمكنك إنشاء Release Notes تلقائياً:
```yaml
- name: Create Release
  uses: actions/create-release@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    tag_name: v${{ github.run_number }}
    release_name: Release v${{ github.run_number }}
    draft: false
    prerelease: false
```

---

## 🔄 CI/CD Flow الكامل

```
Developer Push Code
    ↓
GitHub Actions Triggered
    ↓
Checkout Code
    ↓
Setup Flutter & Java
    ↓
Install Dependencies
    ↓
Run Tests (Optional)
    ↓
Build APK / Web
    ↓
Upload Artifacts
    ↓
Deploy to Firebase (if main branch)
    ↓
Notify Developer (Optional)
```

---

## 📞 المساعدة

إذا واجهت أي مشاكل:
1. راجع Logs في GitHub Actions
2. تأكد من صحة الأسرار
3. راجع الوثائق الرسمية:
   - [GitHub Actions Documentation](https://docs.github.com/en/actions)
   - [Flutter Build Documentation](https://flutter.dev/docs/deployment/android)
   - [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)

---

⚠️ **ملاحظة مهمة**: تأكد من عدم الالتزام بالأسرار في الكود. استخدم GitHub Secrets فقط.
