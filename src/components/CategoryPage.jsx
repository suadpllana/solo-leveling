import { useEffect, useState } from "react";
import { useParams, Navigate, useSearchParams } from "react-router-dom";
import { CATEGORY_MAP, categoryProgress, isTaskComplete, mergeCategoryTasks } from "../data/tasks";
import { useProgress, usePinned, useCustomTasks } from "../hooks/useLocalStorage";
import TaskItem from "./TaskItem";
import FocusedTasks from "./FocusedTasks";
import AddTask from "./AddTask";
import { useToast } from "./Toast";

export default function CategoryPage() {
  const { id } = useParams();
  const baseCategory = CATEGORY_MAP[id];
  const [progress, setTask] = useProgress();
  const [pinned, togglePin] = usePinned();
  const { customTasks, hiddenTasks, taskEdits, addCustomTask, deleteTask, editTask } =
    useCustomTasks();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight");

  // When arriving from the Stats page with ?highlight=<taskId>, scroll that
  // task into view and pulse it for ~2.5s, then drop the query param so a
  // refresh doesn't replay the animation.
  useEffect(() => {
    if (!highlightId) return;
    let cleared = false;
    const accent = CATEGORY_MAP[id]?.accent ?? "#22d3ee";
    // Wait a tick so the task list has rendered.
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(`task-${highlightId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.style.setProperty("--hl", accent);
        el.classList.add("task-highlight");
        setTimeout(() => el.classList.remove("task-highlight"), 2600);
      }
      // Remove the param (keep history clean) regardless of whether we found it.
      cleared = true;
      setSearchParams({}, { replace: true });
    });
    return () => {
      if (!cleared) cancelAnimationFrame(raf);
    };
  }, [highlightId, id, setSearchParams]);

  if (!baseCategory) return <Navigate to="/religion" replace />;

  // Merge built-in tasks (minus any deleted, plus any name/type edits) with
  // the user's custom tasks — shared with the dashboard so counts match.
  const category = mergeCategoryTasks(baseCategory, { customTasks, hiddenTasks, taskEdits });
  const customIds = new Set((customTasks[id] ?? []).map((t) => t.id));

  const pct = categoryProgress(category, progress);
  const doneCount = category.tasks.filter((t) => isTaskComplete(t, progress[t.id])).length;
  const accent = category.accent;

  // Pinned tasks are surfaced in the Focused Tasks section above, so the main
  // list shows only the un-pinned ones (no duplicates). Once a focused task is
  // completed it drops out of the Focused section and rejoins this list, where
  // completed tasks float to the top.
  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  function taskMatchesQuery(t) {
    if (t.name.toLowerCase().includes(q)) return true;
    if (t.type === "checklist") {
      const stored = progress[t.id];
      const storedItems = stored?.items ?? [];
      if (storedItems.some((it) => it.name.toLowerCase().includes(q))) return true;
      if ((t.defaultItems ?? []).some((name) => name.toLowerCase().includes(q))) return true;
    }
    return false;
  }

  const listTasks = category.tasks
    // While searching, match against the whole category by name or subtasks;
    // otherwise the main list hides pinned (still-active) tasks shown in the Focused section.
    .filter((t) =>
      searching
        ? taskMatchesQuery(t)
        : !pinned[t.id] || isTaskComplete(t, progress[t.id])
    )
    .sort((a, b) => {
      // Daily tasks always sit at the very top of the list.
      const aDaily = a.daily ? 1 : 0;
      const bDaily = b.daily ? 1 : 0;
      if (aDaily !== bDaily) return bDaily - aDaily;
      // Within each group, completed tasks float up.
      const aDone = isTaskComplete(a, progress[a.id]) ? 1 : 0;
      const bDone = isTaskComplete(b, progress[b.id]) ? 1 : 0;
      return bDone - aDone;
    });

  return (
    <main className="relative mx-auto max-w-3xl px-4 sm:px-6 pb-24 pt-6 animate-rise" key={id}>
   
      <div className="absolute right-4 sm:right-6 top-9 z-30">
        <AddTask
          accent={accent}
          onAdd={(task) => {
            addCustomTask(id, task);
            toast("Task added successfully");
          }}
        />
      </div>

      {/* Category header */}
      <header
        className="relative overflow-hidden rounded-2xl border p-5 sm:p-6 mb-6"
        style={{
          borderColor: `${accent}55`,
          background: `linear-gradient(135deg, ${accent}1f, transparent 55%), var(--color-panel)`,
          boxShadow: `0 0 0 1px ${accent}11, 0 18px 40px -24px ${accent}66`,
        }}
      >
        {/* ambient glow */}
        <div
          className="pointer-events-none absolute -top-20 -right-12 w-56 h-56 rounded-full blur-3xl glow-pulse"
          style={{ background: `${accent}26` }}
        />
        {/* accent edge highlight along the top */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}aa, transparent)` }}
        />

        <div className="relative flex items-center gap-4 pr-12 sm:pr-32">
          <div
            className="grid place-items-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl text-3xl sm:text-4xl shrink-0 border"
            style={{
              borderColor: `${accent}66`,
              background: `${accent}1f`,
              boxShadow: `inset 0 0 18px ${accent}33, 0 0 18px ${accent}22`,
            }}
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
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 uppercase tracking-[0.2em]">
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

      {/* Search */}
      <div className="relative mb-4">
        <svg
          viewBox="0 0 24 24"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${category.name} tasks…`}
          className="w-full bg-panel/60 border border-edge rounded-lg pl-9 pr-9 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-white/25 transition-colors"
        />
        {searching && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 grid place-items-center w-6 h-6 rounded-md text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Focused (starred) tasks — hidden while searching to avoid confusion */}
      {!searching && <FocusedTasks category={category} />}

      {/* Task list — pinned tasks are shown in the Focused section above */}
      {listTasks.length === 0 ? (
        <p className="text-sm text-slate-500 rounded-xl border border-dashed border-edge bg-panel/40 p-4 text-center">
          No tasks match “{query}”.
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {listTasks.map((task) => (
            <li key={task.id} id={`task-${task.id}`}>
              <TaskItem
                task={task}
                value={progress[task.id]}
                accent={accent}
                pinned={!!pinned[task.id]}
                onChange={(next) => setTask(task.id, next)}
                onTogglePin={() => togglePin(task.id)}
                onDelete={() => {
                  deleteTask(id, task.id, customIds.has(task.id));
                  toast("Task deleted successfully");
                }}
                onEdit={(changes) => {
                  const typeChanged = changes.type !== task.type;
                  editTask(id, task.id, customIds.has(task.id), changes, typeChanged);
                  toast("Task updated successfully");
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
