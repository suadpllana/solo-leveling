import { useState, useEffect } from "react";
import { DAILY_TASKS } from "../data/constants";

const HARDCODED_HISTORY = {};

function loadStats() {
  try {
    const saved = localStorage.getItem("solo_grind_stats");
    const parsed = saved ? JSON.parse(saved) : {};
    const merged = { ...HARDCODED_HISTORY, ...parsed };
    try {
      const main = localStorage.getItem("solo_grind_v2");
      if (main) {
        const d = JSON.parse(main);
        if (d.lastDate && d.completedDaily) {
          const dailyIds = DAILY_TASKS.map(t => t.id);
          const completedIds = Object.keys(d.completedDaily).filter(k => d.completedDaily[k] && dailyIds.includes(k));
          const missed = dailyIds.filter(id => !d.completedDaily[id]);
          merged[d.lastDate] = {
            completed: completedIds,
            missed,
            extras: merged[d.lastDate]?.extras || []
          };
        }
      }
    } catch { /* ignore */ }
    return merged;
  } catch {
    return { ...HARDCODED_HISTORY };
  }
}

function getTaskName(id) {
  const t = DAILY_TASKS.find(x => x.id === id);
  return t ? t.name : id;
}

function getTaskIcon(id) {
  const t = DAILY_TASKS.find(x => x.id === id);
  return t ? t.icon : '❓';
}

export default function StatsTab() {
  const [stats, setStats] = useState(loadStats);
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'heatmap'

  useEffect(() => {
    const refresh = () => setStats(loadStats());
    window.addEventListener('storage', refresh);
    const interval = setInterval(refresh, 2000);
    return () => { window.removeEventListener('storage', refresh); clearInterval(interval); };
  }, []);

  const sortedDates = Object.keys(stats).sort().reverse();
  const totalDays = sortedDates.length;
  const perfectDays = sortedDates.filter(d => stats[d].missed.length === 0).length;
  const totalCompleted = sortedDates.reduce((a, d) => a + stats[d].completed.length, 0);
  const totalMissed = sortedDates.reduce((a, d) => a + stats[d].missed.length, 0);
  const completionRate = totalDays > 0 ? Math.round((totalCompleted / (totalCompleted + totalMissed)) * 100) : 0;

  // Per-task completion rates
  const taskRates = {};
  DAILY_TASKS.forEach(t => {
    const completed = sortedDates.filter(d => stats[d].completed.includes(t.id)).length;
    taskRates[t.id] = totalDays > 0 ? Math.round((completed / totalDays) * 100) : 0;
  });

  // Most missed tasks
  const missedCount = {};
  sortedDates.forEach(d => {
    stats[d].missed.forEach(id => {
      missedCount[id] = (missedCount[id] || 0) + 1;
    });
  });
  const topMissed = Object.entries(missedCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Best tasks (most completed)
  const completedCount = {};
  sortedDates.forEach(d => {
    stats[d].completed.forEach(id => {
      completedCount[id] = (completedCount[id] || 0) + 1;
    });
  });
  const topCompleted = Object.entries(completedCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Current streak calculation
  let currentStreak = 0;
  for (const date of sortedDates) {
    if (stats[date].missed.length === 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  const selected = selectedDay ? stats[selectedDay] : null;

  return (
    <div>
      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { v: totalDays, label: 'DAYS TRACKED', color: 'var(--accent-cyan)', icon: '📅' },
          { v: perfectDays, label: 'PERFECT DAYS', color: 'var(--accent-green)', icon: '💎' },
          { v: `${completionRate}%`, label: 'COMPLETION', color: 'var(--accent-gold)', icon: '📈' },
          { v: totalMissed, label: 'TOTAL MISSED', color: 'var(--accent-red)', icon: '⚠️' },
        ].map(({ v, label, color, icon }) => (
          <div key={label} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 14,
            padding: '16px 14px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${color}33, transparent)` }} />
            <div style={{ fontSize: 14, marginBottom: 4 }}>{icon}</div>
            <div className="number-display" style={{ fontSize: 28, fontWeight: 900, color }}>{v}</div>
            <div style={{ fontSize: 9, color: 'var(--text-tertiary)', marginTop: 4, letterSpacing: '0.06em', fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Best Tasks */}
      {topCompleted.length > 0 && (
        <div className="glass-card" style={{ padding: '14px 16px', marginBottom: 14, borderLeft: '3px solid var(--accent-green)' }}>
          <div style={{ fontSize: 10, color: 'var(--accent-green)', letterSpacing: '0.06em', marginBottom: 10, fontWeight: 700, textTransform: 'uppercase' }}>🏆 MOST CONSISTENT TASKS</div>
          {topCompleted.map(([id, count]) => (
            <div key={id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(52,211,153,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>{getTaskIcon(id)}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{getTaskName(id)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 40, height: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${taskRates[id] || 0}%`, background: 'var(--accent-green)', borderRadius: 2 }} />
                </div>
                <span className="number-display" style={{ fontSize: 12, color: 'var(--accent-green)', fontWeight: 700,minWidth:30,textAlign:'right' }}>{count}×</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Most Missed */}
      {topMissed.length > 0 && (
        <div style={{ background: 'rgba(248,113,113,0.03)', border: '1px solid rgba(248,113,113,0.08)', borderRadius: 14, padding: '14px 16px', marginBottom: 16, borderLeft: '3px solid rgba(248,113,113,0.4)' }}>
          <div style={{ fontSize: 10, color: 'var(--accent-red)', letterSpacing: '0.06em', marginBottom: 10, fontWeight: 700, textTransform: 'uppercase' }}>⚠ MOST MISSED TASKS</div>
          {topMissed.map(([id, count]) => (
            <div key={id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(248,113,113,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>{getTaskIcon(id)}</span>
                <span style={{ fontSize: 13, color: 'rgba(248,113,113,0.7)' }}>{getTaskName(id)}</span>
              </div>
              <span className="number-display" style={{ fontSize: 12, color: 'var(--accent-red)', fontWeight: 700 }}>{count}×</span>
            </div>
          ))}
        </div>
      )}

      {/* Day-by-day History */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.06em', fontWeight: 700, textTransform: 'uppercase' }}>DAY-BY-DAY HISTORY</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{sortedDates.length} entries</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sortedDates.map(date => {
          const day = stats[date];
          const total = DAILY_TASKS.length;
          const done = day.completed.length;
          const pct = Math.round((done / total) * 100);
          const isPerfect = day.missed.length === 0;
          const isSelected = selectedDay === date;
          const dateObj = new Date(date + 'T12:00:00');
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = dateObj.getDate();
          const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });

          return (
            <div key={date}>
              <div
                onClick={() => setSelectedDay(isSelected ? null : date)}
                className="task-item"
                style={{
                  background: isPerfect ? 'rgba(52,211,153,0.04)' : 'var(--bg-card)',
                  border: `1px solid ${isPerfect ? 'rgba(52,211,153,0.12)' : isSelected ? 'rgba(0,229,255,0.2)' : 'var(--border-subtle)'}`,
                  borderRadius: isSelected ? '14px 14px 0 0' : 14,
                  padding: '13px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  transition: 'all 0.25s'
                }}
              >
                <div style={{ minWidth: 48, textAlign: 'center' }}>
                  <div className="number-display" style={{ fontSize: 20, fontWeight: 900, color: isPerfect ? 'var(--accent-green)' : 'var(--text-primary)' }}>{dayNum}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{dayName} {monthName}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: isPerfect ? 'var(--accent-green)' : pct >= 80 ? 'var(--accent-gold)' : 'var(--accent-red)', borderRadius: 3, transition: 'width 0.5s' }} />
                    </div>
                    <span className="number-display" style={{ fontSize: 12, fontWeight: 700, color: isPerfect ? 'var(--accent-green)' : pct >= 80 ? 'var(--accent-gold)' : 'var(--accent-red)', minWidth: 36, textAlign: 'right' }}>{done}/{total}</span>
                  </div>
                  {day.missed.length > 0 && (
                    <div style={{ fontSize: 11, color: 'rgba(248,113,113,0.6)', marginTop: 4, lineHeight: 1.4 }}>
                      ✗ {day.missed.map(id => getTaskName(id)).join(', ')}
                    </div>
                  )}
                  {day.extras && day.extras.length > 0 && (
                    <div style={{ fontSize: 11, color: 'var(--accent-purple)', marginTop: 3 }}>
                      ★ {day.extras.join(' • ')}
                    </div>
                  )}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 10, transition: 'transform 0.25s', transform: isSelected ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</div>
              </div>

              {isSelected && selected && (
                <div className="tooltip-content" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderTop: 'none', borderRadius: '0 0 14px 14px', padding: '14px 16px' }}>
                  <div style={{ fontSize: 9, color: 'var(--accent-green)', letterSpacing: '0.06em', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase' }}>COMPLETED ({selected.completed.length})</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: selected.missed.length > 0 ? 14 : 0 }}>
                    {selected.completed.map(id => (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--accent-green)' }}>
                        <span>✓</span> <span>{getTaskIcon(id)} {getTaskName(id)}</span>
                      </div>
                    ))}
                  </div>
                  {selected.missed.length > 0 && (
                    <>
                      <div style={{ fontSize: 9, color: 'var(--accent-red)', letterSpacing: '0.06em', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase' }}>MISSED ({selected.missed.length})</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {selected.missed.map(id => (
                          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(248,113,113,0.7)' }}>
                            <span>✗</span> <span>{getTaskIcon(id)} {getTaskName(id)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {selected.extras && selected.extras.length > 0 && (
                    <>
                      <div style={{ fontSize: 9, color: 'var(--accent-purple)', letterSpacing: '0.06em', marginTop: 14, marginBottom: 8, fontWeight: 700, textTransform: 'uppercase' }}>BONUS ACHIEVEMENTS</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {selected.extras.map((e, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--accent-purple)' }}>
                            <span>★</span> <span>{e}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {sortedDates.length === 0 && (
        <div style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)', fontSize: 14 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
          No stats yet. Complete your daily tasks and they'll show up here.
        </div>
      )}
    </div>
  );
}
