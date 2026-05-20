import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  LogOut,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../api/apiClient.js";
import { getCasesRequest } from "../api/casesApi.js";
import Avatar from "../components/common/Avatar.jsx";
import CaseIcon from "../components/common/CaseIcon.jsx";
import DifficultyBadge from "../components/common/DifficultyBadge.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getCaseStats,
  normalizeCase,
  normalizeUser,
  truncateText,
} from "../utils/caseUtils.js";

const statStyles = {
  total: {
    icon: ClipboardList,
    className: "border-blue-200 bg-blue-50/55 text-blue-600",
  },
  completed: {
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50/60 text-emerald-600",
  },
  easy: {
    icon: BarChart3,
    className: "border-amber-200 bg-amber-50/60 text-amber-600",
  },
  hard: {
    icon: BarChart3,
    className: "border-purple-200 bg-purple-50/60 text-purple-600",
  },
};

function StatCard({ type, value, label, description }) {
  const style = statStyles[type];
  const Icon = style.icon;

  return (
    <article
      className={[
        "rounded-lg border bg-white p-5 shadow-sm",
        style.className,
      ].join(" ")}
    >
      <div className="flex items-center gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-current/10">
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <p className="text-3xl font-bold text-slate-950">{value}</p>
          <p className="mt-1 text-sm font-semibold text-slate-950">{label}</p>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user, refreshUser, logout } = useAuth();
  const normalizedUser = normalizeUser(user);
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadDashboardData() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      refreshUser().catch(() => null);
      const rawCases = await getCasesRequest();
      setCases(rawCases.map((item, index) => normalizeCase(item, index)));
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const stats = useMemo(() => getCaseStats(cases), [cases]);
  const recentCases = cases.slice(0, 5);

  function handleLogout() {
    logout();
    toast.success("Logged out successfully.");
    navigate("/login", { replace: true });
  }

  if (isLoading) {
    return <LoadingState label="Loading dashboard..." />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">
          Welcome back,{" "}
          <span className="text-blue-600">{normalizedUser.firstName}!</span>
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Here's what's happening with your medical cases dashboard today.
        </p>
      </section>

      <section className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          type="total"
          value={stats.total}
          label="Total Cases"
          description="Seeded medical cases"
        />
        <StatCard
          type="completed"
          value={stats.completed}
          label="Cases Completed"
          description="Keep learning!"
        />
        <StatCard
          type="easy"
          value={stats.easy}
          label="Easy Cases"
          description="Start with these"
        />
        <StatCard
          type="hard"
          value={stats.hard}
          label="Hard Cases"
          description="Challenge yourself"
        />
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
            <h2 className="text-xl font-bold text-slate-950">Recent Cases</h2>
            <Link
              to="/cases"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View all cases
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentCases.length ? (
            <>
              <div className="grid gap-4 p-4 md:hidden">
                {recentCases.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-lg border border-slate-200 bg-white p-4"
                  >
                    <div className="flex gap-4">
                      <CaseIcon title={item.title} />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-slate-950">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          Complaint: {truncateText(item.complaint, 64)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <DifficultyBadge value={item.difficulty} />
                      <span className="text-sm font-medium text-slate-600">
                        {item.patientLabel}
                      </span>
                      <span className="text-sm text-slate-500">
                        {item.updatedLabel}
                      </span>
                    </div>
                    <Link
                      to={`/cases/${item.id}`}
                      className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg border border-blue-500 px-4 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                      View Case
                    </Link>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[760px] text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
                      <th className="px-5 py-4">Case Title</th>
                      <th className="px-5 py-4">Patient</th>
                      <th className="px-5 py-4">Difficulty</th>
                      <th className="px-5 py-4">Updated</th>
                      <th className="px-5 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCases.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-100 last:border-b-0"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            <CaseIcon title={item.title} />
                            <div>
                              <p className="font-bold text-slate-950">
                                {item.title}
                              </p>
                              <p className="mt-1 text-sm text-slate-600">
                                Complaint: {truncateText(item.complaint, 34)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-slate-700">
                          {item.patientLabel}
                        </td>
                        <td className="px-5 py-4">
                          <DifficultyBadge value={item.difficulty} />
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {item.updatedLabel}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            to={`/cases/${item.id}`}
                            className="inline-flex h-9 items-center justify-center rounded-lg border border-blue-500 px-4 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                          >
                            View Case
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="p-5">
              <EmptyState
                title="No recent cases"
                description="The API returned no medical cases yet."
              />
            </div>
          )}

          {recentCases.length ? (
            <div className="border-t border-slate-200 px-5 py-5 text-center">
              <Link
                to="/cases"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-blue-500 px-7 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Browse all medical cases
              </Link>
            </div>
          ) : null}
        </div>

        <aside className="space-y-6">
          <section
            id="profile"
            className="rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-200 px-5 py-5">
              <h2 className="text-xl font-bold text-slate-950">
                Your Profile
              </h2>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-5">
                <Avatar name={normalizedUser.name} size="lg" />
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-slate-950">
                    {normalizedUser.name}
                  </p>
                  <p className="mt-1 truncate text-sm text-slate-600">
                    {normalizedUser.email}
                  </p>
                  <span className="mt-3 inline-flex rounded-md bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {normalizedUser.role}
                  </span>
                </div>
              </div>

              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="text-slate-500">Role</dt>
                  <dd className="mt-1 font-semibold text-slate-950">
                    Medical Student
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Member since</dt>
                  <dd className="mt-1 font-semibold text-slate-950">
                    May 2024
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5">
              <h2 className="text-xl font-bold text-slate-950">
                Quick Actions
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              <Link
                to="/cases"
                className="flex items-center justify-between px-5 py-4 transition hover:bg-slate-50"
              >
                <span className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <ClipboardList className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-slate-950">
                      Browse All Cases
                    </span>
                    <span className="text-sm text-slate-500">
                      Explore all medical cases
                    </span>
                  </span>
                </span>
                <ArrowRight className="h-5 w-5 text-slate-500" />
              </Link>

              <Link
                to="/profile"
                className="flex items-center justify-between px-5 py-4 transition hover:bg-slate-50"
              >
                <span className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-slate-950">
                      View Profile
                    </span>
                    <span className="text-sm text-slate-500">
                      See your account details
                    </span>
                  </span>
                </span>
                <ArrowRight className="h-5 w-5 text-slate-500" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50"
              >
                <span className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                    <LogOut className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-slate-950">
                      Logout
                    </span>
                    <span className="text-sm text-slate-500">
                      Sign out of your account
                    </span>
                  </span>
                </span>
                <ArrowRight className="h-5 w-5 text-slate-500" />
              </button>
            </div>
          </section>
        </aside>
      </section>

      <section className="rounded-lg border border-blue-200 bg-blue-50 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-base font-bold text-blue-700">
                Keep Learning, Keep Growing!
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Review cases regularly and challenge yourself with harder cases
                to improve your clinical reasoning.
              </p>
            </div>
          </div>
          <Link
            to="/cases"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-blue-500 px-5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
          >
            Start Learning
          </Link>
        </div>
      </section>
    </div>
  );
}
