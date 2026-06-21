import { CATEGORIES } from "../data/tasks";
import { useProgress, usePinned } from "../hooks/useLocalStorage";
import TaskItem from "./TaskItem";

// Shows starred (pinned) tasks as a "Focused Tasks" block at the top of a page.
// Pass `category` to scope it to a single category (e.g. the Money page shows
// only starred Money tasks). Omit it to show pinned tasks from every category.
// Renders nothing when there are no matching pins.
export default function FocusedTasks({ category }) {
  const [progress, setTask] = useProgress();
  const [pinned, togglePin] = usePinned();

  const scope = category ? [category] : CATEGORIES;
  const focus = [];
  for (const c of scope) {
    for (const t of c.tasks) {
      if (pinned[t.id]) focus.push({ task: t, category: c });
    }
  }

  if (focus.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xs uppercase tracking-[0.2em] text-amber-300/90 mb-3 flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#facc15" stroke="#facc15" strokeWidth="1.5">
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.4 6.8L12 17.8 5.9 21.3l1.4-6.8L2.2 9.7l6.9-.7L12 2z" />
        </svg>
        Focused Tasks
      </h2>
      <ul className="flex flex-col gap-2.5">
        {focus.map(({ task, category }) => (
          <li key={task.id} className="flex items-center gap-2">
            <span className="text-base shrink-0" title={category.name}>
              {category.icon}
            </span>
            <div className="flex-1 min-w-0">
              <TaskItem
                task={task}
                value={progress[task.id]}
                accent={category.accent}
                pinned={!!pinned[task.id]}
                onChange={(next) => setTask(task.id, next)}
                onTogglePin={() => togglePin(task.id)}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
