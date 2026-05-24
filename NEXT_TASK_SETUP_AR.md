# دليل تأسيس التاسك الثاني بـ Next.js

هذا الملف يشرح تجهيز مشروع **MedQuiz** المطلوب في التاسك الثاني من الصفر، باستخدام:

- Next.js
- JavaScript
- App Router
- Tailwind CSS
- Axios
- React Hot Toast
- Lucide React للأيقونات

الهدف هنا هو تأسيس مشروع مناسب للتاسك بسرعة وبهيكل ملفات واضح، ثم نبدأ تنفيذ الصفحات وربط الـ API فوق هذا الأساس.

---

## 1. قبل البداية

### المطلوب على الجهاز

تأكد أن عندك:

1. Node.js مثبت.
2. npm يعمل من التيرمنال.
3. VS Code أو أي محرر.

للتحقق:

```bash
node -v
npm -v
```

يفضل استخدام إصدار Node حديث. وثائق Next.js الحالية تشترط Node.js `20.9` أو أحدث.

---

## 2. هل نحول مشروع React الحالي أم ننشئ Next جديد؟

لأسرع نتيجة صحيحة في التاسك الثاني:

**الأفضل إنشاء مشروع Next.js جديد داخل فولدر Task 2** بدل محاولة تحويل مشروع Vite React الحالي ملفاً بملف.

السبب:

- Next.js له routing مبني على الملفات داخل `app`.
- لا نحتاج `react-router-dom`.
- لا نحتاج `main.jsx` أو `vite.config.js`.
- التاسك الثاني مجال مختلف: Quizzes وليس Medical Cases.
- تصميم التاسك الثاني مختلف عن تصميم التاسك الأول.

يمكن إعادة استخدام الأفكار فقط من التاسك الأول:

- طريقة تسجيل الدخول.
- حفظ التوكن.
- `Authorization: Bearer`.
- API helper.
- loading / empty / error states.

---

## 3. إنشاء مشروع Next.js

افتح التيرمنال داخل المكان الذي تريد إنشاء المشروع فيه، وليكن فولدر Task 2:

```bash
cd "D:\Software Development\Task\Task 2 ( NEXT.JS )"
```

ثم شغل:

```bash
npx create-next-app@latest medquiz-next
```

عند الأسئلة اختر إعدادات مناسبة للتاسك:

| السؤال | الاختيار |
|---|---|
| Use recommended defaults? | `No, customize settings` |
| TypeScript? | `No` |
| Linter? | `ESLint` |
| React Compiler? | يمكن `No` لتقليل المتغيرات |
| Tailwind CSS? | `Yes` |
| Code inside `src/`? | `Yes` |
| App Router? | `Yes` |
| Customize import alias? | `No` واستخدم `@/*` |

بعد الإنشاء:

```bash
cd medquiz-next
npm run dev
```

ثم افتح:

```txt
http://localhost:3000
```

---

## 4. تثبيت المكتبات التي سنستخدمها

إذا اخترت Tailwind أثناء `create-next-app` فهو سيجهز Tailwind لك، لذلك ثبت المكتبات الإضافية فقط:

```bash
npm install axios react-hot-toast lucide-react
```

### لماذا هذه المكتبات؟

| المكتبة | استخدامها |
|---|---|
| `axios` | طلبات API وتجهيز client يضيف التوكن تلقائياً |
| `react-hot-toast` | رسائل نجاح وفشل مثل login error وsubmit result |
| `lucide-react` | أيقونات الواجهة مثل Home وQuiz وLogout |
| `tailwindcss` | بناء التصميم الداكن المطلوب بسرعة |

---

## 5. لو Tailwind لم يتم اختياره أثناء الإنشاء

لو أنشأت مشروع Next بدون Tailwind، ثبت Tailwind يدوياً:

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

ثم تأكد من وجود الملف:

```txt
postcss.config.mjs
```

ومحتواه:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}

export default config
```

وفي:

```txt
src/app/globals.css
```

ضع:

```css
@import "tailwindcss";
```

---

## 6. إعداد متغير البيئة للـ API

داخل جذر مشروع Next أنشئ ملف:

```txt
.env.local
```

ومحتواه:

```env
NEXT_PUBLIC_API_BASE_URL=https://testingapi.alrowadit.com
```

مهم:

- لا تضع `/api` داخل قيمة المتغير.
- نضيف `/api/...` داخل ملفات API helper.
- نستخدم `NEXT_PUBLIC_` لأن جزءاً من طلبات الـ API سيعمل من Client Components.

مثال صحيح:

```js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
```

ثم endpoint login يكون:

```js
`${API_BASE_URL}/api/auth/login/`
```

---

## 7. المسارات المطلوبة في التاسك

المطلوب رسمياً:

| Route | Access | الهدف |
|---|---|---|
| `/login` | Public | تسجيل الدخول |
| `/home` | Protected | الصفحة الرئيسية بعد login |
| `/quizzes` | Protected | عرض كل quizzes من API |
| `/quizzes/[id]` | Protected | quiz question flow |
| `/quizzes/[id]/result` | Protected | صفحة النتيجة بعد submit |

في Next.js App Router:

- ملف `page.jsx` ينشئ صفحة.
- فولدر `[id]` يمثل dynamic route.
- فولدر `(protected)` ينظم الصفحات المحمية بدون أن يظهر اسمه في الرابط.

---

## 8. هيكل الفولدرات المقترح

هذا هو الهيكل الأنسب للتاسك:

```txt
medquiz-next/
  .env.local
  package.json
  next.config.mjs
  postcss.config.mjs
  public/
    images/
      auth/
      home/
      quizzes/

  src/
    app/
      globals.css
      layout.jsx
      page.jsx

      login/
        page.jsx

      (protected)/
        layout.jsx

        home/
          page.jsx

        quizzes/
          page.jsx

          [id]/
            page.jsx

            result/
              page.jsx

    api/
      apiClient.js
      authApi.js
      quizzesApi.js

    components/
      auth/
        LoginForm.jsx
        ProtectedRoute.jsx

      layout/
        AppShell.jsx
        Sidebar.jsx
        Topbar.jsx

      quizzes/
        QuizCard.jsx
        QuestionCard.jsx
        AnswerOption.jsx
        QuizProgress.jsx
        ResultSummary.jsx

      ui/
        Button.jsx
        LoadingState.jsx
        EmptyState.jsx
        ErrorState.jsx

    context/
      AuthContext.jsx

    hooks/
      useAuthGuard.js
      useQuizAnswers.js

    utils/
      authStorage.js
      quizUtils.js
```

---

## 9. وظيفة كل جزء في الهيكل

### `src/app`

مسارات Next.js نفسها.

### `src/app/layout.jsx`

الـ root layout للمشروع:

- يستورد `globals.css`.
- يضع Provider عام لو احتجنا.
- يضع `<Toaster />` مرة واحدة للتطبيق.

### `src/app/login/page.jsx`

صفحة اللوجن العامة.

### `src/app/(protected)/layout.jsx`

layout للصفحات المحمية:

- يتحقق من token.
- يعرض Sidebar وTopbar.
- يوجه المستخدم إلى `/login` لو لا يوجد token.

### `src/api/apiClient.js`

ملف Axios الأساسي:

- base URL من `.env.local`.
- timeout.
- request interceptor.
- إرفاق التوكن في headers.
- تحويل أخطاء الشبكة إلى رسائل واضحة.

### `src/api/authApi.js`

طلبات auth:

```txt
POST /api/auth/login/
GET  /api/auth/me/
```

### `src/api/quizzesApi.js`

طلبات quizzes:

```txt
GET  /api/quizzes/
GET  /api/quizzes/:id/
POST /api/quizzes/:id/submit/
```

### `src/context/AuthContext.jsx`

مسؤول عن:

- user.
- token.
- login.
- logout.
- session persistence.

### `src/hooks/useQuizAnswers.js`

مسؤول عن:

- حفظ إجابات المستخدم أثناء التنقل.
- معرفة السؤال الحالي.
- بناء payload قبل submit.

---

## 10. ملفات الصفحات التي سنبنيها

### Login

```txt
src/app/login/page.jsx
```

المطلوب:

- Email.
- Password.
- empty fields validation.
- API login.
- حفظ token.
- عرض backend error.
- help box للحساب التجريبي:

```txt
student@example.com
123456
```

### Home

```txt
src/app/(protected)/home/page.jsx
```

المطلوب:

- protected route.
- جلب `/api/auth/me/`.
- عرض name / email / role.
- cards لـ:
  - Medical Quizzes.
  - Profile حسب التصميم لو احتجناه كـ card فقط.
  - Logout.

### Quizzes

```txt
src/app/(protected)/quizzes/page.jsx
```

المطلوب:

- جلب quizzes من API.
- عرض quiz cards.
- كل card تعرض:
  - title.
  - specialty.
  - questions_count.
  - Start Quiz.
- loading / empty / error.

### Quiz Question Flow

```txt
src/app/(protected)/quizzes/[id]/page.jsx
```

المطلوب:

- جلب quiz details.
- عرض سؤال واحد في كل مرة.
- عرض 4 options.
- حفظ الاختيار عند التنقل.
- Previous / Next.
- progress text.
- لا تعرض correct answer قبل submit.

### Result

```txt
src/app/(protected)/quizzes/[id]/result/page.jsx
```

المطلوب:

- submit answers للـ backend.
- عرض:
  - score.
  - correct answers.
  - wrong answers.
  - percentage.
- زر Restart Quiz.
- زر Back to Quizzes.

---

## 11. شكل Axios client المقترح

ملف:

```txt
src/api/apiClient.js
```

فكرة الملف:

```js
import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("medquiz_token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default apiClient
```

ملاحظة مهمة:

أي ملف يستخدم `localStorage` أو hooks أو event handlers في Next App Router يجب أن يكون Client Component أو يستدعى من كود client.

---

## 12. أين نضع Toast؟

أفضل مكان عام:

```txt
src/app/layout.jsx
```

لو احتجنا تشغيله من Client Component منفصل، نعمل:

```txt
src/components/ui/AppToaster.jsx
```

ويكون:

```jsx
"use client"

import { Toaster } from "react-hot-toast"

export default function AppToaster() {
  return <Toaster position="top-right" />
}
```

ثم نستدعيه داخل root layout.

استخدامه داخل اللوجن مثلاً:

```js
toast.success("Login successful")
toast.error("Login failed")
```

---

## 13. الملفات الافتراضية التي نستبدلها بعد إنشاء Next

بعد `create-next-app` غالباً ستجد صفحة default.

سنستبدل محتوى:

```txt
src/app/page.js
```

أو:

```txt
src/app/page.jsx
```

بحيث يعمل redirect مناسب:

- إلى `/login` لو لا يوجد token.
- أو إلى `/home` لو المستخدم مسجل.

سنعدل أيضاً:

```txt
src/app/globals.css
```

ليحمل قواعد التصميم العامة مع Tailwind.

---

## 14. أشياء لا نحتاجها من مشروع React القديم

عند نقل الفكرة من Task 1 لا تنقل هذه الملفات كما هي:

```txt
src/main.jsx
src/App.jsx
src/App.css
vite.config.js
index.html
src/api/casesApi.js
src/utils/caseUtils.js
src/components/routes/ProtectedRoute.jsx
```

السبب:

- Next لا يستخدم `main.jsx`.
- Next لا يستخدم `react-router-dom` للصفحات.
- التاسك الجديد لا يستخدم Medical Cases.
- route protection ستكون بأسلوب مناسب لـ Next.

---

## 15. Dependencies المتوقعة في `package.json`

بعد الإنشاء والتثبيت سيكون عندك تقريباً:

```json
{
  "dependencies": {
    "next": "...",
    "react": "...",
    "react-dom": "...",
    "axios": "...",
    "react-hot-toast": "...",
    "lucide-react": "..."
  }
}
```

ومع Tailwind سيكون عندك dev dependencies مجهزة من `create-next-app` أو من التثبيت اليدوي.

---

## 16. ترتيب التنفيذ المقترح

الترتيب الأسرع:

1. إنشاء مشروع Next بالخيارات الصحيحة.
2. ضبط `.env.local`.
3. إنشاء `apiClient.js`.
4. إنشاء `authApi.js`.
5. إنشاء login page وربطها بالـ API.
6. حماية صفحات `(protected)`.
7. بناء Home.
8. إنشاء `quizzesApi.js`.
9. بناء quiz list page.
10. بناء quiz question flow.
11. بناء result page.
12. تطبيق التصميم بالـ Tailwind.
13. إضافة toast ورسائل الأخطاء.
14. اختبار acceptance criteria.

---

## 17. Acceptance checklist قبل التسليم

لا تعتبر التاسك منتهياً إلا بعد تحقق الآتي:

- [ ] `.env.local` يحتوي `NEXT_PUBLIC_API_BASE_URL`.
- [ ] login يعمل بالحساب التجريبي.
- [ ] token محفوظ بعد login.
- [ ] التوكن يرسل في protected requests.
- [ ] refresh لا يخرج المستخدم إذا token موجود.
- [ ] حذف token يوجه إلى `/login`.
- [ ] quizzes تأتي من API وليست hardcoded.
- [ ] quiz flow يدعم Previous وNext.
- [ ] الإجابات تبقى محفوظة أثناء التنقل.
- [ ] submit يرسل payload صحيح.
- [ ] result page تعرض score وcorrect وwrong وpercentage.
- [ ] logout يمسح auth data ويرجع إلى `/login`.
- [ ] loading / empty / error states موجودة.

---

## 18. ملخص القرار

للتاسك الثاني:

- نبدأ بمشروع Next جديد.
- نستخدم `App Router`.
- نستخدم `Tailwind CSS`.
- نستخدم `Axios`.
- نستخدم `React Hot Toast`.
- نستخدم `lucide-react` للأيقونات.
- نبني فقط routes المطلوبة أولاً.
- نستفيد من منطق auth في React task، لكن لا ننقل pages القديمة كما هي.

