import { computePace } from "../data/tasks";

// "Are you on track?" — compares actual completion against the steady pace
// expected by the deadline, and shows how much you need to do to catch up.
export default function PaceIndicator({ totalTasks, totalDone }) {
  const p = computePace({ totalTasks, totalDone });

  const theme = p.finished
    ? { color: "#34d399", label: "Complete", tint: "rgba(52,211,153," }
    : p.overdue
    ? { color: "#f87171", label: "Overdue", tint: "rgba(248,113,113," }
    : p.status === "ahead"
    ? { color: "#34d399", label: "Ahead of pace", tint: "rgba(52,211,153," }
    : p.status === "behind"
    ? { color: "#f87171", label: "Behind pace", tint: "rgba(248,113,113," }
    : { color: "#fbbf24", label: "On track", tint: "rgba(251,191,36," };

  const perMonth = Math.ceil(p.perMonthNeeded);
  const expectedClamped = Math.min(100, Math.max(0, p.expectedPct));

  return (
    <section
      className="relative overflow-hidden rounded-2xl border p-5 mb-6"
      style={{
        borderColor: `${theme.tint}0.4)`,
        background: `linear-gradient(135deg, ${theme.tint}0.10), transparent 55%), var(--color-panel)`,
        boxShadow: `0 0 0 1px ${theme.tint}0.07), 0 18px 40px -24px ${theme.tint}0.4)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${theme.tint}0.6), transparent)` }}
      />

      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-xs uppercase tracking-[0.2em] text-slate-400">Pace</h2>
        <span
          className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-md"
          style={{ color: theme.color, background: `${theme.tint}0.12)`, border: `1px solid ${theme.tint}0.4)` }}
        >
          {theme.label}
        </span>
      </div>

      {/* Progress vs. expected marker */}
      <div className="relative h-2.5 w-full rounded-full bg-white/[0.06] overflow-visible border border-white/5">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width: `${p.actualPct}%`,
            background: `linear-gradient(90deg, ${theme.color}99, ${theme.color})`,
            boxShadow: `0 0 14px ${theme.tint}0.7)`,
          }}
        />
        {/* "should be here by now" marker */}
        {!p.finished && (
          <div
            className="absolute -top-1 bottom-[-0.25rem] w-0.5 bg-white/70"
            style={{ left: `${expectedClamped}%` }}
            title={`Expected ~${p.expectedPct}% by now`}
          />
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="font-mono" style={{ color: theme.color }}>
          {p.actualPct}% done
        </span>
        {!p.finished && (
          <span className="font-mono text-slate-500">
            target ~{p.expectedPct}% by now
          </span>
        )}
      </div>

      {/* Plain-language summary */}
      <p className="mt-3 text-sm text-slate-300 leading-snug">
        {p.finished ? (
          <>Every task is complete. 🎉</>
        ) : p.overdue ? (
          <>
            The deadline has passed with{" "}
            <span className="font-bold text-slate-100">{p.remainingTasks}</span> tasks left.
          </>
        ) : (
          <>
            You&apos;re{" "}
            <span className="font-bold" style={{ color: theme.color }}>
              {p.deltaPct >= 0 ? `${p.deltaPct}% ahead` : `${Math.abs(p.deltaPct)}% behind`}
            </span>{" "}
            of the steady pace. To finish the remaining{" "}
            <span className="font-bold text-slate-100">{p.remainingTasks}</span> tasks in{" "}
            <span className="font-bold text-slate-100">{p.daysLeft}</span> days, aim for about{" "}
            <span className="font-bold text-slate-100">{perMonth}</span> task
            {perMonth === 1 ? "" : "s"} / month.
          </>
        )}
      </p>
    </section>
  );
}
