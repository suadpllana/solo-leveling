import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "../hooks/useScrollLock";

// A centered confirmation dialog. Rendered only when `open` is true.
// Closes on Escape or backdrop click (treated as cancel).
export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) {
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  // Rendered into <body> via a portal so the fixed overlay is positioned
  // against the viewport — not against any transformed/blurred ancestor
  // (e.g. the animate-rise <main>), which would otherwise break `fixed`.
  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid justify-items-center items-start p-4 pt-[40vh]"
      role="dialog"
      aria-modal="true"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* dialog */}
      <div className="relative w-full max-w-sm rounded-xl border border-edge bg-panel p-5 shadow-2xl animate-rise">
        <div className="flex items-start gap-3">
          <div className="shrink-0 grid place-items-center w-10 h-10 rounded-lg bg-red-500/15 text-red-400">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-100">{title}</h3>
            {message && (
              <p className="mt-1 text-sm text-slate-400 leading-snug">{message}</p>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            autoFocus
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-sm font-bold text-white bg-red-500/90 hover:bg-red-500 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
