# Folder Structure Design

هذا الملف يوضح هيكل المشروع الحالي بشكل مرتب وواضح، بدون `node_modules` و `dist` لأنهم ملفات توليد/اعتمادات وليست جزءا من الكود الذي نكتبه.

---

## 2D Tree

```txt
medical-cases-dashboard/
|
+-- .env
+-- .env.example
+-- .gitignore
+-- index.html
+-- package.json
+-- package-lock.json
+-- vite.config.js
+-- README.md
+-- IMPLEMENTATION_ORDER.md
+-- FOLDER_STRUCTURE.md
|
+-- src/
    |
    +-- main.jsx
    +-- App.jsx
    +-- index.css
    |
    +-- api/
    |   |
    |   +-- apiClient.js
    |   +-- authApi.js
    |   +-- casesApi.js
    |
    +-- context/
    |   |
    |   +-- AuthContext.jsx
    |
    +-- utils/
    |   |
    |   +-- caseUtils.js
    |   +-- dateUtils.js
    |
    +-- components/
    |   |
    |   +-- common/
    |   |   |
    |   |   +-- Avatar.jsx
    |   |   +-- CaseIcon.jsx
    |   |   +-- DifficultyBadge.jsx
    |   |   +-- EmptyState.jsx
    |   |   +-- ErrorState.jsx
    |   |   +-- LoadingState.jsx
    |   |
    |   +-- layout/
    |   |   |
    |   |   +-- AppLayout.jsx
    |   |   +-- Sidebar.jsx
    |   |   +-- Topbar.jsx
    |   |
    |   +-- routes/
    |       |
    |       +-- ProtectedRoute.jsx
    |
    +-- pages/
        |
        +-- Login.jsx
        +-- Home.jsx
        +-- Cases.jsx
        +-- CaseDetails.jsx
        +-- Profile.jsx
```

---

## Root Files

| File | Purpose |
| --- | --- |
| `.env` | يحتوي على رابط الـ API المستخدم في التشغيل المحلي. |
| `.env.example` | نسخة توضيحية من متغيرات البيئة. |
| `.gitignore` | يمنع رفع `node_modules`, `dist`, والملفات غير المطلوبة. |
| `index.html` | HTML entry point وفيه عنصر `root`. |
| `package.json` | تعريف المشروع، scripts، والمكتبات. |
| `package-lock.json` | قفل إصدارات المكتبات بعد `npm install`. |
| `vite.config.js` | إعدادات Vite و Tailwind. |
| `README.md` | شرح المشروع وطريقة تشغيله والتاسك المطلوب. |
| `IMPLEMENTATION_ORDER.md` | ترتيب تنفيذ الملفات لو هتكتب المشروع يدوي. |
| `FOLDER_STRUCTURE.md` | رسم وشرح هيكل المشروع الحالي. |

---

## Source Files

### `src/main.jsx`

نقطة تشغيل React.

يربط:

- `BrowserRouter`
- `AuthProvider`
- `App`

### `src/App.jsx`

ملف الـ routes الأساسي.

يحتوي على:

- `/login`
- `/home`
- `/cases`
- `/cases/:caseId`
- `/profile`
- protected layout
- 404 page

### `src/index.css`

ملف التصميم العام.

يحتوي على:

- Tailwind import
- global styles
- body background
- scrollbar styles

---

## API Layer

```txt
src/api/
|
+-- apiClient.js
+-- authApi.js
+-- casesApi.js
```

| File | Purpose |
| --- | --- |
| `apiClient.js` | Axios instance، baseURL، token interceptor، error helper. |
| `authApi.js` | login و get current user requests. |
| `casesApi.js` | جلب الحالات وجلب تفاصيل حالة واحدة. |

---

## Auth Context

```txt
src/context/
|
+-- AuthContext.jsx
```

`AuthContext.jsx` مسؤول عن:

- حفظ token.
- قراءة token.
- login.
- logout.
- معرفة هل المستخدم logged in.
- تحميل بيانات المستخدم الحالي.

---

## Utilities

```txt
src/utils/
|
+-- caseUtils.js
+-- dateUtils.js
```

| File | Purpose |
| --- | --- |
| `caseUtils.js` | توحيد شكل بيانات الحالات والمستخدم والإحصائيات. |
| `dateUtils.js` | تحويل التاريخ إلى صيغة سهلة مثل `2 days ago`. |

---

## Common Components

```txt
src/components/common/
|
+-- Avatar.jsx
+-- CaseIcon.jsx
+-- DifficultyBadge.jsx
+-- EmptyState.jsx
+-- ErrorState.jsx
+-- LoadingState.jsx
```

هذه components صغيرة قابلة لإعادة الاستخدام في أكثر من صفحة.

| Component | Purpose |
| --- | --- |
| `Avatar.jsx` | صورة/أيقونة المستخدم. |
| `CaseIcon.jsx` | أيقونة الحالة الطبية حسب العنوان. |
| `DifficultyBadge.jsx` | Badge للصعوبة: Easy, Medium, Hard. |
| `EmptyState.jsx` | يظهر عند عدم وجود بيانات. |
| `ErrorState.jsx` | يظهر عند فشل API request. |
| `LoadingState.jsx` | يظهر أثناء تحميل البيانات. |

---

## Layout Components

```txt
src/components/layout/
|
+-- AppLayout.jsx
+-- Sidebar.jsx
+-- Topbar.jsx
```

| Component | Purpose |
| --- | --- |
| `AppLayout.jsx` | يجمع Sidebar و Topbar ومكان الصفحة الحالية. |
| `Sidebar.jsx` | القائمة الجانبية: Dashboard, Medical Cases, Profile, Logout. |
| `Topbar.jsx` | شريط البحث وبيانات المستخدم أعلى الصفحة. |

---

## Route Components

```txt
src/components/routes/
|
+-- ProtectedRoute.jsx
```

`ProtectedRoute.jsx` يمنع دخول الصفحات المحمية بدون token.

لو لا يوجد token:

```txt
redirect -> /login
```

لو يوجد token:

```txt
render protected page
```

---

## Pages

```txt
src/pages/
|
+-- Login.jsx
+-- Home.jsx
+-- Cases.jsx
+-- CaseDetails.jsx
+-- Profile.jsx
```

| Page | Route | Purpose |
| --- | --- | --- |
| `Login.jsx` | `/login` | تسجيل الدخول وحفظ token. |
| `Home.jsx` | `/home` | Dashboard، إحصائيات، recent cases، quick actions. |
| `Cases.jsx` | `/cases` | قائمة الحالات، search، difficulty filter. |
| `CaseDetails.jsx` | `/cases/:caseId` | تفاصيل حالة واحدة من API. |
| `Profile.jsx` | `/profile` | صفحة البروفايل وإحصائيات الحساب والإعدادات. |

---

## Generated Folders

هذه المجلدات تظهر أثناء التطوير أو بعد البناء، لكنها لا ترفع إلى GitHub:

```txt
node_modules/
dist/
```

| Folder | Purpose |
| --- | --- |
| `node_modules/` | مكتبات المشروع بعد `npm install`. |
| `dist/` | نسخة production build بعد `npm run build`. |

