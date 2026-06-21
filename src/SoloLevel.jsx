import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import CategoryPage from "./components/CategoryPage";
import Dashboard from "./components/Dashboard";
import { ProgressProvider } from "./hooks/useLocalStorage";

export default function SoloLevel() {
  return (
    <ProgressProvider>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/:id" element={<CategoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ProgressProvider>
  );
}
