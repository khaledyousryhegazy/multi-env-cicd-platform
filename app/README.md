# أكاديمية نور القرآن — Nur Al-Quran Academy

منصة إرشاد وتحفيظ قرآن: Next.js (Frontend) + Node.js/Express (Backend) + PostgreSQL.

## البنية

```
nur-al-quran/
├── backend/      Express API + PostgreSQL
└── frontend/     Next.js (App Router)
```

## 1) تجهيز قاعدة البيانات

```bash
createdb nur_al_quran
cd backend
cp .env.example .env    # عدّل بيانات الاتصال إذا لزم
psql -d nur_al_quran -f db/schema.sql
npm install
npm run seed             # يملأ جدول السور بالـ114 سورة
node db/create-mentor.js "اسم المرشد" "mentor@example.com" "password123" "نبذة تعريفية"
```

## 2) تشغيل الباك اند

```bash
cd backend
npm install
npm run dev     # http://localhost:4000
```

## 3) تشغيل الفرونت اند

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev     # http://localhost:3000
```

## الصفحات

| الصفحة | الوصف |
|---|---|
| `/` | الصفحة الرئيسية |
| `/about` | نبذة عن المرشد (بيانات من الباك اند) |
| `/reservations` | حجز موعد بناءً على جدول توفر المرشد |
| `/progress` | الطالب يبحث ببريده ويشوف تقدمه في السور الـ114 |
| `/dashboard` | تسجيل دخول المرشد لإدارة الحجوزات وتحديث تقدم الطلاب |

## ملاحظات

- المنصة مصممة لمرشد واحد (single-mentor academy) — حساب المرشد يُنشأ يدوياً بسكريبت `create-mentor.js`، لا يوجد تسجيل عام للمرشدين.
- المصادقة بـ JWT للمسارات المحمية فقط (الحجوزات وتحديث التقدم من طرف المرشد).
- لإضافة مواعيد توفر المرشد الأسبوعية، استخدم `POST /api/availability` بعد تسجيل الدخول (مثال عبر curl أو Postman)، أو أضفها مباشرة في جدول `availability`.
