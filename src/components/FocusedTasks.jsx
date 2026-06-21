import { Link } from "react-router-dom";
import { CATEGORIES, isTaskComplete } from "../data/tasks";
import { useProgress, usePinned, useCustomTasks } from "../hooks/useLocalStorage";
import TaskItem, { itemPinKey } from "./TaskItem";
import { useToast } from "./Toast";

// A single pinned checklist item (e.g. one book) shown in the Focused section.
function FocusedItem({ parentTask, item, accent, value, setTask, onUnpin }) {
  const checked = value?.checked ?? {};
  const done = !!checked[item.id];

  const toggle = () =>
    setTask(parentTask.id, {
      items: value?.items ?? [],
      checked: { ...checked, [item.id]: !done },
    });

  return (
    <div
      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg border bg-panel/60"
      style={{ borderColor: "var(--color-edge)" }}
    >
      <button
        type="button"
        onClick={toggle}
        className="flex-1 min-w-0 flex items-center gap-3 text-left hover:opacity-90 transition-opacity"
      >
        <span
          className="shrink-0 grid place-items-center w-6 h-6 rounded-md border-2 transition-all duration-200"
          style={{
            borderColor: "rgba(255,255,255,0.18)",
            background: "transparent",
          }}
        />
        <span className="flex-1 text-[15px] font-medium leading-snug text-slate-100">
          {item.name}
          <span className="ml-2 text-xs uppercase tracking-wide text-slate-500">
            {parentTask.name}
          </span>
        </span>
      </button>
      <button
        type="button"
        aria-label="Unpin item"
        title="Unpin"
        onClick={onUnpin}
        className="shrink-0 grid place-items-center w-7 h-7 rounded-md transition-colors hover:bg-white/5"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4"
          fill={accent}
          stroke={accent}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 6px ${accent}88)` }}
        >
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.4 6.8L12 17.8 5.9 21.3l1.4-6.8L2.2 9.7l6.9-.7L12 2z" />
        </svg>
      </button>
    </div>
  );
}

// Shows starred (pinned) tasks as a "Focused Tasks" block at the top of a page.
// Pass `category` to scope it to a single category (e.g. the Money page shows
// only starred Money tasks). Omit it to show pinned tasks from every category.
// Small chip showing which category a focused task belongs to (used on the
// aggregate/home view where pins from every category are mixed together).
function CategoryBadge({ category }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 self-start rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
      style={{
        color: category.accent,
        background: `${category.accent}1a`,
        border: `1px solid ${category.accent}44`,
      }}
    >
      <span aria-hidden>{category.icon}</span>
      {category.name}
    </span>
  );
}

// Renders nothing when there are no matching pins.
export default function FocusedTasks({ category }) {
  const [progress, setTask] = useProgress();
  const [pinned, togglePin] = usePinned();
  const { customTasks, editTask } = useCustomTasks();
  const toast = useToast();
  // On the home view no category is passed → pins are aggregated, so label them.
  const showCategory = !category;

  // Only show pinned tasks that aren't completed yet — once a focused task is
  // done it leaves this section and rejoins the main list (at the top).
  const scope = category ? [category] : CATEGORIES;
  const focus = [];
  for (const c of scope) {
    for (const t of c.tasks) {
      if (pinned[t.id] && !isTaskComplete(t, progress[t.id])) {
        focus.push({ task: t, category: c });
      }
    }
  }

  // Pinned individual checklist items (e.g. one book). Keys look like
  // "taskId::itemId". Show only items that still exist and aren't checked yet.
  const scopeIds = new Set(scope.map((c) => c.id));
  const focusItems = [];
  for (const key of Object.keys(pinned)) {
    if (!pinned[key] || !key.includes("::")) continue;
    const [taskId, itemId] = key.split("::");
    let parentTask = null;
    let cat = null;
    for (const c of scope) {
      const t = c.tasks.find((x) => x.id === taskId);
      if (t) {
        parentTask = t;
        cat = c;
        break;
      }
    }
    if (!parentTask || !scopeIds.has(cat.id)) continue;
    const value = progress[taskId];
    const item = value?.items?.find((i) => i.id === itemId);
    if (!item) continue; // item was deleted
    if (value?.checked?.[itemId]) continue; // already done
    focusItems.push({ key, parentTask, item, category: cat, value });
  }

  if (focus.length === 0 && focusItems.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xs uppercase tracking-[0.2em] text-amber-300/90 mb-3 flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#facc15" stroke="#facc15" strokeWidth="1.5">
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.4 6.8L12 17.8 5.9 21.3l1.4-6.8L2.2 9.7l6.9-.7L12 2z" />
        </svg>
        Focused Tasks
      </h2>
      <ul className="flex flex-col gap-2.5">
        {focusItems.map(({ key, parentTask, item, category: cat, value }) => (
          <li key={key} className="flex flex-col gap-1.5">
            {showCategory && <CategoryBadge category={cat} />}
            <div className="relative">
              <FocusedItem
                parentTask={parentTask}
                item={item}
                accent={cat.accent}
                value={value}
                setTask={setTask}
                onUnpin={() => togglePin(key)}
              />
              {/* On home, the row navigates to its category instead of toggling */}
              {showCategory && (
                <Link
                  to={`/${cat.id}`}
                  aria-label={`Go to ${cat.name}`}
                  className="absolute inset-0 rounded-lg"
                />
              )}
            </div>
          </li>
        ))}
        {focus.map(({ task, category: cat }) => {
          const isCustom = (customTasks[cat.id] ?? []).some((t) => t.id === task.id);
          return (
            <li key={task.id} className="flex flex-col gap-1.5">
              {showCategory && <CategoryBadge category={cat} />}
              <div className="relative">
                <TaskItem
                  task={task}
                  value={progress[task.id]}
                  accent={cat.accent}
                  pinned={!!pinned[task.id]}
                  onChange={(next) => setTask(task.id, next)}
                  onTogglePin={() => togglePin(task.id)}
                  onEdit={
                    showCategory
                      ? undefined
                      : (changes) => {
                          const typeChanged = changes.type !== task.type;
                          editTask(cat.id, task.id, isCustom, changes, typeChanged);
                          toast("Task updated successfully");
                        }
                  }
                />
                {/* On home, the row navigates to its category instead of toggling */}
                {showCategory && (
                  <Link
                    to={`/${cat.id}`}
                    aria-label={`Go to ${cat.name}`}
                    className="absolute inset-0 rounded-lg"
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 h-0.5 w-full rounded-full bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />
    </section>
  );
}
