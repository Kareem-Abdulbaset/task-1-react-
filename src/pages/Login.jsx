import { Eye, EyeOff, Lock, Mail, Stethoscope } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const defaultCredentials = {
  email: "student@example.com",
  password: "123456",
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, getApiErrorMessage } = useAuth();
  const [form, setForm] = useState(defaultCredentials);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const redirectTo = location.state?.from?.pathname || "/home";

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setFieldErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
  }

  function validateForm() {
    const errors = {};

    if (!form.email.trim()) {
      errors.email = "Email is required.";
    }

    if (!form.password.trim()) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        email: form.email.trim(),
        password: form.password,
      });
      toast.success("Login successful.");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = error.response
        ? getApiErrorMessage(error)
        : error.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-[#f7fbff] text-slate-950">
      <section className="hidden min-h-screen w-[42%] flex-col justify-between bg-[#061d3b] px-12 py-10 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/10">
            <Stethoscope className="h-8 w-8" />
          </div>
          <span className="text-2xl font-bold">MedCases</span>
        </div>

        <div className="max-w-lg">
          <p className="text-sm font-semibold uppercase text-blue-200">
            Medical Junior Developer Task
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-tight">
            Explore real medical cases from a protected API.
          </h1>
          <p className="mt-5 text-base leading-8 text-blue-100/85">
            Login, browse seeded cases, filter by difficulty, and open detailed
            clinical scenarios with patient questions and diagnosis.
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/8 p-5">
          <p className="text-sm font-semibold text-blue-100">
            Guaranteed test account
          </p>
          <p className="mt-2 text-sm text-blue-100/80">
            student@example.com / 123456
          </p>
        </div>
      </section>

      <section className="flex flex-1 items-center justify-center px-4 py-8 sm:px-5 sm:py-10">
        <div className="w-full max-w-[460px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Stethoscope className="h-7 w-7" />
            </div>
            <span className="text-2xl font-bold">MedCases</span>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Welcome back
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
                Sign in to your dashboard
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Use the provided medical student account to access protected
                cases.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={updateField}
                    className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    placeholder="student@example.com"
                  />
                </div>
                {fieldErrors.email ? (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {fieldErrors.email}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={updateField}
                    className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    placeholder="123456"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {fieldErrors.password ? (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {fieldErrors.password}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-bold text-white shadow-[0_12px_25px_rgba(37,99,235,0.25)] transition hover:bg-blue-700 disabled:opacity-70"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm font-bold text-blue-900">
                Working login for testing
              </p>
              <p className="mt-1 text-sm text-blue-800">
                student@example.com / 123456
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
