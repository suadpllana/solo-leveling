import { useState } from "react";
import { DAILY_TASKS } from "../data/constants";

const HARDCODED_HISTORY = {
  "2025-04-18": {
    completed: DAILY_TASKS.filter(t => t.id !== 'read_book').map(t => t.id),
    missed: ['read_book'],
    extras: []
  },
  "2025-04-19": {
    completed: DAILY_TASKS.filter(t => t.id !== 'read_book').map(t => t.id),
    missed: ['read_book'],
    extras: ['Watched "One Battle After Another"']
  },
  "2025-04-20": {
    completed: DAILY_TASKS.filter(t => !['exercise','read_book','water'].includes(t.id)).map(t => t.id),
    missed: ['exercise', 'read_book', 'water'],
    extras: ['Completed "I Am Jesus Christ"', 'Watched "Seven Samurai"']
  }
};

function getTaskName(id) {
  const t = DAILY_TASKS.find(x => x.id === id);
  return t ? t.name : id;
}

function getTaskIcon(id) {
  const t = DAILY_TASKS.find(x => x.id === id);
  return t ? t.icon : '❓';
}

export default function StatsTab() {
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem("solo_grind_stats");
      const parsed = saved ? JSON.parse(saved) : {};
      const merged = { ...HARDCODED_HISTORY, ...parsed };
      // Also sync today's data from main storage
      try {
        const main = localStorage.getItem("solo_grind_v1");
        if (main) {
          const d = JSON.parse(main);
          if (d.lastDate && d.completedDaily) {
            const completedIds = Object.keys(d.completedDaily).filter(k => d.completedDaily[k]);
            const dailyIds = DAILY_TASKS.map(t => t.id);
            const completed = completedIds.filter(id => dailyIds.includes(id));
            const missed = dailyIds.filter(id => !completedIds.includes(id));
            if (completed.length > 0) {
              merged[d.lastDate] = {
                completed,
                missed,
                extras: merged[d.lastDate]?.extras || []
              };
            }
          }
        }
      } catch { /* ignore */ }
      return merged;
    } catch {
      return { ...HARDCODED_HISTORY };
    }
  });
  const [selectedDay, setSelectedDay] = useState(null);

  const sortedDates = Object.keys(stats).sort().reverse();
  const totalDays = sortedDates.length;
  const perfectDays = sortedDates.filter(d => stats[d].missed.length === 0).length;
  const totalCompleted = sortedDates.reduce((a, d) => a + stats[d].completed.length, 0);
  const totalMissed = sortedDates.reduce((a, d) => a + stats[d].missed.length, 0);
  const completionRate = totalDays > 0 ? Math.round((totalCompleted / (totalCompleted + totalMissed)) * 100) : 0;

  // Most missed tasks
  const missedCount = {};
  sortedDates.forEach(d => {
    stats[d].missed.forEach(id => {
      missedCount[id] = (missedCount[id] || 0) + 1;
    });
  });
  const topMissed = Object.entries(missedCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const selected = selectedDay ? stats[selectedDay] : null;

  return (
    <div>
      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        <div style={{ background: '#292524', border: '1px solid #44403c', borderRadius: 12, padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#00f0ff' }}>{totalDays}</div>
          <div style={{ fontSize: 10, color: '#a8a29e', fontFamily: "'Quicksand',sans-serif", letterSpacing: '0.03em' }}>DAYS TRACKED</div>
        </div>
        <div style={{ background: '#292524', border: '1px solid #44403c', borderRadius: 12, padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#00ff88' }}>{perfectDays}</div>
          <div style={{ fontSize: 10, color: '#a8a29e', fontFamily: "'Quicksand',sans-serif", letterSpacing: '0.03em' }}>PERFECT DAYS</div>
        </div>
        <div style={{ background: '#292524', border: '1px solid #44403c', borderRadius: 12, padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#ffd700' }}>{completionRate}%</div>
          <div style={{ fontSize: 10, color: '#a8a29e', fontFamily: "'Quicksand',sans-serif", letterSpacing: '0.03em' }}>COMPLETION RATE</div>
        </div>
        <div style={{ background: '#292524', border: '1px solid #44403c', borderRadius: 12, padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#ff7777' }}>{totalMissed}</div>
          <div style={{ fontSize: 10, color: '#a8a29e', fontFamily: "'Quicksand',sans-serif", letterSpacing: '0.03em' }}>TOTAL MISSED</div>
        </div>
      </div>

      {/* Most Missed */}
      {topMissed.length > 0 && (
        <div style={{ background: '#120808', border: '1px solid #ff33331a', borderRadius: 12, padding: '12px 14px', marginBottom: 16 }}>
          <div style={{ fontFamily: "'Quicksand',sans-serif", fontSize: 10, color: '#ff7777', letterSpacing: '0.03em', marginBottom: 8 }}>MOST MISSED TASKS</div>
          {topMissed.map(([id, count]) => (
            <div key={id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #ff33330d' }}>
              <span style={{ fontSize: 13, color: '#ff9999' }}>{getTaskIcon(id)} {getTaskName(id)}</span>
              <span style={{ fontSize: 12, color: '#ff5555', fontWeight: 700 }}>{count}x</span>
            </div>
          ))}
        </div>
      )}

      {/* Day-by-day History */}
      <div style={{ fontFamily: "'Quicksand',sans-serif", fontSize: 10, color: '#a8a29e', letterSpacing: '0.03em', marginBottom: 8 }}>DAY-BY-DAY HISTORY</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
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
                style={{
                  background: isPerfect ? '#0a180a' : '#292524',
                  border: `1px solid ${isPerfect ? '#00ff8822' : isSelected ? '#00f0ff44' : '#44403c'}`,
                  borderRadius: isSelected ? '12px 12px 0 0' : 12,
                  padding: '11px 13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ minWidth: 44, textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: isPerfect ? '#00ff88' : '#f5f5f4' }}>{dayNum}</div>
                  <div style={{ fontSize: 9, color: '#78716c' }}>{dayName} {monthName}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ flex: 1, height: 6, background: '#44403c', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: isPerfect ? '#00ff88' : pct >= 80 ? '#ffd700' : '#ff7777', borderRadius: 3, transition: 'width 0.5s' }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: isPerfect ? '#00ff88' : pct >= 80 ? '#ffd700' : '#ff7777', minWidth: 36, textAlign: 'right' }}>{done}/{total}</span>
                  </div>
                  {day.missed.length > 0 && (
                    <div style={{ fontSize: 11, color: '#ff8888', marginTop: 3 }}>
                      ✗ {day.missed.map(id => getTaskName(id)).join(', ')}
                    </div>
                  )}
                  {day.extras && day.extras.length > 0 && (
                    <div style={{ fontSize: 11, color: '#c084fc', marginTop: 2 }}>
                      ★ {day.extras.join(' • ')}
                    </div>
                  )}
                </div>
                <div style={{ color: '#78716c', fontSize: 10, transition: 'transform 0.2s', transform: isSelected ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</div>
              </div>

              {isSelected && selected && (
                <div style={{ background: '#1c1917', border: '1px solid #44403c', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '12px 14px' }}>
                  <div style={{ fontFamily: "'Quicksand',sans-serif", fontSize: 9, color: '#00ff88', letterSpacing: '0.03em', marginBottom: 6 }}>COMPLETED ({selected.completed.length})</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: selected.missed.length > 0 ? 12 : 0 }}>
                    {selected.completed.map(id => (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#00ff88' }}>
                        <span>✓</span> <span>{getTaskIcon(id)} {getTaskName(id)}</span>
                      </div>
                    ))}
                  </div>
                  {selected.missed.length > 0 && (
                    <>
                      <div style={{ fontFamily: "'Quicksand',sans-serif", fontSize: 9, color: '#ff7777', letterSpacing: '0.03em', marginBottom: 6 }}>MISSED ({selected.missed.length})</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {selected.missed.map(id => (
                          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#ff7777' }}>
                            <span>✗</span> <span>{getTaskIcon(id)} {getTaskName(id)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {selected.extras && selected.extras.length > 0 && (
                    <>
                      <div style={{ fontFamily: "'Quicksand',sans-serif", fontSize: 9, color: '#c084fc', letterSpacing: '0.03em', marginTop: 12, marginBottom: 6 }}>BONUS ACHIEVEMENTS</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {selected.extras.map((e, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#c084fc' }}>
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
        <div style={{ textAlign: 'center', padding: 40, color: '#78716c', fontSize: 14 }}>
          No stats yet. Complete your daily tasks and they'll show up here.
        </div>
      )}
    </div>
  );
}
