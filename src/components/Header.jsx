import { useState } from "react";
import { NavLink } from "react-router-dom";
import { CATEGORIES, categoryProgress } from "../data/tasks";
import { useProgress, useSync } from "../hooks/useLocalStorage";
import Countdown from "./Countdown";
import SyncModal from "./SyncModal";

const SYNC_DOT_COLOR = {
  off: "transparent",
  syncing: "#22d3ee",
  synced: "#34d399",
  error: "#f87171",
};

// Cloud button in the header: opens the sync dialog, and its dot shows the
// current sync state at a glance.
function SyncButton() {
  const { status } = useSync();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Sync settings"
        onClick={() => setOpen(true)}
        className="relative grid place-items-center w-10 h-10 rounded-lg border border-edge text-slate-300 hover:bg-white/5 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
        </svg>
        {status !== "off" && (
          <span
            className={`absolute top-1 right-1 w-2 h-2 rounded-full${status === "syncing" ? " animate-pulse" : ""}`}
            style={{ background: SYNC_DOT_COLOR[status] }}
          />
        )}
      </button>
      {open && <SyncModal onClose={() => setOpen(false)} />}
    </>
  );
}

// Build the list of nav entries once (Home + each category).
function useNavItems(progress) {
  return [
    { id: "__home", to: "/", end: true, icon: "🏠", name: "Home", accent: "#22d3ee", pct: null },
    ...CATEGORIES.map((c) => ({
      id: c.id,
      to: `/${c.id}`,
      end: false,
      icon: c.icon,
      name: c.name,
      accent: c.accent,
      pct: categoryProgress(c, progress),
    })),
    { id: "__stats", to: "/stats", end: false, icon: "📊", name: "Stats", accent: "#22d3ee", pct: null },
  ];
}

export default function Header() {
  const [progress] = useProgress();
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useNavItems(progress);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-void/80 border-b border-edge">
      {/* Top row: logo + countdown (+ hamburger on mobile) */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <NavLink to="/" className="flex items-center gap-3 shrink-0 group">
          <div
            className="relative grid place-items-center w-10 h-10 rounded-[12px] shrink-0 border border-white/10"
            style={{ background: "#0a0a0f" }}
          >
            <span
              className="font-display font-black italic text-lg leading-none"
              style={{
                background: "linear-gradient(135deg, #00e5ff, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AD
            </span>
            <span className="absolute inset-0 rounded-[12px] glow-pulse" style={{ boxShadow: "0 0 18px rgba(0,229,255,0.35)" }} />
          </div>
          <span className="font-display font-black uppercase italic tracking-[0.06em] text-base sm:text-xl text-white leading-none whitespace-nowrap">
            Ascend!
          </span>
        </NavLink>

        <div className="flex items-center gap-2 shrink-0">
          <Countdown />
          <SyncButton />
          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="sm:hidden grid place-items-center w-10 h-10 rounded-lg border border-edge text-slate-200 hover:bg-white/5 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop / tablet nav — inline row, hidden on phones */}
      <nav className="hidden sm:flex mx-auto max-w-5xl px-6 pb-2 gap-2">
        {items.map((it) => (
          <NavLink key={it.id} to={it.to} end={it.end} className="group relative flex-1 basis-0 min-w-0">
            {({ isActive }) => (
              <div
                className="flex flex-col items-center gap-0.5 px-1 py-2 rounded-lg border transition-all duration-200"
                style={{
                  borderColor: isActive ? `${it.accent}77` : "transparent",
                  background: isActive ? `${it.accent}14` : "transparent",
                }}
              >
                <span className="flex items-center gap-1.5 min-w-0 max-w-full">
                  <span className="text-base leading-none">{it.icon}</span>
                  <span
                    className="font-display font-bold uppercase text-xs tracking-wider truncate max-w-full"
                    style={{ color: isActive ? it.accent : "#94a3b8" }}
                  >
                    {it.name}
                  </span>
                </span>
                {it.pct !== null && (
                  <span className="font-mono text-[10px] tabular-nums" style={{ color: isActive ? it.accent : "#64748b" }}>
                    {it.pct}%
                  </span>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <>
          {/* backdrop */}
          <div
            className="sm:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="sm:hidden relative z-50 border-t border-edge bg-void/95 backdrop-blur-xl px-3 py-3 flex flex-col gap-1.5">
            {items.map((it) => (
              <NavLink
                key={it.id}
                to={it.to}
                end={it.end}
                onClick={() => setMenuOpen(false)}
              >
                {({ isActive }) => (
                  <div
                    className="flex items-center gap-3 px-3 py-3 rounded-lg border transition-colors"
                    style={{
                      borderColor: isActive ? `${it.accent}77` : "var(--color-edge)",
                      background: isActive ? `${it.accent}14` : "transparent",
                    }}
                  >
                    <span className="text-xl leading-none">{it.icon}</span>
                    <span
                      className="flex-1 font-display font-bold uppercase text-sm tracking-wider"
                      style={{ color: isActive ? it.accent : "#cbd5e1" }}
                    >
                      {it.name}
                    </span>
                    {it.pct !== null && (
                      <span className="font-mono text-xs tabular-nums" style={{ color: isActive ? it.accent : "#64748b" }}>
                        {it.pct}%
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}
