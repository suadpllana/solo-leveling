import { createContext, createElement, useCallback, useContext, useEffect, useState } from "react";

// Persist a piece of state to localStorage under `key`.
// Returns [value, setValue] just like useState.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full / unavailable — fail silently, app still works in-memory
    }
  }, [key, value]);

  return [value, setValue];
}

// Shared app state. A single Provider holds progress + pins so every consumer
// (Header, CategoryPage, Dashboard) stays in sync — without this, each hook
// call had its own isolated copy and the nav percentages only updated on a
// full page reload.
const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  // progress map: { [taskId]: boolean | number }
  const [progress, setProgress] = useLocalStorage("solo-progress", {});
  // pinned map:   { [taskId]: true }  — "focus now" tasks
  const [pinned, setPinned] = useLocalStorage("solo-pinned", {});
  // user-added tasks, grouped by category id:
  //   { [categoryId]: [{ id, type, name, target? }] }
  const [customTasks, setCustomTasks] = useLocalStorage("solo-custom-tasks", {});
  // built-in tasks the user has deleted (can't be removed from the static
  // CATEGORIES array, so we hide them): { [taskId]: true }
  const [hiddenTasks, setHiddenTasks] = useLocalStorage("solo-hidden-tasks", {});
  // edits to built-in tasks (name/type overrides), merged at render time:
  //   { [taskId]: { name?, type? } }
  const [taskEdits, setTaskEdits] = useLocalStorage("solo-task-edits", {});

  const setTask = useCallback(
    (taskId, next) => {
      setProgress((prev) => ({ ...prev, [taskId]: next }));
    },
    [setProgress]
  );

  const addCustomTask = useCallback(
    (categoryId, task) => {
      setCustomTasks((prev) => ({
        ...prev,
        [categoryId]: [...(prev[categoryId] ?? []), task],
      }));
    },
    [setCustomTasks]
  );

  // Delete any task. Custom tasks are removed outright; built-in tasks are
  // hidden (the static list can't be mutated). Either way we clean up the
  // task's stored progress and any pins (whole-task or per-item).
  const deleteTask = useCallback(
    (categoryId, taskId, isCustom) => {
      if (isCustom) {
        setCustomTasks((prev) => ({
          ...prev,
          [categoryId]: (prev[categoryId] ?? []).filter((t) => t.id !== taskId),
        }));
      } else {
        setHiddenTasks((prev) => ({ ...prev, [taskId]: true }));
      }
      setProgress((prev) => {
        if (!(taskId in prev)) return prev;
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
      setPinned((prev) => {
        // drop the whole-task pin and any "taskId::itemId" item pins
        const next = {};
        let changed = false;
        for (const key of Object.keys(prev)) {
          if (key === taskId || key.startsWith(`${taskId}::`)) {
            changed = true;
            continue;
          }
          next[key] = prev[key];
        }
        return changed ? next : prev;
      });
    },
    [setCustomTasks, setHiddenTasks, setProgress, setPinned]
  );

  // Edit a task's name and/or type. `changes` = { name?, type? }.
  // Custom tasks are updated in place; built-in tasks get an override.
  // When the type changes we clear stored progress (the value shape differs
  // between a check boolean and a checklist object).
  const editTask = useCallback(
    (categoryId, taskId, isCustom, changes, typeChanged) => {
      if (isCustom) {
        setCustomTasks((prev) => ({
          ...prev,
          [categoryId]: (prev[categoryId] ?? []).map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  ...changes,
                  // a checklist needs a target; keep existing or default to 1
                  ...(changes.type === "checklist" && t.type !== "checklist"
                    ? { target: t.target ?? 1 }
                    : {}),
                }
              : t
          ),
        }));
      } else {
        setTaskEdits((prev) => ({
          ...prev,
          [taskId]: { ...prev[taskId], ...changes },
        }));
      }
      if (typeChanged) {
        setProgress((prev) => {
          if (!(taskId in prev)) return prev;
          const next = { ...prev };
          delete next[taskId];
          return next;
        });
      }
    },
    [setCustomTasks, setTaskEdits, setProgress]
  );

  const togglePin = useCallback(
    (taskId) => {
      setPinned((prev) => {
        const next = { ...prev };
        if (next[taskId]) delete next[taskId];
        else next[taskId] = true;
        return next;
      });
    },
    [setPinned]
  );

  return createElement(
    ProgressContext.Provider,
    {
      value: {
        progress,
        setTask,
        setProgress,
        pinned,
        togglePin,
        customTasks,
        hiddenTasks,
        taskEdits,
        addCustomTask,
        deleteTask,
        editTask,
      },
    },
    children
  );
}

function useAppState() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("hook must be used within a ProgressProvider");
  return ctx;
}

// Backwards-compatible tuple API: [progress, setTask, setProgress]
export function useProgress() {
  const { progress, setTask, setProgress } = useAppState();
  return [progress, setTask, setProgress];
}

// Pins API: [pinned, togglePin]
export function usePinned() {
  const { pinned, togglePin } = useAppState();
  return [pinned, togglePin];
}

// Tasks the user has customized: added (customTasks), deleted/hidden
// (hiddenTasks), edited (taskEdits), plus the actions to add/delete/edit.
export function useCustomTasks() {
  const { customTasks, hiddenTasks, taskEdits, addCustomTask, deleteTask, editTask } =
    useAppState();
  return { customTasks, hiddenTasks, taskEdits, addCustomTask, deleteTask, editTask };
}
