# ترتيب تنفيذ المشروع من البداية للنهاية

هذا الملف يوضح ترتيب تنفيذ المشروع **فايل فايل** لو هتكتبه يدوي من الصفر.

الفكرة: لا تبدأ بالصفحات مباشرة. ابدأ من ملفات التشغيل والإعداد، ثم الاتصال بالـ API، ثم الـ auth، ثم الـ routes، ثم المكونات المشتركة، ثم الصفحات.

---

## رسم 2D لترتيب الشغل

```txt
+----------------+
|  package.json  |
+-------+--------+
        |
        v
+----------------+
|     .env       |
+-------+--------+
        |
        v
+----------------+
| vite.config.js |
+-------+--------+
        |
        v
+----------------+
|   index.html   |
+-------+--------+
        |
        v
+----------------+
|   index.css    |
+-------+--------+
        |
        v
+----------------+
|    main.jsx    |
+-------+--------+
        |
        v
+----------------+
| apiClient.js   |
+-------+--------+
        |
        v
+----------------+
|   authApi.js   |
+-------+--------+
        |
        v
+----------------+
|  casesApi.js   |
+-------+--------+
        |
        v
+----------------+
| dateUtils.js   |
+-------+--------+
        |
        v
+----------------+
| caseUtils.js   |
+-------+--------+
        |
        v
+--------------------+
| AuthContext.jsx    |
+--------+-----------+
         |
         v
+----------------------+
| ProtectedRoute.jsx   |
+---------+------------+
          |
          v
+----------------+
|    App.jsx     |
+-------+--------+
        |
        v
+-------------------+
| LoadingState.jsx  |
+--------+----------+
         |
         v
+----------------+
| ErrorState.jsx |
+-------+--------+
        |
        v
+----------------+
| EmptyState.jsx |
+-------+--------+
        |
        v
+----------------------+
| DifficultyBadge.jsx  |
+---------+------------+
          |
          v
+----------------+
|   Avatar.jsx   |
+-------+--------+
        |
        v
+----------------+
|  CaseIcon.jsx  |
+-------+--------+
        |
        v
+----------------+
|  Sidebar.jsx   |
+-------+--------+
        |
        v
+----------------+
|   Topbar.jsx   |
+-------+--------+
        |
        v
+----------------+
| AppLayout.jsx  |
+-------+--------+
        |
        v
+----------------+
|   Login.jsx    |
+-------+--------+
        |
        v
+----------------+
|    Home.jsx    |
+-------+--------+
        |
        v
+----------------+
|  Profile.jsx   |
+-------+--------+
        |
        v
+----------------+
|   Cases.jsx    |
+-------+--------+
        |
        v
+-------------------+
| CaseDetails.jsx   |
+--------+----------+
         |
         v
+----------------+
|   README.md    |
+----------------+
```

---

## الترتيب العملي فايل فايل

### 1. `package.json`

ابدأ به لأنه بيحدد المشروع نفسه:

- اسم المشروع.
- أوامر التشغيل.
- مكتبات React و Vite.
- مكتبات `axios`, `react-router-dom`, `react-hot-toast`, `lucide-react`.
- مكتبات Tailwind.

---

### 2. `.env`

بعد `package.json` مباشرة، حط رابط الـ API:

```env
VITE_API_BASE_URL=https://testingapi.alrowadit.com
```

---

### 3. `.env.example`

نسخة توضيحية من `.env` لأي شخص هيشغل المشروع.

---

### 4. `.gitignore`

اكتبه بدري عشان تمنع رفع ملفات زي:

- `node_modules`
- `dist`
- ملفات البيئة المحلية.

---

### 5. `vite.config.js`

هنا تربط Vite مع:

- React plugin.
- Tailwind plugin.

---

### 6. `index.html`

ملف HTML الأساسي وفيه:

```html
<div id="root"></div>
```

---

### 7. `index.css`

اكتب فيه:

- استيراد Tailwind.
- ألوان عامة.
- خط عام.
- Scrollbar.
- إعدادات `body`.

---

### 8. `main.jsx`

ده مدخل React الأساسي.

هنا تربط:

- `BrowserRouter`
- `AuthProvider`
- `App`

---

### 9. `apiClient.js`

ده من أهم ملفات المشروع.

اكتب فيه:

- Axios instance.
- `baseURL` من `.env`.
- قراءة token من `localStorage`.
- إضافة `Authorization` header تلقائيا.
- التعامل مع `401`.
- function لاستخراج رسالة الخطأ.

---

### 10. `authApi.js`

بعد ما `apiClient.js` يخلص، اعمل ملف auth.

اكتب فيه:

- طلب تسجيل الدخول.
- طلب بيانات المستخدم الحالي.

---

### 11. `casesApi.js`

بعد auth API، اعمل API الحالات.

اكتب فيه:

- طلب كل الحالات.
- طلب تفاصيل حالة واحدة بالـ ID.
- توحيد شكل response لو رجع array أو object.

---

### 12. `dateUtils.js`

اكتبه قبل الصفحات لأنه هيتستخدم في عرض التاريخ.

مثلا:

- `Today`
- `Yesterday`
- `2 days ago`
- `1 week ago`

---

### 13. `caseUtils.js`

ده ملف مهم جدا قبل بناء الواجهة.

اكتب فيه:

- توحيد شكل الحالة القادمة من API.
- توحيد difficulty.
- تجهيز patient label.
- تجهيز questions.
- حساب الإحصائيات.
- اختصار النصوص الطويلة.

---

### 14. `AuthContext.jsx`

بعد API والـ utils، اعمل auth state.

اكتب فيه:

- حفظ token.
- قراءة token.
- login.
- logout.
- refresh user.
- `isAuthenticated`.

---

### 15. `ProtectedRoute.jsx`

بعد `AuthContext.jsx` مباشرة.

وظيفته:

- لو مفيش token يروح `/login`.
- لو فيه token يعرض الصفحة.

---

### 16. `App.jsx`

بعد ما الـ auth والـ protected route جاهزين.

اكتب فيه كل routes:

- `/`
- `/login`
- `/home`
- `/profile`
- `/cases`
- `/cases/:caseId`
- route للـ 404.

---

### 17. `LoadingState.jsx`

أول shared component.

هيستخدم في:

- Dashboard.
- Cases.
- Case details.

---

### 18. `ErrorState.jsx`

اعمله بعد loading.

هيستخدم عند فشل API request.

---

### 19. `EmptyState.jsx`

اعمله لحالات:

- لا توجد حالات.
- لا توجد نتائج بحث.

---

### 20. `DifficultyBadge.jsx`

اعمله قبل صفحات الحالات.

وظيفته يعرض:

- Easy أخضر.
- Medium أصفر.
- Hard أحمر.

---

### 21. `Avatar.jsx`

مكون بسيط لصورة المستخدم في:

- Topbar.
- Profile card.
- صفحة Profile الكبيرة.

---

### 22. `CaseIcon.jsx`

مكون أيقونة الحالة.

يستخدم في:

- Dashboard recent cases.
- Cases table.
- Case details header.

---

### 23. `Sidebar.jsx`

بعد المكونات المشتركة.

اكتب فيه:

- Logo.
- Dashboard link.
- Medical Cases link.
- Profile link.
- Logout button.

---

### 24. `Topbar.jsx`

بعد Sidebar.

اكتب فيه:

- Search input.
- Notifications icon.
- Theme icon.
- User data.

---

### 25. `AppLayout.jsx`

بعد Sidebar و Topbar.

ده يركب التصميم العام:

- Sidebar.
- Topbar.
- مكان الصفحة الحالية.

---

### 26. `Login.jsx`

ابدأ الصفحات بـ login.

لأن باقي المشروع كله يعتمد على نجاحه.

اكتب فيه:

- form.
- validation.
- login API call.
- حفظ token.
- toast.
- redirect إلى `/home`.

---

### 27. `Home.jsx`

بعد login.

اكتب فيه:

- جلب بيانات المستخدم.
- جلب الحالات.
- حساب الإحصائيات.
- عرض recent cases.
- عرض profile مختصر.
- quick actions.
- زر View Profile يروح إلى `/profile`.

---

### 28. `Profile.jsx`

بعد Dashboard مباشرة، اعمل صفحة البروفايل المستقلة.

اكتب فيه:

- عنوان الصفحة `My Profile`.
- كارت `Profile Information`.
- صورة المستخدم الكبيرة.
- زر `Change Avatar`.
- بيانات المستخدم:
  - Full Name
  - Email Address
  - Role
  - Member Since
  - Account Type
- زر `Edit Profile`.
- كارت `About Your Account`.
- فورم `Change Password`.
- كارت `Account Statistics`.
- كارت `Account Actions`.
- أزرار البروفايل تكون UI actions مع toast فقط، لأن التاسك لا يحتوي endpoints لتعديل البروفايل أو تغيير كلمة المرور.

---

### 29. `Cases.jsx`

بعد Dashboard.

اكتب فيه:

- جلب كل الحالات.
- search.
- difficulty filter.
- clear filters.
- cases table.
- زر View Case.

---

### 30. `CaseDetails.jsx`

آخر صفحة أساسية.

اكتب فيه:

- قراءة `caseId`.
- جلب تفاصيل الحالة.
- عرض complaint.
- عرض patient info.
- عرض history.
- عرض examination.
- عرض questions.
- عرض diagnosis.
- زر back.

---

### 31. `README.md`

اكتبه في الآخر أو حدثه في الآخر.

لا تكتبه قبل ما تفهم شكل المشروع النهائي.

يشرح:

- فكرة المشروع.
- طريقة التشغيل.
- المكتبات.
- API.
- routes.
- test plan.

---

## بعد الانتهاء من الملفات

شغل:

```bash
npm install
```

ثم:

```bash
npm run dev
```

ثم اختبر:

```txt
/login
/home
/profile
/cases
/cases/1
```

وفي الآخر شغل:

```bash
npm run build
```

---

## ملاحظة مهمة

`package-lock.json` لا تكتبه يدوي.

هذا الملف يتولد تلقائيا بعد:

```bash
npm install
```
