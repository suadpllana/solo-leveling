import { useParams, Navigate } from "react-router-dom";
import { CATEGORY_MAP, categoryProgress, isTaskComplete } from "../data/tasks";
import { useProgress, usePinned } from "../hooks/useLocalStorage";
import TaskItem from "./TaskItem";
import FocusedTasks from "./FocusedTasks";

export default function CategoryPage() {
  const { id } = useParams();
  const category = CATEGORY_MAP[id];
  const [progress, setTask] = useProgress();
  const [pinned, togglePin] = usePinned();

  if (!category) return <Navigate to="/religion" replace />;

  const pct = categoryProgress(category, progress);
  const doneCount = category.tasks.filter((t) => isTaskComplete(t, progress[t.id])).length;
  const accent = category.accent;

  // Pinned tasks are surfaced in the Focused Tasks section above, so the main
  // list shows only the un-pinned ones (no duplicates).
  const listTasks = category.tasks.filter((t) => !pinned[t.id]);

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 pb-24 pt-6 animate-rise" key={id}>
      {/* Category header */}
      <header
        className="clip-panel relative overflow-hidden rounded-xl border p-5 sm:p-6 mb-6"
        style={{
          borderColor: `${accent}44`,
          background: `linear-gradient(135deg, ${accent}14, transparent 60%), var(--color-panel)`,
        }}
      >
        <div
          className="absolute -top-16 -right-10 w-48 h-48 rounded-full blur-3xl glow-pulse"
          style={{ background: `${accent}22` }}
        />
        <div className="relative flex items-center gap-4">
          <div
            className="grid place-items-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl text-3xl sm:text-4xl shrink-0 border"
            style={{ borderColor: `${accent}55`, background: `${accent}1a` }}
          >
            {category.icon}
          </div>
          <div className="min-w-0 flex-1">
            <h1
              className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wide leading-none"
              style={{ color: accent, textShadow: `0 0 22px ${accent}55` }}
            >
              {category.name}
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 uppercase tracking-[0.2em]">
              {category.tagline}
            </p>
          </div>
        </div>

        {/* Overall progress */}
        <div className="relative mt-5">
          <div className="flex items-end justify-between mb-2">
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Overall Progress
            </span>
            <span className="font-mono text-sm text-slate-300">
              <span className="font-bold" style={{ color: accent }}>
                {doneCount}
              </span>
              /{category.tasks.length} · {pct}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-white/[0.06] overflow-hidden border border-white/5">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${accent}99, ${accent})`,
                boxShadow: `0 0 14px ${accent}aa`,
              }}
            />
          </div>
        </div>
      </header>

      {/* Focused (starred) tasks for this category */}
      <FocusedTasks category={category} />

      {/* Task list — pinned tasks are shown in the Focused section above */}
      <ul className="flex flex-col gap-2.5">
        {listTasks.map((task) => (
          <li key={task.id}>
            <TaskItem
              task={task}
              value={progress[task.id]}
              accent={accent}
              pinned={!!pinned[task.id]}
              onChange={(next) => setTask(task.id, next)}
              onTogglePin={() => togglePin(task.id)}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
