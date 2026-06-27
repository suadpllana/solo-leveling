import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "../hooks/useScrollLock";

// Modal for editing a task's name and type. Pre-filled from the current task.
// Calls onSave({ name, type }) — only when something actually changed.
export default function EditTaskModal({ open, task, accent, onSave, onCancel }) {
  const [name, setName] = useState(task?.name ?? "");
  const [type, setType] = useState(task?.type ?? "check");
  const [daily, setDaily] = useState(!!task?.daily);

  useScrollLock(open);

  // Re-sync the form whenever a different task is opened.
  useEffect(() => {
    if (open) {
      setName(task?.name ?? "");
      setType(task?.type ?? "check");
      setDaily(!!task?.daily);
    }
  }, [open, task]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const trimmed = name.trim();
  const dirty =
    trimmed && (trimmed !== task.name || type !== task.type || daily !== !!task.daily);

  const save = () => {
    if (!dirty) return;
    onSave({ name: trimmed, type, daily });
  };

  const TypeButton = ({ value, label, hint }) => {
    const active = type === value;
    return (
      <button
        type="button"
        onClick={() => setType(value)}
        className="flex-1 rounded-md border px-3 py-2 text-left transition-colors"
        style={{
          borderColor: active ? accent : "var(--color-edge)",
          background: active ? `${accent}1a` : "transparent",
        }}
      >
        <span
          className="block text-sm font-semibold"
          style={{ color: active ? accent : "#e2e8f0" }}
        >
          {label}
        </span>
        <span className="block text-xs text-slate-500 mt-0.5">{hint}</span>
      </button>
    );
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid justify-items-center items-start p-4 pt-[20vh]"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative w-full max-w-sm rounded-xl border border-edge bg-panel p-5 shadow-2xl animate-rise">
        <h3 className="text-base font-bold text-slate-100 mb-3">Edit task</h3>

        <input
          type="text"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && dirty) save();
          }}
          placeholder="Task name…"
          className="w-full bg-white/[0.04] border border-edge rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-white/25 transition-colors"
        />

        <div className="flex gap-2 mt-3">
          <TypeButton value="check" label="Check" hint="Done / not done" />
          <TypeButton value="checklist" label="Checklist" hint="Sub-items" />
        </div>

        <button
          type="button"
          onClick={() => setDaily((d) => !d)}
          className="mt-3 w-full flex items-center justify-between rounded-md border px-3 py-2 transition-colors"
          style={{
            borderColor: daily ? accent : "var(--color-edge)",
            background: daily ? `${accent}1a` : "transparent",
          }}
        >
          <span className="text-left">
            <span
              className="block text-sm font-semibold"
              style={{ color: daily ? accent : "#e2e8f0" }}
            >
              Daily
            </span>
            <span className="block text-xs text-slate-500 mt-0.5">Resets every 24h</span>
          </span>
          <span
            className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors"
            style={{ background: daily ? accent : "rgba(255,255,255,0.15)" }}
          >
            <span
              className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              style={{ transform: daily ? "translateX(18px)" : "translateX(2px)" }}
            />
          </span>
        </button>

        {type !== task.type && (
          <p className="mt-2 text-xs text-amber-300/80 leading-snug">
            Changing the type will reset this task's progress.
          </p>
        )}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!dirty}
            className="px-4 py-2 rounded-md text-sm font-bold text-[#05060a] disabled:opacity-40 disabled:cursor-not-allowed transition"
            style={{ background: accent, boxShadow: `0 0 10px ${accent}66` }}
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
