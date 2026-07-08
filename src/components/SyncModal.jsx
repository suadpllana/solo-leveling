import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "../hooks/useScrollLock";
import { useSync } from "../hooks/useLocalStorage";
import { generateSyncCode, normalizeSyncCode } from "../hooks/useRemoteSync";
import { useToast } from "./Toast";

const STATUS_LABEL = {
  off: "Off",
  syncing: "Syncing...",
  synced: "Synced",
  error: "Offline - will retry",
};

const STATUS_COLOR = {
  off: "#64748b",
  syncing: "#22d3ee",
  synced: "#34d399",
  error: "#f87171",
};

// Settings dialog for cross-device sync. One device creates a sync code, the
// other enters it; from then on both read/write the same server document.
// Mounted only while open (see Header), so input state starts fresh each time.
export default function SyncModal({ onClose }) {
  const { key, setKey, status, lastSyncedAt, syncNow } = useSync();
  const toast = useToast();
  const [codeInput, setCodeInput] = useState("");
  const [inputError, setInputError] = useState(null);

  useScrollLock(true);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const createCode = () => {
    setKey(generateSyncCode());
    toast("Sync enabled - enter this code on your other device");
  };

  const connect = () => {
    const code = normalizeSyncCode(codeInput);
    if (!code) {
      setInputError("That doesn't look like a sync code (e.g. abcd-efgh-jkmn).");
      return;
    }
    setKey(code);
    toast("Connected - pulling progress...");
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(key);
      toast("Sync code copied");
    } catch {
      toast("Couldn't copy - select the code manually", "error");
    }
  };

  const disconnect = () => {
    setKey(null);
    toast("Sync turned off - data stays on this device");
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid justify-items-center items-start p-4 pt-[20vh]"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm rounded-xl border border-edge bg-panel p-5 shadow-2xl animate-rise">
        <div className="flex items-start gap-3">
          <div className="shrink-0 grid place-items-center w-10 h-10 rounded-lg bg-cyan-500/15 text-cyan-400">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-100">Cross-device sync</h3>
            <p className="mt-1 text-sm text-slate-400 leading-snug">
              {key
                ? "Progress on this device syncs with every device using this code."
                : "Sync your progress between your phone and PC."}
            </p>
          </div>
        </div>

        {key ? (
          <div className="mt-4 space-y-3">
            {/* current code */}
            <div className="flex items-center gap-2">
              <code className="flex-1 min-w-0 truncate rounded-lg border border-edge bg-void/60 px-3 py-2.5 font-mono text-sm text-cyan-300 tracking-wider select-all">
                {key}
              </code>
              <button
                type="button"
                onClick={copyCode}
                className="shrink-0 px-3 py-2.5 rounded-lg border border-edge text-sm font-medium text-slate-200 hover:bg-white/5 transition-colors"
              >
                Copy
              </button>
            </div>

            {/* status row */}
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-400">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: STATUS_COLOR[status] }}
                />
                {STATUS_LABEL[status]}
                {status === "synced" && lastSyncedAt && (
                  <span className="text-slate-500">
                    {" - "}
                    {new Date(lastSyncedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={syncNow}
                className="px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider text-cyan-300 hover:bg-cyan-400/10 transition-colors"
              >
                Sync now
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-snug">
              On your other device, open this dialog and enter the code above.
              Keep it private - anyone with the code can see and change your progress.
            </p>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={disconnect}
                className="px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Turn off sync
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <button
              type="button"
              onClick={createCode}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-colors"
            >
              Create a new sync code
            </button>

            <div className="flex items-center gap-3">
              <span className="flex-1 h-px bg-edge" />
              <span className="text-xs uppercase tracking-wider text-slate-500">or</span>
              <span className="flex-1 h-px bg-edge" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Enter a code from another device
              </label>
              <div className="flex items-center gap-2">
                <input
                  value={codeInput}
                  onChange={(e) => {
                    setCodeInput(e.target.value);
                    setInputError(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && connect()}
                  placeholder="abcd-efgh-jkmn"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="flex-1 min-w-0 rounded-lg border border-edge bg-void/60 px-3 py-2.5 font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/60"
                />
                <button
                  type="button"
                  onClick={connect}
                  disabled={!codeInput.trim()}
                  className="shrink-0 px-4 py-2.5 rounded-lg text-sm font-bold text-cyan-300 border border-cyan-400/40 hover:bg-cyan-400/10 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  Connect
                </button>
              </div>
              {inputError && <p className="mt-1.5 text-xs text-red-400">{inputError}</p>}
              <p className="mt-2 text-xs text-slate-500 leading-snug">
                Connecting pulls the progress stored under that code onto this device.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
