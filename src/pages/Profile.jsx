import {
  Bell,
  CalendarDays,
  Camera,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Download,
  Eye,
  EyeOff,
  FileText,
  Flame,
  Info,
  Lock,
  Mail,
  Pencil,
  ShieldCheck,
  Trash2,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Avatar from "../components/common/Avatar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { normalizeUser } from "../utils/caseUtils.js";

function InfoRow({ icon: Icon, label, value, badge }) {
  return (
    <div className="grid gap-3 border-b border-slate-200 py-4 last:border-b-0 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center lg:grid-cols-[210px_minmax(0,1fr)]">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <Icon className="h-4 w-4 text-slate-500" />
        <span>{label}</span>
      </div>
      <div className="min-w-0 break-words text-sm font-bold text-slate-950">
        {badge ? (
          <span className="inline-flex rounded-md bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {value}
          </span>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

function StatisticRow({ icon: Icon, iconClass, title, description, value }) {
  return (
    <div className="flex items-start gap-4 border-b border-slate-200 py-5 last:border-b-0 sm:items-center">
      <div
        className={[
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
          iconClass,
        ].join(" ")}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-950">{title}</p>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
      <p className="shrink-0 pt-1 text-sm font-bold text-slate-950 sm:pt-0">
        {value}
      </p>
    </div>
  );
}

function ActionRow({ icon: Icon, iconClass, title, description, danger }) {
  return (
    <button
      type="button"
      onClick={() => toast.success(`${title} selected.`)}
      className="flex w-full items-start gap-4 border-b border-slate-200 py-4 text-left transition hover:bg-slate-50 last:border-b-0 sm:items-center"
    >
      <div
        className={[
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          iconClass,
        ].join(" ")}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={[
            "text-sm font-bold",
            danger ? "text-red-600" : "text-slate-950",
          ].join(" ")}
        >
          {title}
        </p>
        <p
          className={[
            "mt-1 text-sm",
            danger ? "text-red-500" : "text-slate-600",
          ].join(" ")}
        >
          {description}
        </p>
      </div>
      <ChevronRight
        className={[
          "mt-2 h-5 w-5 shrink-0 sm:mt-0",
          danger ? "text-red-500" : "text-slate-500",
        ].join(" ")}
      />
    </button>
  );
}

function PasswordInput({ label, placeholder }) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-slate-700">
        {label}
      </span>
      <span className="relative block">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </span>
    </label>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const normalizedUser = normalizeUser(user);

  function handleChangePassword(event) {
    event.preventDefault();
    toast.success("Password update action selected.");
  }

  return (
    <div className="space-y-7">
      <section>
        <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">
          My Profile
        </h1>
        <p className="mt-3 text-base text-slate-600">
          View and manage your account information.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px] 2xl:grid-cols-[minmax(0,1fr)_560px]">
        <div className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">
              Profile Information
            </h2>

            <div className="mt-6 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] 2xl:grid-cols-[250px_minmax(0,1fr)]">
              <div className="flex flex-col items-center text-center">
                <Avatar name={normalizedUser.name} size="xl" />
                <button
                  type="button"
                  onClick={() => toast.success("Avatar action selected.")}
                  className="mt-6 inline-flex h-11 w-full max-w-[220px] items-center justify-center gap-2 rounded-lg border border-blue-500 bg-white px-5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 sm:px-6"
                >
                  <Camera className="h-4 w-4" />
                  Change Avatar
                </button>
                <p className="mt-3 text-sm text-slate-500">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>

              <div>
                <InfoRow
                  icon={UserRound}
                  label="Full Name"
                  value={normalizedUser.name}
                />
                <InfoRow
                  icon={Mail}
                  label="Email Address"
                  value={normalizedUser.email}
                />
                <InfoRow
                  icon={ShieldCheck}
                  label="Role"
                  value="Medical Student"
                  badge
                />
                <InfoRow
                  icon={CalendarDays}
                  label="Member Since"
                  value="May 2024"
                />
                <InfoRow
                  icon={UserRound}
                  label="Account Type"
                  value="Demo Account"
                />

                <div className="mt-8 flex justify-stretch sm:justify-end">
                  <button
                    type="button"
                    onClick={() => toast.success("Edit profile action selected.")}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-blue-500 bg-white px-6 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 sm:w-auto"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-lg font-bold text-slate-950">
              About Your Account
            </h2>
            <div className="mt-4 flex gap-3 rounded-lg bg-blue-50 p-4 sm:gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-950">
                  This is a demo student account provided for evaluation
                  purposes.
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  You have full access to all medical cases and learning
                  resources.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-lg font-bold text-slate-950">
              Change Password
            </h2>
            <form onSubmit={handleChangePassword} className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                <PasswordInput
                  label="Current Password"
                  placeholder="Enter current password"
                />
                <PasswordInput
                  label="New Password"
                  placeholder="Enter new password"
                />
                <PasswordInput
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="mt-7 flex justify-stretch sm:justify-end">
                <button
                  type="submit"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-7 text-sm font-bold text-white shadow-[0_12px_25px_rgba(37,99,235,0.22)] transition hover:bg-blue-700 sm:w-auto"
                >
                  <Lock className="h-4 w-4" />
                  Update Password
                </button>
              </div>
            </form>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">
              Account Statistics
            </h2>
            <div className="mt-6">
              <StatisticRow
                icon={FileText}
                iconClass="bg-blue-100 text-blue-600"
                title="Cases Viewed"
                description="Total medical cases you've viewed"
                value="27"
              />
              <StatisticRow
                icon={ClipboardCheck}
                iconClass="bg-emerald-100 text-emerald-600"
                title="Quizzes Completed"
                description="Total quizzes you've completed"
                value="12"
              />
              <StatisticRow
                icon={CircleHelp}
                iconClass="bg-purple-100 text-purple-600"
                title="Questions Answered"
                description="Total practice questions answered"
                value="96"
              />
              <StatisticRow
                icon={Flame}
                iconClass="bg-amber-100 text-amber-600"
                title="Study Streak"
                description="Current consecutive days"
                value={<span className="text-emerald-600">7 days</span>}
              />
            </div>

            <div className="mt-7 border-t border-slate-200 pt-7 text-center">
              <button
                type="button"
                onClick={() => toast.success("Progress action selected.")}
                className="inline-flex h-11 w-full max-w-[260px] items-center justify-center gap-2 rounded-lg border border-blue-500 bg-white text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                <TrendingUp className="h-4 w-4" />
                View Full Progress
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">
              Account Actions
            </h2>
            <div className="mt-5">
              <ActionRow
                icon={Download}
                iconClass="bg-blue-100 text-blue-600"
                title="Download My Data"
                description="Download your account data and progress"
              />
              <ActionRow
                icon={Bell}
                iconClass="bg-blue-100 text-blue-600"
                title="Notification Preferences"
                description="Manage your notification settings"
              />
              <ActionRow
                icon={CircleHelp}
                iconClass="bg-blue-100 text-blue-600"
                title="Help & Support"
                description="Get help and contact support"
              />
              <ActionRow
                icon={Trash2}
                iconClass="bg-red-100 text-red-600"
                title="Delete Account"
                description="Permanently delete your account"
                danger
              />
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
