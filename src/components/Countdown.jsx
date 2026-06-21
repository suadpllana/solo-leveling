import { useEffect, useState } from "react";
import { DEADLINE_DATE, DEADLINE_LABEL } from "../data/tasks";

const TARGET = new Date(DEADLINE_DATE).getTime();

function diff() {
  const ms = Math.max(0, TARGET - Date.now());
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return { days, hours, minutes, seconds, done: ms === 0 };
}

function Unit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono text-lg sm:text-2xl font-bold tabular-nums text-white leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">
        {label}
      </span>
    </div>
  );
}

export default function Countdown() {
  const [t, setT] = useState(diff);

  useEffect(() => {
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-end">
      <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-cyan-400/70 mb-1">
        {t.done ? "Deadline reached" : `Until ${DEADLINE_LABEL}`}
      </div>
      <div className="flex items-center gap-1.5 sm:gap-3">
        <Unit value={t.days} label="Days" />
        <span className="text-slate-700 font-bold pb-3">:</span>
        <Unit value={t.hours} label="Hrs" />
        <span className="text-slate-700 font-bold pb-3">:</span>
        <Unit value={t.minutes} label="Min" />
        <span className="text-slate-700 font-bold pb-3">:</span>
        <Unit value={t.seconds} label="Sec" />
      </div>
    </div>
  );
}
