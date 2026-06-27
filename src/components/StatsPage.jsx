import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CATEGORY_MAP,
  collectDailyTaskIds,
  dayKey,
  formatDayLabel,
  mergeAllTasks,
} from "../data/tasks";
import { useCompletions, useCustomTasks } from "../hooks/useLocalStorage";

// ── STATS PAGE ──
// A day-by-day journal of what got done. Each day is a card split into two
// sections:
//   • Daily tasks   — the recurring habits, shown as done / not done
//   • One-time tasks — milestones completed that day (or "No tasks done…")
// History comes from the completion log (solo-completions); the live daily-task
// set is used to know which dailies exist so "not done" can be shown.

function CheckIcon({ done, accent }) {
  return (
    <span
      className="shrink-0 grid place-items-center w-5 h-5 rounded-md border-2"
      style={{
        borderColor: done ? accent : "rgba(255,255,255,0.16)",
        background: done ? accent : "transparent",
        boxShadow: done ? `0 0 10px ${accent}66` : "none",
      }}
    >
      {done ? (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="#05060a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 6l12 12M6 18L18 6" />
        </svg>
      )}
    </span>
  );
}

function SectionLabel({ children, accent, count }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span
        className="text-[11px] font-bold uppercase tracking-[0.2em]"
        style={{ color: accent }}
      >
        {children}
      </span>
      {count != null && (
        <span className="text-[11px] font-mono text-slate-500">· {count}</span>
      )}
      <span
        className="flex-1 h-px"
        style={{ background: `linear-gradient(90deg, ${accent}44, transparent)` }}
      />
    </div>
  );
}

// A row for a single task in a day card. Clicking it jumps to the task's
// category and highlights it. The category chip is pushed to the far right.
function TaskRow({ taskId, name, done, accent, categoryId, onOpen }) {
  const clickable = !!categoryId;
  return (
    <li>
      <button
        type="button"
        onClick={() => clickable && onOpen(categoryId, taskId)}
        disabled={!clickable}
        className="group w-full flex items-center gap-2.5 text-left rounded-md px-1.5 py-1 -mx-1.5 transition-colors enabled:hover:bg-white/[0.04] enabled:cursor-pointer"
      >
        <CheckIcon done={done} accent={accent} />
        <span
          className={`text-sm leading-snug transition-colors ${
            done
              ? "text-slate-200 group-enabled:group-hover:text-white"
              : "text-slate-500 line-through decoration-slate-700"
          }`}
        >
          {name}
        </span>
        <CatChip categoryId={categoryId} />
      </button>
    </li>
  );
}

// Small category chip used on one-time completions (they can come from anywhere).
function CatChip({ categoryId }) {
  const cat = CATEGORY_MAP[categoryId];
  if (!cat) return null;
  return (
    <span
      className="ml-auto shrink-0 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{ color: cat.accent, background: `${cat.accent}14`, border: `1px solid ${cat.accent}44` }}
    >
      <span aria-hidden>{cat.icon}</span>
      {cat.name}
    </span>
  );
}

function DayCard({ dayLabel, isToday, dailyRows, oneTimeRows, accent, onOpen }) {
  const dailyDone = dailyRows.filter((r) => r.done).length;
  return (
    <article
      className="relative overflow-hidden rounded-2xl border p-5 sm:p-6"
      style={{
        borderColor: "var(--color-edge)",
        background: "linear-gradient(160deg, rgba(255,255,255,0.03), transparent 60%), var(--color-panel)",
      }}
    >
      {/* accent edge */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}88, transparent)` }}
      />

      {/* Day header */}
      <header className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <h2 className="font-display text-lg sm:text-xl font-black tracking-wide text-white truncate">
            {dayLabel}
          </h2>
          {isToday && (
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{ color: accent, background: `${accent}1a`, border: `1px solid ${accent}55` }}
            >
              Today
            </span>
          )}
        </div>
        {dailyRows.length > 0 && (
          <span className="shrink-0 font-mono text-xs text-slate-400">
            <span className="font-bold" style={{ color: accent }}>{dailyDone}</span>
            /{dailyRows.length} daily
          </span>
        )}
      </header>

      {/* Daily tasks */}
      {dailyRows.length > 0 && (
        <div className="mb-5">
          <SectionLabel accent="#38bdf8">Daily tasks</SectionLabel>
          <ul className="flex flex-col gap-2">
            {dailyRows.map((r) => (
              <TaskRow
                key={r.id}
                taskId={r.id}
                name={r.name}
                done={r.done}
                accent="#38bdf8"
                categoryId={r.categoryId}
                onOpen={onOpen}
              />
            ))}
          </ul>
        </div>
      )}

      {/* One-time tasks */}
      <div>
        <SectionLabel accent="#fbbf24" count={oneTimeRows.length || null}>
          One-time tasks
        </SectionLabel>
        {oneTimeRows.length === 0 ? (
          <p className="text-sm text-slate-500 italic rounded-lg border border-dashed border-edge bg-white/[0.02] px-3.5 py-3">
            No tasks done on this day.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {oneTimeRows.map((r) => (
              <TaskRow
                key={r.id}
                taskId={r.id}
                name={r.name}
                done
                accent="#fbbf24"
                categoryId={r.categoryId}
                onOpen={onOpen}
              />
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export default function StatsPage() {
  const completions = useCompletions();
  const { customTasks, hiddenTasks, taskEdits } = useCustomTasks();
  const navigate = useNavigate();

  // Jump to a task's category page and ask it to highlight that task.
  const openTask = (categoryId, taskId) =>
    navigate(`/${categoryId}?highlight=${taskId}`);

  const { days, totals } = useMemo(() => {
    const opts = { customTasks, hiddenTasks, taskEdits };
    const allTasks = mergeAllTasks(opts);
    const taskById = new Map(allTasks.map((t) => [t.id, t]));
    const dailyIds = collectDailyTaskIds(opts);
    // Live daily set, in their category-ordered sequence, for "not done" rows.
    const liveDaily = allTasks.filter((t) => dailyIds.has(t.id));

    const today = dayKey();
    // Every day we have a record for, plus today (so today always shows up).
    const keys = new Set(Object.keys(completions));
    keys.add(today);
    const sorted = [...keys].sort((a, b) => (a < b ? 1 : -1)); // newest first

    const days = sorted.map((key) => {
      const log = completions[key] ?? {};
      const doneIds = new Set(Object.keys(log));

      // Daily rows: union of the live daily set and any logged daily that may
      // no longer exist in the live set (deleted/edited away). Today shows the
      // live set with current done-state; past days reflect what was logged.
      const dailyRowMap = new Map();
      for (const t of liveDaily) {
        dailyRowMap.set(t.id, {
          id: t.id,
          name: t.name,
          done: doneIds.has(t.id),
          categoryId: t.categoryId,
        });
      }
      for (const id of doneIds) {
        if (log[id]?.daily && !dailyRowMap.has(id)) {
          dailyRowMap.set(id, {
            id,
            name: log[id].name,
            done: true,
            categoryId: log[id].categoryId,
          });
        }
      }
      const dailyRows = [...dailyRowMap.values()];

      // One-time rows: logged completions that aren't daily.
      const oneTimeRows = [];
      for (const id of doneIds) {
        const entry = log[id];
        if (entry?.daily) continue;
        oneTimeRows.push({
          id,
          name: entry?.name ?? taskById.get(id)?.name ?? "Unknown task",
          categoryId: entry?.categoryId ?? taskById.get(id)?.categoryId,
        });
      }

      return {
        key,
        dayLabel: formatDayLabel(key),
        isToday: key === today,
        dailyRows,
        oneTimeRows,
      };
    });

    const totals = {
      totalDays: days.length,
      totalOneTime: days.reduce((n, d) => n + d.oneTimeRows.length, 0),
      totalDailyDone: days.reduce(
        (n, d) => n + d.dailyRows.filter((r) => r.done).length,
        0
      ),
    };

    return { days, totals };
  }, [completions, customTasks, hiddenTasks, taskEdits]);

  const accent = "#22d3ee";

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 pb-24 pt-6 animate-rise">
      {/* Page header */}
      <header
        className="relative overflow-hidden rounded-2xl border p-5 sm:p-6 mb-6"
        style={{
          borderColor: `${accent}55`,
          background: `linear-gradient(135deg, ${accent}1f, transparent 55%), var(--color-panel)`,
          boxShadow: `0 0 0 1px ${accent}11, 0 18px 40px -24px ${accent}66`,
        }}
      >
        <div
          className="pointer-events-none absolute -top-20 -right-12 w-56 h-56 rounded-full blur-3xl glow-pulse"
          style={{ background: `${accent}26` }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}aa, transparent)` }}
        />
        <div className="relative">
          <h1
            className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wide leading-none"
            style={{ color: accent, textShadow: `0 0 22px ${accent}55` }}
          >
            Stats
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 uppercase tracking-[0.2em]">
            The record of your ascent
          </p>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <Stat label="Days logged" value={totals.totalDays} accent={accent} />
            <Stat label="Daily wins" value={totals.totalDailyDone} accent="#38bdf8" />
            <Stat label="Milestones" value={totals.totalOneTime} accent="#fbbf24" />
          </div>
        </div>
      </header>

      {/* Day cards */}
      <div className="flex flex-col gap-5">
        {days.map((d) => (
          <DayCard key={d.key} {...d} accent={accent} onOpen={openTask} />
        ))}
      </div>
    </main>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div
      className="rounded-xl border px-3 py-3 text-center"
      style={{ borderColor: "var(--color-edge)", background: "rgba(255,255,255,0.02)" }}
    >
      <div className="font-display text-2xl font-black tabular-nums" style={{ color: accent }}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500 mt-0.5">
        {label}
      </div>
    </div>
  );
}
