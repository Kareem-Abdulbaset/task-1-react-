import {
  ClipboardList,
  FileText,
  Home,
  LogOut,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";

const navItems = [
  {
    label: "Dashboard",
    to: "/home",
    icon: Home,
  },
  {
    label: "Medical Cases",
    to: "/cases",
    icon: FileText,
  },
  {
    label: "Profile",
    to: "/profile",
    icon: UserRound,
  },
];

function isNavActive(item, location) {
  if (item.to === "/cases") {
    return location.pathname.startsWith("/cases");
  }

  return location.pathname === item.to && !location.hash;
}

function getNavClass(isActive) {
  return [
    "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition sm:gap-3 sm:px-4 sm:py-3",
    isActive
      ? "bg-blue-600/45 text-white shadow-[0_12px_35px_rgba(37,99,235,0.28)]"
      : "text-blue-50/90 hover:bg-white/10 hover:text-white",
  ].join(" ");
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    toast.success("Logged out successfully.");
    navigate("/login", { replace: true });
  }

  return (
    <aside className="flex w-full flex-col border-b border-white/10 bg-[#061d3b] text-white shadow-[12px_0_35px_rgba(15,23,42,0.12)] lg:sticky lg:top-0 lg:h-screen lg:w-[280px] lg:border-b-0">
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:py-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 sm:h-12 sm:w-12">
          <Stethoscope className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.4} />
        </div>
        <span className="text-xl font-bold sm:text-2xl">MedCases</span>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:flex-col lg:gap-3 lg:overflow-visible lg:pb-0 lg:pt-10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isNavActive(item, location);
          return (
            <Link key={item.label} to={item.to} className={getNavClass(active)}>
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-4 lg:mt-auto lg:pb-6">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-blue-50/90 transition hover:bg-white/10 hover:text-white sm:gap-3 sm:px-4 sm:py-3 lg:justify-start"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
