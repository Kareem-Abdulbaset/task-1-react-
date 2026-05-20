import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f7fbff] text-slate-950 lg:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Topbar />
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
