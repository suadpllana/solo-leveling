import { Link } from "react-router-dom";
import {
  CATEGORIES,
  categoryProgress,
  categoryDoneCount,
  collectDailyTaskIds,
  isTaskComplete,
  mergeCategoryTasks,
  checklistCount,
  checklistGoal,
} from "../data/tasks";
import { useProgress, usePinned, useCustomTasks } from "../hooks/useLocalStorage";
import FocusedTasks from "./FocusedTasks";
import PaceIndicator from "./PaceIndicator";

function Ring({ pct, accent, size = 56 }) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={accent}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 0.6s ease",
          filter: `drop-shadow(0 0 5px ${accent}88)`,
        }}
      />
    </svg>
  );
}

export default function Dashboard() {
  const [progress] = useProgress();
  const [pinned] = usePinned();
  const { customTasks, hiddenTasks, taskEdits } = useCustomTasks();

  // Per-category stats — merge in custom/deleted/edited tasks so the counts
  // match what the category pages show.
  const stats = CATEGORIES.map((base) => {
    const c = mergeCategoryTasks(base, { customTasks, hiddenTasks, taskEdits });
    return {
      category: c,
      pct: categoryProgress(c, progress),
      done: categoryDoneCount(c, progress),
      total: c.tasks.length,
    };
  });

  const totalTasks = stats.reduce((n, s) => n + s.total, 0);
  const totalDone = stats.reduce((n, s) => n + s.done, 0);
  const overallPct = totalTasks ? Math.round((totalDone / totalTasks) * 100) : 0;

  // Pace is about finishing one-time milestones by the deadline — daily habits
  // never "finish", so they're excluded from the pace totals.
  const dailyIds = collectDailyTaskIds({ customTasks, taskEdits });
  const paceStats = stats.reduce(
    (acc, s) => {
      for (const t of s.category.tasks) {
        if (dailyIds.has(t.id)) continue;
        const state = progress[t.id];
        if (t.type === "checklist") {
          const goal = checklistGoal(t, state);
          const checked = checklistCount(state);
          acc.total += goal;
          acc.done += Math.min(checked, goal);
        } else if (t.type === "progress") {
          acc.total += t.target;
          acc.done += Math.min(state ?? 0, t.target);
        } else {
          acc.total += 1;
          if (isTaskComplete(t, state)) acc.done += 1;
        }
      }
      return acc;
    },
    { total: 0, done: 0 }
  );

  // Strongest / weakest by completion %
  const sorted = [...stats].sort((a, b) => b.pct - a.pct);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const hasPins = Object.keys(pinned).length > 0;

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 pb-24 pt-6 animate-rise">
      {/* Overall hero */}
      <section
        className="relative overflow-hidden rounded-2xl border border-cyan-400/40 p-5 sm:p-6 mb-6"
        style={{
          background: "linear-gradient(135deg, rgba(34,211,238,0.12), transparent 55%), var(--color-panel)",
          boxShadow: "0 0 0 1px rgba(34,211,238,0.07), 0 18px 40px -24px rgba(34,211,238,0.4)",
        }}
      >
        <div className="pointer-events-none absolute -top-20 -right-12 w-56 h-56 rounded-full blur-3xl glow-pulse" style={{ background: "rgba(34,211,238,0.22)" }} />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.67), transparent)" }}
        />
        <div className="relative flex items-center gap-5">
          <div className="relative grid place-items-center shrink-0">
            <Ring pct={overallPct} accent="#22d3ee" size={92} />
            <span className="absolute font-display font-black text-2xl text-cyan-300 tabular-nums">
              {overallPct}%
            </span>
          </div>
          <div className="min-w-0">
         
            <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wide leading-none text-white">
              Overview
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              <span className="font-mono font-bold text-cyan-300">{totalDone}</span>
              <span className="text-slate-500"> / {totalTasks} tasks complete across all paths</span>
            </p>
          </div>
        </div>
      </section>

      {/* Are you on track for the deadline? */}
      <PaceIndicator totalTasks={paceStats.total} totalDone={paceStats.done} />

      {/* Strongest / weakest momentum */}
      <section className="grid grid-cols-2 gap-3 mb-6">
        <Link
          to={`/${strongest.category.id}`}
          className="rounded-xl border border-edge bg-panel/60 p-4 hover:bg-panel-hi transition-colors"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/80 mb-2">Strongest</p>
          <div className="flex items-center gap-2">
            <span className="text-xl">{strongest.category.icon}</span>
            <span className="font-display font-bold uppercase text-sm" style={{ color: strongest.category.accent }}>
              {strongest.category.name}
            </span>
          </div>
          <p className="font-mono text-2xl font-black mt-1 tabular-nums" style={{ color: strongest.category.accent }}>
            {strongest.pct}%
          </p>
        </Link>
        <Link
          to={`/${weakest.category.id}`}
          className="rounded-xl border border-edge bg-panel/60 p-4 hover:bg-panel-hi transition-colors"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-rose-400/80 mb-2">Needs focus</p>
          <div className="flex items-center gap-2">
            <span className="text-xl">{weakest.category.icon}</span>
            <span className="font-display font-bold uppercase text-sm" style={{ color: weakest.category.accent }}>
              {weakest.category.name}
            </span>
          </div>
          <p className="font-mono text-2xl font-black mt-1 tabular-nums" style={{ color: weakest.category.accent }}>
            {weakest.pct}%
          </p>
        </Link>
      </section>

      {/* Per-category breakdown */}
      <section className="mb-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-3">All paths</h2>
        <div className="flex flex-col gap-2.5">
          {stats.map(({ category, pct, done, total }) => (
            <Link
              key={category.id}
              to={`/${category.id}`}
              className="group flex items-center gap-4 rounded-xl border border-edge bg-panel/60 p-3.5 hover:bg-panel-hi transition-colors"
              style={{ borderColor: `${category.accent}22` }}
            >
              <div className="relative grid place-items-center shrink-0">
                <Ring pct={pct} accent={category.accent} />
                <span className="absolute font-mono text-[11px] font-bold tabular-nums" style={{ color: category.accent }}>
                  {pct}%
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-display font-bold uppercase text-sm tracking-wide" style={{ color: category.accent }}>
                    {category.name}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-mono">{done}/{total} done</p>
              </div>
              <span className="text-slate-600 group-hover:text-slate-400 transition-colors text-lg">›</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Focused (starred) tasks — shared section used on every page */}
      {hasPins ? (
        <FocusedTasks />
      ) : (
        <section>
          <h2 className="text-xs uppercase tracking-[0.2em] text-amber-300/90 mb-3 flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#facc15" stroke="#facc15" strokeWidth="1.5">
              <path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.4 6.8L12 17.8 5.9 21.3l1.4-6.8L2.2 9.7l6.9-.7L12 2z" />
            </svg>
            Focused Tasks
          </h2>
          <p className="text-sm text-slate-500 rounded-xl border border-dashed border-edge bg-panel/40 p-4">
            No pinned tasks yet. Tap the ☆ star on any task to pin it here as a priority.
          </p>
        </section>
      )}
    </main>
  );
}
