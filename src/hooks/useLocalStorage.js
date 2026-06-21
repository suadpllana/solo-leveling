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

  const setTask = useCallback(
    (taskId, next) => {
      setProgress((prev) => ({ ...prev, [taskId]: next }));
    },
    [setProgress]
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
    { value: { progress, setTask, setProgress, pinned, togglePin } },
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
