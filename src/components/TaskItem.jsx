import { useState } from "react";
import { isTaskComplete, checklistCount, checklistGoal } from "../data/tasks";
import { usePinned } from "../hooks/useLocalStorage";
import ConfirmModal from "./ConfirmModal";
import EditTaskModal from "./EditTaskModal";

// A single checklist item is focusable on its own. We reuse the same pin map
// the tasks use, with a composite key so one book/movie can sit in the
// Focused section without pinning the whole "Read 8 books" task.
export const itemPinKey = (taskId, itemId) => `${taskId}::${itemId}`;

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

// Small badge marking a task as daily (resets every 24h).
function DailyBadge({ accent }) {
  return (
    <span
      className="shrink-0 inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={{ borderColor: `${accent}66`, color: accent, background: `${accent}14` }}
      title="Resets every 24h"
    >
      <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
      </svg>
      Daily
    </span>
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

// Edit button that opens a modal to change the task's name and type.
function EditTaskButton({ task, accent, onEdit }) {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Edit task"
        title="Edit task"
        onClick={() => setEditing(true)}
        className="shrink-0 grid place-items-center w-7 h-7 rounded-md text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
      </button>
      <EditTaskModal
        open={editing}
        task={task}
        accent={accent}
        onSave={(changes) => {
          setEditing(false);
          onEdit(changes);
        }}
        onCancel={() => setEditing(false)}
      />
    </>
  );
}

// Delete button that opens a confirmation modal so a task isn't removed by
// accident.
function DeleteTaskButton({ taskName, onConfirm }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Delete task"
        title="Delete task"
        onClick={() => setConfirming(true)}
        className="shrink-0 grid place-items-center w-7 h-7 rounded-md text-slate-500 hover:text-red-400 hover:bg-white/5 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
        </svg>
      </button>
      <ConfirmModal
        open={confirming}
        title="Delete this task?"
        message={
          taskName
            ? `“${taskName}” and its progress will be removed.`
            : "This task and its progress will be removed."
        }
        onConfirm={() => {
          setConfirming(false);
          onConfirm();
        }}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}

function ChecklistTask({ task, value, accent, onChange, onDelete, onEdit }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  // id of the item currently being renamed, and its working text
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState("");
  const [itemPins, toggleItemPin] = usePinned();

  const items = value?.items ?? [];
  const checked = value?.checked ?? {};
  const count = checklistCount(value);
  // Goal grows with the items you add (starts at task.target).
  const goal = checklistGoal(task, value);
  const done = count >= goal;
  const pct = goal === 0 ? 0 : Math.round((count / goal) * 100);

  const update = (next) => onChange({ items, checked, ...next });

  const addItem = () => {
    const name = draft.trim();
    if (!name) return;
    const id = `i_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    update({ items: [...items, { id, name }] });
    setDraft("");
  };

  const removeItem = (id) => {
    const nextChecked = { ...checked };
    delete nextChecked[id];
    if (itemPins[itemPinKey(task.id, id)]) toggleItemPin(itemPinKey(task.id, id));
    update({ items: items.filter((it) => it.id !== id), checked: nextChecked });
  };

  const toggleItem = (id) => {
    update({ checked: { ...checked, [id]: !checked[id] } });
  };

  const startEdit = (it) => {
    setEditingId(it.id);
    setEditDraft(it.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft("");
  };

  const saveEdit = () => {
    const name = editDraft.trim();
    if (!name) return;
    update({ items: items.map((it) => (it.id === editingId ? { ...it, name } : it)) });
    cancelEdit();
  };

  return (
    <div
      className="rounded-lg border bg-panel/60 transition-colors duration-200"
      style={{ borderColor: done ? `${accent}55` : "var(--color-edge)" }}
    >
      {/* Header row — click to expand */}
      <div className="flex items-center gap-3 px-3.5 py-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex-1 min-w-0 flex items-center gap-3 text-left cursor-pointer hover:opacity-90 transition-opacity"
        >
          <CheckBox done={done} accent={accent} />
          <span
            className={`flex-1 text-[15px] font-medium leading-snug ${
              done ? "line-through text-slate-500" : "text-slate-100"
            }`}
          >
            {task.name}
          </span>
          {task.daily && <DailyBadge accent={accent} />}
          <span
            className="font-mono text-sm font-bold tabular-nums shrink-0"
            style={{ color: done ? accent : "#cbd5e1" }}
          >
            {count}
            <span className="text-slate-500">/{goal}</span>
          </span>
          <svg
            viewBox="0 0 24 24"
            className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {onEdit && !done && <EditTaskButton task={task} accent={accent} onEdit={onEdit} />}
        {onDelete && <DeleteTaskButton taskName={task.name} onConfirm={onDelete} />}
      </div>

      {/* Progress bar (always visible) */}
      <div className="px-3.5 pb-3">
        <ProgressBar pct={pct} accent={accent} />
      </div>

      {/* Expanded item list */}
      {open && (
        <div className="border-t border-edge px-3.5 py-3 flex flex-col gap-2">
          {items.length === 0 && (
            <p className="text-sm text-slate-500 italic">
              No items yet — add your first one below.
            </p>
          )}
          {items.map((it) => {
            const itemDone = !!checked[it.id];
            const pinKey = itemPinKey(task.id, it.id);
            const editing = editingId === it.id;

            if (editing) {
              return (
                <div key={it.id} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    autoFocus
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="flex-1 min-w-0 bg-white/[0.04] border rounded-md px-2.5 py-1.5 text-sm text-slate-100 focus:outline-none transition-colors"
                    style={{ borderColor: accent }}
                  />
                  <button
                    type="button"
                    aria-label="Save item"
                    title="Save"
                    onClick={saveEdit}
                    disabled={!editDraft.trim()}
                    className="shrink-0 grid place-items-center w-7 h-7 rounded-md text-emerald-400 hover:bg-white/5 transition-colors disabled:opacity-40"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Cancel edit"
                    title="Cancel"
                    onClick={cancelEdit}
                    className="shrink-0 grid place-items-center w-7 h-7 rounded-md text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            }

            return (
              <div key={it.id} className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => toggleItem(it.id)}
                  className="flex-1 min-w-0 flex items-center gap-2.5 text-left cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <CheckBox done={itemDone} accent={accent} />
                  <span
                    className={`flex-1 text-sm leading-snug ${
                      itemDone ? "line-through text-slate-500" : "text-slate-200"
                    }`}
                  >
                    {it.name}
                  </span>
                </button>
                {!itemDone && (
                  <PinButton
                    pinned={!!itemPins[pinKey]}
                    accent={accent}
                    onClick={() => toggleItemPin(pinKey)}
                  />
                )}
                <button
                  type="button"
                  aria-label="Edit item"
                  title="Edit"
                  onClick={() => startEdit(it)}
                  className="shrink-0 grid place-items-center w-7 h-7 rounded-md text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Remove item"
                  title="Remove"
                  onClick={() => removeItem(it.id)}
                  className="shrink-0 grid place-items-center w-7 h-7 rounded-md text-slate-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}

          {/* Add-item input */}
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addItem();
              }}
              placeholder="Add an item…"
              className="flex-1 min-w-0 bg-white/[0.04] border border-edge rounded-md px-2.5 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-white/25 transition-colors"
            />
            <button
              type="button"
              onClick={addItem}
              disabled={!draft.trim()}
              className="shrink-0 w-8 h-8 grid place-items-center rounded-md text-lg font-bold leading-none text-[#05060a] disabled:opacity-40 disabled:cursor-not-allowed transition"
              style={{ background: accent, boxShadow: `0 0 10px ${accent}66` }}
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TaskItem({ task, value, accent, pinned, onChange, onTogglePin, onDelete, onEdit }) {
  const done = isTaskComplete(task, value);

  if (task.type === "checklist") {
    return (
      <ChecklistTask
        task={task}
        value={value}
        accent={accent}
        onChange={onChange}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );
  }

  if (task.type === "check") {
    return (
      <div
        className="group w-full flex items-center gap-3 px-3.5 py-3 rounded-lg border bg-panel/60 transition-colors duration-200"
        style={{ borderColor: done ? `${accent}55` : "var(--color-edge)" }}
      >
        <button
          type="button"
          onClick={() => onChange(!value)}
          className="flex-1 min-w-0 flex items-center gap-3 text-left cursor-pointer hover:opacity-90 transition-opacity"
        >
          <CheckBox done={done} accent={accent} />
          <span
            className={`flex-1 text-[15px] font-medium leading-snug transition-colors ${
              done ? "line-through text-slate-500" : "text-slate-100"
            }`}
          >
            {task.name}
          </span>
          {task.daily && <DailyBadge accent={accent} />}
        </button>
        {!done && (
          <PinButton pinned={pinned} accent={accent} onClick={onTogglePin} />
        )}
        {onEdit && !done && <EditTaskButton task={task} accent={accent} onEdit={onEdit} />}
        {onDelete && <DeleteTaskButton taskName={task.name} onConfirm={onDelete} />}
      </div>
    );
  }

  // Unknown task type — nothing to render.
  return null;
}
