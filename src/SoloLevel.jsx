import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import CategoryPage from "./components/CategoryPage";
import Dashboard from "./components/Dashboard";
import StatsPage from "./components/StatsPage";
import { ProgressProvider } from "./hooks/useLocalStorage";
import { ToastProvider } from "./components/Toast";

// Jump back to the top whenever the route changes (the router otherwise keeps
// the previous scroll position).
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function SoloLevel() {
  return (
    <ProgressProvider>
      <ToastProvider>
        <div className="min-h-screen">
          <ScrollToTop />
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/:id" element={<CategoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ToastProvider>
    </ProgressProvider>
  );
}
