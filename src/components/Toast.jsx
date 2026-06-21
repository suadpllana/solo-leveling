import { createContext, useCallback, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext(null);

// Fire a toast from anywhere: const toast = useToast(); toast("Saved");
// Optional second arg: "success" (default) | "error".
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx.toast;
}

function ToastIcon({ variant }) {
  if (variant === "error") {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const toast = useCallback((message, variant = "success") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[120] flex flex-col items-center gap-2 pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="pointer-events-auto flex items-center gap-2.5 rounded-lg border border-edge bg-panel px-4 py-2.5 shadow-2xl animate-rise"
            >
              <ToastIcon variant={t.variant} />
              <span className="text-sm font-medium text-slate-100">{t.message}</span>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}
