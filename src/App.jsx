import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppLayout from "./components/layout/AppLayout.jsx";
import ProtectedRoute from "./components/routes/ProtectedRoute.jsx";
import CaseDetails from "./pages/CaseDetails.jsx";
import Cases from "./pages/Cases.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/home" : "/login"} replace />;
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-blue-600">404</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/cases/:caseId" element={<CaseDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            border: "1px solid #dbe3ef",
            color: "#0f172a",
            boxShadow: "0 16px 45px rgba(15, 23, 42, 0.08)",
          },
        }}
      />
    </>
  );
}
