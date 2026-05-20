import { Bell, ChevronDown, Moon, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { normalizeUser } from "../../utils/caseUtils.js";
import Avatar from "../common/Avatar.jsx";

export default function Topbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const normalizedUser = normalizeUser(user);
  const [query, setQuery] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      navigate(`/cases?search=${encodeURIComponent(trimmedQuery)}`);
    } else {
      navigate("/cases");
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1600px] items-center gap-3 px-4 sm:min-h-[88px] sm:gap-4 sm:px-6 lg:px-10">
        <form onSubmit={handleSubmit} className="min-w-0 flex-1">
          <label className="relative block max-w-[580px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 sm:left-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search cases by title or complaint..."
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:h-12 sm:pl-12 sm:pr-16"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-500 sm:inline">
              ⌘ K
            </span>
          </label>
        </form>

        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              2
            </span>
          </button>
          <button
            type="button"
            aria-label="Theme"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <Moon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Avatar name={normalizedUser.name} size="md" />
          <div className="hidden min-w-0 lg:block">
            <p className="truncate text-sm font-bold text-slate-950">
              {normalizedUser.name}
            </p>
            <p className="truncate text-sm text-slate-600">
              {normalizedUser.email}
            </p>
          </div>
          <ChevronDown className="hidden h-5 w-5 text-slate-500 lg:block" />
        </div>
      </div>
    </header>
  );
}
