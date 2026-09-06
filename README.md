# ديوان عائلة الجنادا - عشيرة الزيود

نظام بسيط وأنيق لتسجيل بيانات أبناء عائلة الجنادا، يعتمد على **Google Sheets** و **Google Apps Script** فقط.

## يتكوّن النظام من

1. **الصفحة الرئيسية**: نموذج لتعبئة البيانات وإرسالها إلى Google Sheets.
2. **صفحة الإدارة** `/admin`: محمية بكلمة مرور بسيطة، تعرض:
   - بطاقة إحصائيات (عدد المسجلين)
   - جدول البيانات مع بحث بالاسم أو الرقم الوطني
   - إضافة سجل جديد (بنفس حقول نموذج التسجيل مع منع تكرار الرقم الوطني)
   - تعديل البيانات
   - حذف البيانات مع رسالة تأكيد
   - تحديث البيانات
   - تصدير Excel

> نظام خفيف بدون أي تعقيد إضافي (لا رسوم بيانية، لا جلسات).

---

## التقنيات

React + Vite + Tailwind CSS + Framer Motion + React Hook Form + Zod + Axios + Lucide Icons

---

## التشغيل المحلي

```bash
npm install
npm run dev
```

ثم افتح `http://localhost:5173`

## البناء للنشر

```bash
npm run build
npm run preview
```

---

## ضبط كلمة مرور الإدارة

أنشئ ملف `.env` في جذر المشروع (من `.env.example`):

```env
VITE_ADMIN_PASSWORD=كلمة_مرور_قوية
VITE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbz1KD9NrUB0dIVkaq6NPKKVbK7hMpmlvBQp2ROw9SUVQp52Yo_oqwEJskltj6h8cyDo/exec
```

> **مهم:** غيّر كلمة المرور قبل النشر، واجعلها مطابقة لـ `ADMIN_PASSWORD` داخل `google-apps-script/Code.gs`.

---

## ربط Google Apps Script

1. افتح [script.google.com](https://script.google.com) وافتح مشروعك.
2. استبدل محتوى `Code.gs` بالمحتوى الموجود في `google-apps-script/Code.gs`.
3. من Project Settings، تأكد من إعدادات النشر:
   ```json
   { "webapp": { "executeAs": "USER_DEPLOYING", "access": "ANYONE_ANONYMOUS" } }
   ```
4. اضغط **Deploy × New deployment × Web app**.
5. انسخ رابط `/exec` وضعه في `VITE_SCRIPT_URL` بملف `.env`.

## إعداد الجدول

أعمدة الورقة (`Sheet1`) بالترتيب (12 عموداً - لا عمود ID، والرقم الوطني هو المفتاح الفريد):

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|----|----|----|----|----|----|----|----|----|----|
| تاريخ التسجيل | الاسم الرباعي | الرقم الوطني | تاريخ الميلاد | الحالة الاجتماعية | المؤهل العلمي | التخصص | طبيعة العمل | مكان السكن | رقم الهاتف | نوع الدم | مشترك بالجمعية |

---

## النشر على Netlify

1. من المتصفح: افتح [app.netlify.com/drop](https://app.netlify.com/drop)
2. نفّذ `npm run build` واسحب مجلد `dist` إلى الصفحة.
3. من **Site settings × Environment variables** أضف:
   ```
   VITE_ADMIN_PASSWORD
   VITE_SCRIPT_URL
   ```
4. أعد بناء الموقع من Netlify بعد ضبط المتغيرات.

> يمكنك أيضاً الربط عبر GitHub مع إعدادات البناء التالية:
> **Build command:** `npm run build` — **Publish directory:** `dist`

---

## استبدال شعار العائلة

ضع شعارك بصيغة SVG في `src/assets/logo.svg` وسيظهر تلقائياً أعلى الصفحة.

---

## البنية

```
src/
├── components/
│   ├── home/          # الشعار والترحيب والنموذج ونافذة النجاح
│   └── ui/            # مكونات واجهة جاهزة (Button, Input, Select...)
├── pages/
│   ├── HomePage.jsx   # الصفحة الرئيسية
│   └── AdminPage.jsx  # صفحة الإدارة (كلمة مرور + إحصائيات + جدول)
├── schemas/           # التحقق من صحة النموذج (Zod)
├── services/
│   ├── api.js         # التواصل مع Google Apps Script
│   └── excel.js       # تصدير Excel
├── types/             # قوائم الخيارات وأعمدة الجدول
└── utils/             # أدوات تحقق وتنسيق

google-apps-script/
└── Code.gs            # كود الخادم (إضافة/قراءة/تعديل/حذف)
```