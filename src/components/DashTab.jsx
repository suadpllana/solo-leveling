import { useMemo } from 'react';
import StatBox from './StatBox';
import { DAILY_TASKS, ONE_TIME_TASKS } from '../data/constants';

function ProgressRing({ pct, color, size = 80, strokeWidth = 5, children }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      {children}
    </div>
  );
}

export default function DashTab({
  ri,
  rc,
  streak,
  daysLeft,
  dailyDone,
  onceDone,
  missed,
  setTab,
  activeQuests = {},
  customQuests = []
}) {
  const totalD = DAILY_TASKS.length;
  const allQuests = useMemo(() => {
    return [...customQuests, ...ONE_TIME_TASKS];
  }, [customQuests]);
  const totalO = allQuests.length;
  const pct = Math.round((dailyDone / totalD) * 100);

  // Time / Mana calculations
  const activeFocusTime = useMemo(() => {
    let totalMinutes = 0;
    Object.keys(activeQuests).forEach(qid => {
      const q = allQuests.find(x => x.id === qid);
      if (q && q.totalUnits && q.estUnitDuration) {
        const remainingUnits = Math.max(0, q.totalUnits - activeQuests[qid].progress);
        const daysRem = Math.max(1, q.defaultDurationDays || 14);
        totalMinutes += (remainingUnits * q.estUnitDuration) / daysRem;
      }
    });
    return Math.round((totalMinutes / 60) * 10) / 10;
  }, [activeQuests, allQuests]);

  const hasExhaustion = activeFocusTime > 4.0;
  const activeKeys = Object.keys(activeQuests);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* ── Dynamic Hunter Status Hub ── */}
      <div className="hud-panel cyber-corners animate-glow-purple" style={{ padding: '16px 18px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 10, color: rc, letterSpacing: '0.08em', fontWeight: 800, textTransform: 'uppercase' }}>
            ⚡ SYSTEM STATUS PROTOCOL
          </span>
          <span className="badge" style={{
            background: hasExhaustion ? 'rgba(248,113,113,0.1)' : 'rgba(52,211,153,0.1)',
            color: hasExhaustion ? 'var(--accent-red)' : 'var(--accent-green)',
            border: `1px solid ${hasExhaustion ? 'rgba(248,113,113,0.3)' : 'rgba(52,211,153,0.3)'}`,
            fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', animation: hasExhaustion ? 'pulse 2s infinite' : 'none'
          }}>
            {hasExhaustion ? "DEBUFF: EXHAUSTED" : "STATUS: CALIBRATED"}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Mana bar visual progress indicator */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Daily Time Budget Allocation:</span>
              <span className="number-display" style={{ fontWeight: 800, color: hasExhaustion ? 'var(--accent-red)' : 'var(--accent-cyan)' }}>
                {activeFocusTime} hrs / 4.0 hrs
              </span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.03)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, (activeFocusTime / 4.0) * 100)}%`,
                background: hasExhaustion ? 'var(--gradient-danger)' : 'var(--gradient-main)',
                borderRadius: 4, transition: 'width 0.8s ease'
              }} />
            </div>
          </div>
        </div>

        {hasExhaustion ? (
          <div style={{ fontSize: 11, color: 'rgba(248,113,113,0.7)', marginTop: 10, lineHeight: 1.4 }}>
            ⚠ System alert: leisure slots overload detected. Pacing exceeding 4.0 hours/day induces fatigue. Deactivate a TV show or game to recover.
          </div>
        ) : (
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 10, fontStyle: 'italic' }}>
            ✓ Mana allocation optimal. Paced focuses are balanced for peak hunter recovery.
          </div>
        )}
      </div>

      {/* Hero card with completion ring */}
      <div className="glass-card" style={{ padding: '20px 18px', display: 'flex', alignItems: 'center', gap: 18 }}>
        <ProgressRing pct={pct} color={rc} size={90} strokeWidth={6}>
          <div style={{ textAlign: 'center' }}>
            <div className="number-display" style={{ fontSize: 22, fontWeight: 900, color: rc }}>{pct}%</div>
            <div style={{ fontSize: 8, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>TODAY</div>
          </div>
        </ProgressRing>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>DAILY COMPLETION</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{dailyDone} of {totalD} daily tasks</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{onceDone} of {totalO} quests completed</div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden', marginTop: 10 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg,var(--accent-cyan),var(--accent-purple))`, borderRadius: 4, transition: 'width 1s ease' }} />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'flex', gap: 8 }}>
        <StatBox v={`${dailyDone}/${totalD}`} label="Daily Tasks" color='var(--accent-cyan)' icon="📋" />
        <StatBox v={`${onceDone}/${totalO}`} label="Quests Done" color='var(--accent-purple)' icon="🗺️" />
        <StatBox v={streak} label="Streak Days" color='var(--accent-gold)' icon="🔥" />
        <StatBox v={daysLeft} label="Days Left" color={daysLeft <= 7 ? 'var(--accent-red)' : 'var(--accent-orange)'} icon="⏳" />
      </div>

      {/* ── Active Hunter Focuses Summary ── */}
      <div className="glass-card" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.06em', fontWeight: 800, textTransform: 'uppercase' }}>
            ⚡ ACTIVE FOCUS CONSTRAINTS ({activeKeys.length} occupied)
          </span>
          <button onClick={() => setTab('quests')} style={{ background: 'transparent', border: 'none', color: 'var(--accent-purple)', fontSize: 9, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase' }}>
            Manage Board ➜
          </button>
        </div>

        {activeKeys.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '18px 0', color: 'var(--text-tertiary)', fontSize: 12 }}>
            No focus slots allocated. Open Quest Board to assign time pacing.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(() => {
              const grouped = {};
              activeKeys.forEach(qid => {
                const q = allQuests.find(x => x.id === qid);
                if (!q) return;
                const cat = q.cat || '📌 Other';
                if (!grouped[cat]) grouped[cat] = [];
                grouped[cat].push(qid);
              });

              return Object.keys(grouped).map(cat => (
                <div key={cat} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '10px' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {cat}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {grouped[cat].map(qid => {
                      const q = allQuests.find(x => x.id === qid);
                      if (!q) return null;
                      const progress = activeQuests[qid].progress || 0;
                      const total = q.totalUnits || 1;
                      const pct = Math.round((progress / total) * 100);

                      return (
                        <div key={qid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                          <span style={{ fontSize: 16 }}>{q.icon || '📌'}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {q.name}
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>
                              {progress}/{total} {q.unitName} logged
                            </div>
                          </div>
                          {/* Small progress meter */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 40, height: 3, background: 'rgba(255,255,255,0.03)', borderRadius: 2, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent-purple)', borderRadius: 2 }} />
                            </div>
                            <span className="number-display" style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 800 }}>{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}
      </div>

      {/* Missed tasks */}
      {missed.length > 0 && (
        <div style={{
          background: 'rgba(248,113,113,0.04)',
          border: '1px solid rgba(248,113,113,0.12)',
          borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
          transition: 'all 0.2s'
        }} onClick={() => setTab('quests', { subTab: 'today' })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: 'var(--accent-red)', letterSpacing: '0.06em', fontWeight: 700, textTransform: 'uppercase' }}>⚠ MISSED — CARRIED OVER</div>
            <div className="badge badge-missed">{missed.length}</div>
          </div>
          {missed.slice(0, 3).map(id => {
            const t = DAILY_TASKS.find(x => x.id === id);
            return t ? <div key={id} style={{ fontSize: 13, color: 'rgba(248,113,113,0.7)', padding: '2px 0' }}>• {t.icon} {t.name}</div> : null;
          })}
          {missed.length > 3 && <div style={{ fontSize: 11, color: 'rgba(248,113,113,0.4)', marginTop: 6 }}>+{missed.length - 3} more — tap to see all</div>}
        </div>
      )}

      {/* Quick nav */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          ['🗺️', 'quests', 'Missions Hub', 'Schedule, quests & focus', 'var(--accent-purple)', { subTab: 'today' }],
          ['▶️', 'yt', 'Knowledge', '+40 XP per video', 'var(--accent-red)', null],
          ['📊', 'stats', 'Statistics', 'View your history', 'var(--accent-green)', null],
          ['⚡', 'quests', 'Quest Board', 'Activate & pace focus', 'var(--accent-cyan)', { subTab: 'board' }],
        ].map(([icon, tabId, label, sub, color, navOpts]) => (
          <button key={label} type="button" className="btn" onClick={() => setTab(tabId, navOpts || {})} style={{
            padding: '16px 14px', textAlign: 'left', display: 'flex', gap: 12, alignItems: 'center',
            color: 'var(--text-primary)', background: 'var(--bg-card)', cursor: 'pointer',
            border: '1px solid var(--border-subtle)', borderRadius: 14,
            transition: 'all 0.25s', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: `${color}11`, border: `${color}22 1px solid`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0
            }}>{icon}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Rank track */}
      <div className="glass-card" style={{ padding: '16px 18px' }}>
        <div style={{ fontSize: 9, color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: 14, textTransform: 'uppercase', fontWeight: 700 }}>RANK PROGRESSION</div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}>
          {ri && [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const r = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'][i];
            const RANK_COLORS = ['#6b7280', '#4ade80', '#60a5fa', '#c084fc', '#facc15', '#f87171', '#ff6b35', '#ffd700'];
            return (
              <div key={r} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  width: '100%', aspectRatio: '1', borderRadius: '50%',
                  background: i < ri.rank ? RANK_COLORS[i] : i === ri.rank ? `${RANK_COLORS[i]}18` : 'rgba(255,255,255,0.03)',
                  border: i === ri.rank ? `2px solid ${RANK_COLORS[i]}` : '1px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 900,
                  color: i < ri.rank ? '#000' : i === ri.rank ? RANK_COLORS[i] : 'var(--text-muted)',
                  transition: 'all 0.5s',
                  boxShadow: i === ri.rank ? `0 0 12px ${RANK_COLORS[i]}33` : 'none'
                }}>{r}</div>
                <div style={{ fontSize: 7, color: i === ri.rank ? RANK_COLORS[i] : 'var(--text-muted)', marginTop: 4, fontWeight: 700 }}>
                  {i === ri.rank ? '◆' : i < ri.rank ? '✓' : '🔒'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
