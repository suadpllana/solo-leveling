import { NavLink } from "react-router-dom";
import { CATEGORIES, categoryProgress } from "../data/tasks";
import { useProgress } from "../hooks/useLocalStorage";
import Countdown from "./Countdown";

export default function Header() {
  const [progress] = useProgress();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-void/80 border-b border-edge">
      {/* Top row: logo + countdown */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-3 min-w-0 group">
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
              SP
            </span>
            <span className="absolute inset-0 rounded-[12px] glow-pulse" style={{ boxShadow: "0 0 18px rgba(0,229,255,0.35)" }} />
          </div>
          <span className="font-display font-black uppercase italic tracking-[0.12em] text-lg sm:text-xl text-white leading-none truncate">
            Ascend!
          </span>
        </NavLink>

        <Countdown />
      </div>

      {/* Nav row */}
      <nav className="mx-auto max-w-5xl px-2 sm:px-6 pb-2 flex gap-1 sm:gap-2 overflow-x-auto">
        <NavLink to="/" end className="group relative flex-1 min-w-[64px]">
          {({ isActive }) => (
            <div
              className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg border transition-all duration-200"
              style={{
                borderColor: isActive ? "rgba(34,211,238,0.47)" : "transparent",
                background: isActive ? "rgba(34,211,238,0.08)" : "transparent",
              }}
            >
              <span className="flex items-center gap-1.5">
                <span className="text-base leading-none">🏠</span>
                <span
                  className="font-display font-bold uppercase text-[11px] sm:text-xs tracking-wider"
                  style={{ color: isActive ? "#22d3ee" : "#94a3b8" }}
                >
                  Home
                </span>
              </span>
            </div>
          )}
        </NavLink>
        {CATEGORIES.map((c) => {
          const pct = categoryProgress(c, progress);
          return (
            <NavLink
              key={c.id}
              to={`/${c.id}`}
              className="group relative flex-1 min-w-[78px]"
            >
              {({ isActive }) => (
                <div
                  className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg border transition-all duration-200"
                  style={{
                    borderColor: isActive ? `${c.accent}77` : "transparent",
                    background: isActive ? `${c.accent}14` : "transparent",
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-base leading-none">{c.icon}</span>
                    <span
                      className="font-display font-bold uppercase text-[11px] sm:text-xs tracking-wider"
                      style={{ color: isActive ? c.accent : "#94a3b8" }}
                    >
                      {c.name}
                    </span>
                  </span>
                  <span className="font-mono text-[10px] tabular-nums" style={{ color: isActive ? c.accent : "#64748b" }}>
                    {pct}%
                  </span>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}
