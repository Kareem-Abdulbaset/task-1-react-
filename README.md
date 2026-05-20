# Medical Cases Dashboard - React + Vite

هذا الملف يشرح المطلوب في تاسك الـ Frontend، وطريقة تنفيذ مشروع **Medical Cases Dashboard** باستخدام React + Vite، مع Tailwind CSS للتصميم، وAxios للتعامل مع الـ API، وToast لعرض رسائل النجاح والأخطاء.

> ملاحظة: المجلد الحالي يبدأ كمشروع جديد، لذلك التنفيذ الفعلي يبدأ بإنشاء مشروع Vite React ثم إضافة المكتبات المطلوبة.

---

## 1. فكرة المشروع

المطلوب بناء Dashboard طبي لطلاب الطب تعرض حالات طبية من Backend API جاهز.

المشروع لا يعتمد على بيانات حالات مكتوبة داخل الكود بشكل ثابت، بل يجب أن يجلب البيانات من الـ API.

الـ API الأساسي:

```env
VITE_API_BASE_URL=https://testingapi.alrowadit.com
```

بيانات تسجيل الدخول المضمونة في التاسك:

```txt
Email: student@example.com
Password: 123456
```

بعد تسجيل الدخول بنجاح، يرجع الـ API token باسم:

```txt
demo-student-token
```

ويتم حفظه في `localStorage` لاستخدامه مع الطلبات المحمية.

---

## 2. الصفحات المطلوبة

### `/login`

صفحة تسجيل الدخول.

المطلوب فيها:

- حقلا إدخال: email و password.
- منع إرسال الفورم لو الحقول فارغة.
- إرسال طلب login إلى الـ API.
- عند النجاح:
  - حفظ `token` في `localStorage`.
  - حفظ بيانات المستخدم إن احتجناها في الواجهة.
  - التحويل إلى `/home`.
- عند الفشل:
  - عرض رسالة الخطأ القادمة من الـ backend.
  - استخدام toast لعرض الخطأ بشكل واضح.
- عرض box صغير يوضح بيانات الدخول المضمونة:

```txt
student@example.com / 123456
```

### `/home`

صفحة Dashboard محمية.

تصميمها يكون مثل صفحة الداشبورد في الصور المرفقة:

- Sidebar داكن فيه:
  - Logo: MedCases
  - Dashboard
  - Medical Cases
  - Profile
  - Logout
- Topbar فيه:
  - Search input
  - أيقونات notifications/theme
  - بيانات المستخدم
- Welcome section:
  - `Welcome back, Demo!`
- كروت إحصائيات:
  - Total Cases
  - Cases Completed
  - Easy Cases
  - Hard Cases
- جدول Recent Cases يعرض أول مجموعة من الحالات.
- كارت Profile يعرض:
  - الاسم
  - الإيميل
  - الدور
- Quick Actions:
  - Browse All Cases
  - View Profile
  - Logout

هذه الصفحة يجب أن تستدعي:

```http
GET /api/auth/me/
GET /api/cases/
```

### `/cases`

صفحة قائمة الحالات الطبية، محمية.

تصميمها يكون مثل صفحة Medical Cases في الصور المرفقة.

المطلوب فيها:

- جلب الحالات من الـ API.
- عرض الحالات في table/list بنفس شكل التصميم.
- كل حالة تعرض:
  - العنوان
  - الشكوى المختصرة
  - النوع والعمر
  - الصعوبة
  - تاريخ التحديث
  - زر `View Case`
- Search للبحث بالعنوان أو الشكوى.
- Difficulty filter:
  - All
  - Easy
  - Medium
  - Hard
- زر Clear Filters.
- حالات UI واضحة:
  - Loading
  - Empty
  - Error
- عند الضغط على `View Case` يتم الانتقال إلى:

```txt
/cases/:id
```

### `/cases/:id`

صفحة تفاصيل الحالة، محمية.

تصميمها يكون مثل صفحة View Case في الصور المرفقة.

المطلوب فيها:

- زر Back to Cases.
- جلب الحالة المختارة بالـ ID من الـ API.
- عرض:
  - title
  - age
  - gender
  - complaint
  - difficulty
  - history
  - examination
  - questions
  - diagnosis
- عرض difficulty badge بألوان مختلفة.
- عرض الأسئلة كقائمة text strings.
- إضافة أزرار شكلية مثل:
  - Add to Favorites
  - Add Note
  - Report Issue

---

## 3. المكتبات المطلوبة

بعد إنشاء مشروع Vite React، نحتاج تثبيت المكتبات التالية:

```bash
npm install react-router-dom axios react-hot-toast lucide-react
```

وتثبيت Tailwind CSS:

```bash
npm install -D tailwindcss @tailwindcss/vite
```

استخدام كل مكتبة:

- `react-router-dom`: لإنشاء routes، والتنقل بين الصفحات، وعمل protected routes.
- `axios`: لإرسال طلبات login وجلب بيانات المستخدم والحالات.
- `react-hot-toast`: لعرض رسائل النجاح والأخطاء.
- `lucide-react`: لاستخدام أيقونات قريبة من التصميم المطلوب.
- `tailwindcss`: لبناء التصميم بسرعة وبشكل مطابق للصور.

---

## 4. إنشاء المشروع وتشغيله

إنشاء مشروع Vite React:

```bash
npm create vite@latest . -- --template react
```

تثبيت الاعتمادات:

```bash
npm install
```

إضافة المكتبات المطلوبة:

```bash
npm install react-router-dom axios react-hot-toast lucide-react
npm install -D tailwindcss @tailwindcss/vite
```

تشغيل المشروع:

```bash
npm run dev
```

بعد التشغيل، Vite سيعرض رابط محلي غالبا مثل:

```txt
http://localhost:5173
```

---

## 5. ملف البيئة

يتم إنشاء ملف `.env` في جذر المشروع:

```env
VITE_API_BASE_URL=https://testingapi.alrowadit.com
```

مهم جدا استخدام هذا المتغير داخل الكود بدلا من كتابة الدومين في كل مكان.

مثال:

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

---

## 6. API Contract

كل الـ endpoints تكون بعد الدومين الأساسي:

```txt
https://testingapi.alrowadit.com
```

| Method | Endpoint | الاستخدام |
| --- | --- | --- |
| POST | `/api/auth/login/` | تسجيل الدخول واستلام token |
| GET | `/api/auth/me/` | جلب بيانات المستخدم الحالي |
| GET | `/api/cases/` | جلب كل الحالات الطبية |
| GET | `/api/cases/:id/` | جلب تفاصيل حالة معينة |

مثال login request:

```js
axios.post(`${API_BASE_URL}/api/auth/login/`, {
  email: "student@example.com",
  password: "123456",
});
```

شكل response المتوقع من login:

```json
{
  "token": "demo-student-token",
  "user": {
    "id": 1,
    "name": "Demo Medical Student",
    "email": "student@example.com",
    "role": "student"
  }
}
```

---

## 7. حماية الصفحات

المشروع يحتاج `ProtectedRoute` reusable component.

فكرته:

- لو لا يوجد `token` في `localStorage`:
  - يحول المستخدم إلى `/login`.
- لو يوجد `token`:
  - يسمح بعرض الصفحة.

الصفحات المحمية:

```txt
/home
/cases
/cases/:id
```

صفحة `/login` عامة ولا تحتاج token.

عند تسجيل الخروج:

- حذف token من `localStorage`.
- حذف أي بيانات مستخدم محفوظة.
- التحويل إلى `/login`.

---

## 8. Axios API Client

يفضل إنشاء ملف helper مركزي للتعامل مع الـ API، مثلا:

```txt
src/api/apiClient.js
```

وظيفته:

- قراءة `VITE_API_BASE_URL`.
- إنشاء instance من Axios.
- إضافة `Authorization` header تلقائيا لو يوجد token.
- توحيد طريقة التعامل مع أخطاء الشبكة.

مثال الفكرة:

```js
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
```

---

## 9. التصميم المطلوب

التصميم يعتمد على الصور المرفقة، وأهم النقاط:

- Sidebar ثابت على الشمال بلون أزرق داكن.
- خلفية الصفحة فاتحة.
- استخدام cards بيضاء بحدود خفيفة.
- استخدام shadows بسيطة.
- استخدام أزرق واضح للأزرار والـ active navigation.
- استخدام أيقونات داخل sidebar والأزرار.
- الحفاظ على المسافات الكبيرة والمريحة بين العناصر.
- الجداول والكروت تكون بنفس روح التصميم.

ألوان difficulty badges:

| Difficulty | اللون |
| --- | --- |
| Easy | أخضر |
| Medium | أصفر / برتقالي فاتح |
| Hard | أحمر |

---

## 10. هيكلة ملفات مقترحة

```txt
src/
  api/
    apiClient.js
    authApi.js
    casesApi.js
  components/
    Layout.jsx
    Sidebar.jsx
    Topbar.jsx
    ProtectedRoute.jsx
    DifficultyBadge.jsx
    LoadingState.jsx
    ErrorState.jsx
  pages/
    Login.jsx
    Home.jsx
    Cases.jsx
    CaseDetails.jsx
  App.jsx
  main.jsx
  index.css
```

شرح سريع:

- `apiClient.js`: Axios instance وإضافة token تلقائيا.
- `authApi.js`: login و get current user.
- `casesApi.js`: جلب الحالات وتفاصيل الحالة.
- `ProtectedRoute.jsx`: حماية الصفحات.
- `Layout.jsx`: يجمع Sidebar و Topbar مع محتوى الصفحة.
- `DifficultyBadge.jsx`: badge موحد للصعوبة.

---

## 11. الحالات المتوقعة من API

الحالات المتوقعة في `/api/cases/`:

- Acute Appendicitis
- Community Acquired Pneumonia
- Diabetic Ketoacidosis
- Acute Myocardial Infarction
- Acute Asthma Exacerbation
- Urinary Tract Infection
- Gastroenteritis
- Migraine Without Aura
- Cellulitis of the Lower Leg

لا يتم كتابة هذه الحالات كـ array ثابت داخل المشروع، لكن يمكن استخدامها فقط كمرجع للتأكد أن البيانات القادمة من الـ API صحيحة.

---

## 12. Acceptance Criteria

المشروع يعتبر مقبولا عند تحقق النقاط التالية:

- `VITE_API_BASE_URL` مضبوط على `https://testingapi.alrowadit.com`.
- تسجيل الدخول يعمل من خلال الـ backend API.
- تسجيل الدخول ينجح باستخدام:

```txt
student@example.com / 123456
```

- token يتم حفظه في `localStorage`.
- كل protected request يرسل token في `Authorization` header.
- Refresh داخل صفحة محمية يظل يعمل طالما token موجود.
- حذف token أو عمل logout يعيد المستخدم إلى `/login`.
- الحالات يتم جلبها من API وليس من hardcoded array.
- البحث والفلترة يعملان على الحالات المعروضة.
- تفاصيل الحالة يتم جلبها من API باستخدام ID.
- وجود حالات loading و error و empty.
- Logout يمسح `localStorage` ويرجع إلى `/login`.

---

## 13. خطة الاختبار اليدوي

بعد تنفيذ المشروع:

1. تشغيل:

```bash
npm install
npm run dev
```

2. فتح `/login`.
3. تجربة login بحقول فارغة والتأكد من ظهور validation.
4. تسجيل الدخول باستخدام:

```txt
student@example.com / 123456
```

5. التأكد من التحويل إلى `/home`.
6. فتح DevTools والتأكد أن `token` محفوظ في `localStorage`.
7. عمل refresh داخل `/home` والتأكد أن الصفحة لا ترجع إلى login.
8. فتح `/cases` والتأكد من عرض الحالات القادمة من API.
9. تجربة search بالعنوان أو الشكوى.
10. تجربة فلترة الصعوبة Easy و Medium و Hard.
11. الضغط على `View Case` والتأكد من فتح `/cases/:id`.
12. التأكد من عرض details مثل history و examination و questions و diagnosis.
13. الضغط على Logout والتأكد من:
    - حذف token.
    - الرجوع إلى `/login`.
14. حذف token يدويا من `localStorage` ثم محاولة فتح `/home` أو `/cases` والتأكد من التحويل إلى `/login`.

---

## 14. ملاحظات مهمة أثناء التنفيذ

- لا تعتمد على validation داخل الـ frontend فقط، بل يجب إرسال بيانات login إلى backend.
- لا تكتب الحالات الطبية داخل الكود كبيانات ثابتة.
- استخدم reusable components قدر الإمكان.
- اجعل رسائل أخطاء الشبكة واضحة للمستخدم، مثلا:

```txt
Cannot connect to API. Please try again later.
```

- اجعل التصميم responsive قدر الإمكان، خصوصا الجداول والـ sidebar.
- حاول مطابقة الصور المرفقة في المسافات، الألوان، شكل البطاقات، والأيقونات.

