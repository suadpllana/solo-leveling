import { isTaskComplete } from "../data/tasks";

function CheckBox({ done, accent }) {
  return (
    <span
      className="shrink-0 grid place-items-center w-6 h-6 rounded-md border-2 transition-all duration-200"
      style={{
        borderColor: done ? accent : "rgba(255,255,255,0.18)",
        background: done ? accent : "transparent",
        boxShadow: done ? `0 0 12px ${accent}66` : "none",
      }}
    >
      {done && (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#05060a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      )}
    </span>
  );
}

function ProgressBar({ pct, accent }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
      <div
        className="h-full rounded-full transition-[width] duration-300"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${accent}aa, ${accent})`,
          boxShadow: `0 0 10px ${accent}88`,
        }}
      />
    </div>
  );
}

function PinButton({ pinned, accent, onClick }) {
  return (
    <button
      type="button"
      aria-label={pinned ? "Unpin task" : "Pin task to focus"}
      title={pinned ? "Unpin" : "Pin to focus"}
      onClick={onClick}
      className="shrink-0 grid place-items-center w-7 h-7 rounded-md transition-colors hover:bg-white/5"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 transition-all"
        fill={pinned ? accent : "none"}
        stroke={pinned ? accent : "rgba(255,255,255,0.3)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: pinned ? `drop-shadow(0 0 6px ${accent}88)` : "none" }}
      >
        <path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.4 6.8L12 17.8 5.9 21.3l1.4-6.8L2.2 9.7l6.9-.7L12 2z" />
      </svg>
    </button>
  );
}

export default function TaskItem({ task, value, accent, pinned, onChange, onTogglePin }) {
  const done = isTaskComplete(task, value);

  if (task.type === "check") {
    return (
      <div
        className="group w-full flex items-center gap-3 px-3.5 py-3 rounded-lg border bg-panel/60 transition-colors duration-200"
        style={{ borderColor: done ? `${accent}55` : "var(--color-edge)" }}
      >
        <button
          type="button"
          onClick={() => onChange(!value)}
          className="flex-1 min-w-0 flex items-center gap-3 text-left hover:opacity-90 transition-opacity"
        >
          <CheckBox done={done} accent={accent} />
          <span
            className={`flex-1 text-[15px] font-medium leading-snug transition-colors ${
              done ? "line-through text-slate-500" : "text-slate-100"
            }`}
          >
            {task.name}
          </span>
        </button>
        <PinButton pinned={pinned} accent={accent} onClick={onTogglePin} />
      </div>
    );
  }

  // progress task
  const count = Math.min(value ?? 0, task.target);
  const pct = Math.round((count / task.target) * 100);

  return (
    <div
      className="px-3.5 py-3 rounded-lg border bg-panel/60 transition-colors duration-200"
      style={{ borderColor: done ? `${accent}55` : "var(--color-edge)" }}
    >
      <div className="flex items-center gap-3 mb-2.5">
        <CheckBox done={done} accent={accent} />
        <span
          className={`flex-1 text-[15px] font-medium leading-snug ${
            done ? "line-through text-slate-500" : "text-slate-100"
          }`}
        >
          {task.name}
        </span>
        <span
          className="font-mono text-sm font-bold tabular-nums shrink-0"
          style={{ color: done ? accent : "#cbd5e1" }}
        >
          {count}
          <span className="text-slate-500">/{task.target}</span>
        </span>
        <PinButton pinned={pinned} accent={accent} onClick={onTogglePin} />
      </div>

      <div className="flex items-center gap-3">
        <ProgressBar pct={pct} accent={accent} />
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            aria-label="Decrease"
            onClick={() => onChange(Math.max(0, (value ?? 0) - 1))}
            disabled={(value ?? 0) <= 0}
            className="w-7 h-7 grid place-items-center rounded-md border border-edge text-slate-300 text-lg font-bold leading-none hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            −
          </button>
          <button
            type="button"
            aria-label="Increase"
            onClick={() => onChange(Math.min(task.target, (value ?? 0) + 1))}
            disabled={done}
            className="w-7 h-7 grid place-items-center rounded-md text-lg font-bold leading-none text-[#05060a] disabled:opacity-40 disabled:cursor-not-allowed transition"
            style={{ background: accent, boxShadow: `0 0 10px ${accent}66` }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
