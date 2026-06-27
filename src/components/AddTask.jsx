import { useState } from "react";

// "Add Task" control for a category page. Renders a compact button (meant to
// sit in the header's top-right); clicking it opens a dropdown form where you
// name the task and pick whether it's a simple check or an expandable checklist.
export default function AddTask({ accent, onAdd }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("check");
  const [daily, setDaily] = useState(false);

  const reset = () => {
    setName("");
    setType("check");
    setDaily(false);
    setOpen(false);
  };

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const base =
      type === "checklist"
        ? { id, type: "checklist", name: trimmed, target: 1 }
        : { id, type: "check", name: trimmed };
    const task = daily ? { ...base, daily: true } : base;
    onAdd(task);
    reset();
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

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-semibold transition-colors mr-2"
        style={{
          borderColor: `${accent}66`,
          background: `${accent}1a`,
          color: accent,
        }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span className="hidden sm:inline">Add Task</span>
      </button>

      {open && (
        <>
          {/* click-away backdrop */}
          <div className="fixed inset-0 z-10" onClick={reset} />
          <div
            className="absolute right-0 top-full mt-2 z-20 w-[min(18rem,calc(100vw-2rem))] rounded-lg border bg-panel p-3.5 flex flex-col gap-3 shadow-xl"
            style={{ borderColor: `${accent}55` }}
          >
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
                if (e.key === "Escape") reset();
              }}
              placeholder="Task name…"
              className="w-full bg-white/[0.04] border border-edge rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-white/25 transition-colors"
            />

            <div className="flex gap-2">
              <TypeButton value="check" label="Check" hint="Done / not done" />
              <TypeButton value="checklist" label="Checklist" hint="Sub-items" />
            </div>

            <button
              type="button"
              onClick={() => setDaily((d) => !d)}
              className="flex items-center justify-between rounded-md border px-3 py-2 transition-colors"
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
                <span className="block text-xs text-slate-500 mt-0.5">
                  Resets every 24h
                </span>
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

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={reset}
                className="px-3 py-1.5 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={!name.trim()}
                className="px-4 py-1.5 rounded-md text-sm font-bold text-[#05060a] disabled:opacity-40 disabled:cursor-not-allowed transition"
                style={{ background: accent, boxShadow: `0 0 10px ${accent}66` }}
              >
                Add
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
