import { useState, useMemo, useEffect } from "react";
import { CATEGORY_LIMITS } from "../data/constants";

const CAT_COLORS = {
  '📚 Books': '#60a5fa',
  '🎬 Films': '#f472b6',
  '🎞️ Documentaries': '#a78bfa',
  '🎮 Gaming': '#34d399',
  '🛒 Purchases': '#fbbf24',
  '⚖️ Body': '#fb923c',
  '💰 Finance': '#4ade80',
  '🧠 Knowledge': '#00e5ff',
  '📺 TV Shows/Anime': '#f87171',
  '🏆 Challenges': '#fbbf24',
};

export default function QuestsTab({
  tasks,
  completed,
  activeQuests,
  customQuests = [],
  activateQuest,
  deactivateQuest,
  updateQuestProgress,
  forgeCustomQuest,
  removeCustomQuest
}) {
  const [subTab, setSubTab] = useState("active"); // "active" | "board" | "completed" | "forge"
  const [filterCat, setFilterCat] = useState(null);
  const [expandedQuestId, setExpandedQuestId] = useState(null);

  // Form states for custom quest forging
  const [forgeName, setForgeName] = useState("");
  const [forgeCat, setForgeCat] = useState("📺 TV Shows/Anime");
  const [forgeUnits, setForgeUnits] = useState(10);
  const [forgeUnitName, setForgeUnitName] = useState("episodes");
  const [forgeDuration, setForgeDuration] = useState(30);
  const [forgeDays, setForgeDays] = useState(14);
  const [forgeXp, setForgeXp] = useState(150);

  // Merge default tasks with custom forged tasks
  const allQuests = useMemo(() => {
    return [...tasks, ...customQuests];
  }, [tasks, customQuests]);

  const categories = useMemo(() => {
    return [...new Set(allQuests.map(q => q.cat))];
  }, [allQuests]);

  // Compute stats
  const totalTasks = allQuests.length;
  const activeCount = Object.keys(activeQuests).length;
  const doneCount = allQuests.filter(q => completed[q.id]).length;

  // Active Focus Time Calculations
  const activeFocusTime = useMemo(() => {
    let totalMinutes = 0;
    Object.keys(activeQuests).forEach(qid => {
      const q = allQuests.find(x => x.id === qid);
      if (q && q.totalUnits && q.estUnitDuration) {
        const remainingUnits = Math.max(0, q.totalUnits - activeQuests[qid].progress);
        const daysRem = Math.max(1, q.defaultDurationDays || 14); // simplification
        totalMinutes += (remainingUnits * q.estUnitDuration) / daysRem;
      }
    });
    return Math.round((totalMinutes / 60) * 10) / 10; // Hours/day
  }, [activeQuests, allQuests]);

  // Pacing status indicator helper
  function getPacingInfo(quest, activeInfo) {
    const total = quest.totalUnits || 1;
    const progress = activeInfo.progress || 0;
    const remaining = Math.max(0, total - progress);
    
    // Calculate days active
    const activeDays = activeInfo.activatedAt 
      ? Math.max(0, Math.floor((new Date() - new Date(activeInfo.activatedAt)) / (1000 * 60 * 60 * 24)))
      : 0;
    const defaultDays = quest.defaultDurationDays || 14;
    const daysRemaining = Math.max(1, defaultDays - activeDays);
    
    const requiredDailyPace = remaining / daysRemaining;
    const expectedDailyPace = total / defaultDays;

    let title = "Hunter";
    let color = "var(--accent-cyan)";
    let desc = "Pacing is normal and aligned to target deadline.";

    if (progress >= total) {
      return { title: "Completed", color: "var(--accent-green)", requiredDailyPace, daysRemaining };
    }

    if (requiredDailyPace <= expectedDailyPace * 0.5) {
      title = "Shadow Monarch";
      color = "var(--accent-purple)";
      desc = "Pacing is extreme. You are cruising ahead of target timeline!";
    } else if (requiredDailyPace > expectedDailyPace * 1.5) {
      title = "Faltering";
      color = "var(--accent-red)";
      desc = "Pacing warning! You must speed up to reach deadline in time.";
    }

    return {
      title,
      color,
      desc,
      requiredDailyPace: Math.round(requiredDailyPace * 10) / 10,
      daysRemaining
    };
  }

  // Handle custom quest forging submit
  function handleForgeSubmit(e) {
    e.preventDefault();
    if (!forgeName.trim()) return;

    const newQuest = {
      id: `custom_${Date.now()}`,
      name: forgeName,
      cat: forgeCat,
      xp: parseInt(forgeXp) || 100,
      icon: forgeCat.startsWith("📚") ? "📖" : forgeCat.startsWith("📺") ? "📺" : forgeCat.startsWith("🎮") ? "🎮" : "🎯",
      totalUnits: parseInt(forgeUnits) || 1,
      unitName: forgeUnitName,
      estUnitDuration: parseInt(forgeDuration) || 0,
      defaultDurationDays: parseInt(forgeDays) || 7,
      isCustom: true
    };

    forgeCustomQuest(newQuest);
    // Reset fields
    setForgeName("");
    setSubTab("board");
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* ── Header Stats Panel ── */}
      <div className="hud-panel" style={{ padding: '16px 18px', borderLeft: `3px solid ${activeFocusTime > 4.0 ? 'var(--accent-red)' : 'var(--accent-purple)'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 9, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>HUNTER QUEST ENGINE</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{activeCount} quest(s) activated • {doneCount}/{totalTasks} complete</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="number-display" style={{ fontSize: 20, fontWeight: 900, color: activeFocusTime > 4.0 ? 'var(--accent-red)' : 'var(--accent-purple)' }}>
              {activeFocusTime} hrs
            </div>
            <div style={{ fontSize: 8, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>committed focus/day</div>
          </div>
        </div>

        {/* Time Budget Warning */}
        {activeFocusTime > 4.0 ? (
          <div className="system-warning-card animate-glow-purple" style={{ padding: '10px 12px', marginTop: 10, background: 'rgba(248,113,113,0.08)', borderRadius: 8, border: '1px solid rgba(248,113,113,0.2)' }}>
            <div style={{ fontSize: 10, color: 'var(--accent-red)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>⚠ DEBUFF APPLIED: EXHAUSTION DETECTED</div>
            <div style={{ fontSize: 11, color: 'rgba(248,113,113,0.7)', lineHeight: 1.4 }}>
              Your committed time ({activeFocusTime} hrs/day) exceeds safety threshold of 4.0 hrs/day. Focus slots over-allocation reduces recovery efficiency. Deactivate a quest to clear status debuff.
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 8, fontStyle: 'italic' }}>
            ✓ Committed pacing represents safe, focused energy. Your mana supply is balanced.
          </div>
        )}
      </div>

      {/* ── Sub Tabs ── */}
      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: 3, borderRadius: 10, gap: 2 }}>
        {[
          ["active", "⚡ Active Focus"],
          ["board", "📋 Quest Board"],
          ["completed", "✓ Completed"],
          ["forge", "⚒ Forge Quest"]
        ].map(([id, label]) => (
          <button key={id} onClick={() => setSubTab(id)} style={{
            flex: 1, padding: '10px 4px', fontSize: 10, border: 'none', background: subTab === id ? 'var(--bg-card)' : 'transparent',
            color: subTab === id ? 'var(--accent-purple)' : 'var(--text-tertiary)', borderRadius: 8, cursor: 'pointer',
            fontWeight: 800, transition: 'all 0.2s', letterSpacing: '0.04em', textTransform: 'uppercase'
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab 1: Active Focus Quests ── */}
      {subTab === "active" && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.keys(activeQuests).length === 0 ? (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '40px 16px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🛡️</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>Focus Backlog is Empty</div>
              <div style={{ fontSize: 11, marginTop: 6, lineHeight: 1.5 }}>
                You currently have no active focus quests. Visit the **Quest Board** to allocate your daily focus slots.
              </div>
              <button className="btn btn-primary" onClick={() => setSubTab("board")} style={{ marginTop: 16, padding: '8px 16px', borderRadius: 8, fontSize: 11 }}>
                Browse Quests
              </button>
            </div>
          ) : (
            (() => {
              const grouped = {};
              Object.keys(activeQuests).forEach(qid => {
                const q = allQuests.find(x => x.id === qid);
                if (!q) return;
                const cat = q.cat || '📌 Other';
                if (!grouped[cat]) grouped[cat] = [];
                grouped[cat].push(qid);
              });

              return Object.keys(grouped).map(cat => (
                <div key={cat} className="active-quest-card" style={{ padding: '14px 16px', borderLeft: `3px solid ${CAT_COLORS[cat] || 'var(--accent-purple)'}`, marginBottom: '10px' }}>
                  <div style={{ fontSize: 13, color: CAT_COLORS[cat] || 'var(--accent-purple)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
                    {cat}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {grouped[cat].map((qid, index) => {
                      const q = allQuests.find(x => x.id === qid);
                      if (!q) return null;

                      const activeInfo = activeQuests[qid];
                      const pInfo = getPacingInfo(q, activeInfo);
                      const total = q.totalUnits || 1;
                      const progress = activeInfo.progress || 0;
                      const progressPct = Math.round((progress / total) * 100);
                      const remains = Math.max(0, total - progress);

                      const spentHrs = Math.round(((progress * (q.estUnitDuration || 0)) / 60) * 10) / 10;
                      const remHrs = Math.round(((remains * (q.estUnitDuration || 0)) / 60) * 10) / 10;

                      return (
                        <div key={qid} style={{ position: 'relative' }}>
                          {index > 0 && <div style={{ height: 1, background: 'var(--border-subtle)', position: 'absolute', top: -10, left: 0, right: 0 }} />}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 18 }}>{q.icon || '📌'}</span>
                              <span>{q.name}</span>
                            </div>
                            <span className="badge" style={{ background: `${pInfo.color}15`, color: pInfo.color, border: `1px solid ${pInfo.color}33`, fontSize: 8, fontWeight: 800, textTransform: 'uppercase' }}>
                              {pInfo.title}
                            </span>
                          </div>

                          {/* Sub Tasks (if any) */}
                          {q.subTasks && q.subTasks.length > 0 && (
                            <div style={{ marginBottom: 12, padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                              {q.subTasks.map((st, idx) => (
                                <div key={st.id || idx} style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', gap: 6, padding: '3px 0' }}>
                                  <span style={{ color: pInfo.color }}>•</span> {st.n}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Unit Progress Controls */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.15)', padding: '10px 12px', borderRadius: 10, marginBottom: 12 }}>
                            <div>
                              <div className="number-display" style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)' }}>
                                {progress} <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>/ {total} {q.unitName}</span>
                              </div>
                              <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>
                                {spentHrs} hrs completed • {remHrs} hrs left
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn" onClick={() => updateQuestProgress(qid, progress - 1)} style={{
                                width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
                                color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900
                              }}>-</button>
                              <button className="btn animate-glow-purple" onClick={() => updateQuestProgress(qid, progress + 1)} style={{
                                width: 32, height: 32, borderRadius: 8, background: `${pInfo.color}18`, border: `1px solid ${pInfo.color}44`,
                                color: pInfo.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900
                              }}>+</button>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div style={{ height: 5, background: 'rgba(255,255,255,0.03)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border-subtle)', marginBottom: 8 }}>
                            <div style={{ height: '100%', width: `${progressPct}%`, background: `linear-gradient(90deg, ${pInfo.color}aa, ${pInfo.color})`, transition: 'width 0.4s' }} />
                          </div>

                          {/* Pacing Speed Description */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-secondary)' }}>
                            <span>Pacing required: <strong style={{ color: pInfo.color }}>{pInfo.requiredDailyPace} {q.unitName}/day</strong></span>
                            <span>Deadline: <strong>{pInfo.daysRemaining} days left</strong></span>
                          </div>

                          {/* Warning descriptions */}
                          {pInfo.title === "Faltering" && (
                            <div style={{ fontSize: 10, color: 'var(--accent-red)', marginTop: 8, background: 'rgba(248,113,113,0.05)', padding: '6px 8px', borderRadius: 6, border: '1px solid rgba(248,113,113,0.1)' }}>
                              ⚠ Warning: You are falling behind deadline pace. Complete this unit more regularly to clear the penalty check!
                            </div>
                          )}

                          {/* Deactivate Quest */}
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                            <button className="btn" onClick={() => deactivateQuest(qid)} style={{
                              background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
                              padding: '5px 12px', color: 'var(--text-tertiary)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.04em'
                            }}>
                              Deactivate Quest
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ));
            })()
          )}
        </div>
      )}

      {/* ── Tab 2: Quest Board (Backlog) ── */}
      {subTab === "board" && (
        <div>
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
            <button className="btn" onClick={() => setFilterCat(null)} style={{
              padding: '5px 10px', fontSize: 9, borderRadius: 20, fontWeight: 700, textTransform: 'uppercase',
              background: !filterCat ? 'rgba(139,92,246,0.12)' : 'transparent',
              border: !filterCat ? '1px solid rgba(139,92,246,0.3)' : '1px solid var(--border-subtle)',
              color: !filterCat ? 'var(--accent-purple)' : 'var(--text-tertiary)'
            }}>All</button>
            {categories.map(cat => {
              const color = CAT_COLORS[cat] || 'var(--accent-purple)';
              const totalCat = allQuests.filter(q => q.cat === cat).length;
              const doneCat = allQuests.filter(q => q.cat === cat && completed[q.id]).length;
              const limit = CATEGORY_LIMITS[cat];
              const isSlotBusy = Object.keys(activeQuests).some(qid => {
                const q = allQuests.find(x => x.id === qid);
                return q && q.cat === cat;
              });

              return (
                <button key={cat} className="btn" onClick={() => setFilterCat(filterCat === cat ? null : cat)} style={{
                  padding: '5px 10px', fontSize: 9, borderRadius: 20, fontWeight: 700, textTransform: 'uppercase',
                  background: filterCat === cat ? `${color}18` : 'transparent',
                  border: filterCat === cat ? `1px solid ${color}44` : '1px solid var(--border-subtle)',
                  color: filterCat === cat ? color : 'var(--text-tertiary)'
                }}>
                  {cat.split(' ')[0]} {doneCat}/{totalCat} {limit && <span style={{ color: isSlotBusy ? 'var(--accent-red)' : 'var(--accent-green)', marginLeft: 3 }}>[{isSlotBusy ? '🔒' : '🔓'}]</span>}
                </button>
              );
            })}
          </div>

          {/* Quest Board Categories List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {categories
              .filter(c => !filterCat || c === filterCat)
              .map(cat => {
                const catTasks = allQuests.filter(q => q.cat === cat);
                const color = CAT_COLORS[cat] || 'var(--accent-purple)';
                const limit = CATEGORY_LIMITS[cat];
                const activeInCat = Object.keys(activeQuests).filter(qid => {
                  const q = allQuests.find(x => x.id === qid);
                  return q && q.cat === cat;
                });
                const isCatFull = limit && activeInCat.length >= limit;

                return (
                  <div key={cat} className="hud-panel" style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{cat}</span>
                        {limit && (
                          <span style={{ fontSize: 9, color: isCatFull ? 'var(--accent-red)' : 'var(--accent-green)', background: 'rgba(255,255,255,0.02)', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>
                            SLOTS: {activeInCat.length} / {limit} USED
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600 }}>{catTasks.filter(q => completed[q.id]).length}/{catTasks.length} Done</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {catTasks.map(q => {
                        const isDone = completed[q.id];
                        const isActive = !!activeQuests[q.id];
                        const isExpanded = expandedQuestId === q.id;

                        // Calculate pacing demands
                        const defaultDays = q.defaultDurationDays || 14;
                        const dailyPace = Math.ceil((q.totalUnits || 1) / defaultDays);
                        const estDailyMinutes = dailyPace * (q.estUnitDuration || 0);

                        return (
                          <div key={q.id} style={{
                            background: isDone ? 'rgba(52,211,153,0.03)' : isActive ? 'rgba(139,92,246,0.03)' : 'var(--bg-card)',
                            border: `1px solid ${isDone ? 'rgba(52,211,153,0.12)' : isActive ? 'rgba(139,92,246,0.2)' : 'var(--border-subtle)'}`,
                            borderRadius: 12, overflow: 'hidden', transition: 'all 0.25s'
                          }}>
                            {/* Quest Row Summary */}
                            <div onClick={() => setExpandedQuestId(isExpanded ? null : q.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', cursor: 'pointer' }}>
                              <div style={{
                                width: 34, height: 34, borderRadius: 8,
                                background: isDone ? 'rgba(52,211,153,0.08)' : isActive ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${isDone ? 'rgba(52,211,153,0.2)' : isActive ? 'rgba(139,92,246,0.2)' : 'var(--border-subtle)'}`,
                                display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0
                              }}>
                                {q.icon || '📌'}
                              </div>

                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: isDone ? 'var(--accent-green)' : 'var(--text-primary)', textDecoration: isDone ? 'line-through' : 'none' }}>
                                  {q.name}
                                </div>
                                <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>
                                  Pacing: {q.totalUnits || 1} {q.unitName || 'units'} in {defaultDays} days • <span style={{ color: 'rgba(251,191,36,0.5)' }}>+{q.xp} XP</span>
                                </div>
                                {q.subTasks && q.subTasks.length > 0 && !isExpanded && (
                                  <div style={{ fontSize: 9, color: 'var(--text-tertiary)', marginTop: 2, fontStyle: 'italic' }}>
                                    Includes {q.subTasks.length} sub-tasks
                                  </div>
                                )}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {isDone ? (
                                  <span style={{ color: 'var(--accent-green)', fontSize: 18 }}>✓</span>
                                ) : isActive ? (
                                  <span className="badge badge-done" style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--accent-purple)', border: '1px solid rgba(139,92,246,0.2)', fontSize: 8 }}>ACTIVE</span>
                                ) : (
                                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>DETAILS ▼</span>
                                )}
                              </div>
                            </div>

                            {/* Quest Row Expanded Details & Actions */}
                            {isExpanded && (
                              <div style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.15)', borderTop: '1px solid var(--border-subtle)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 11, color: 'var(--text-secondary)', marginBottom: 12 }}>
                                  <div>
                                    <div style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: 8, letterSpacing: '0.04em', marginBottom: 2 }}>QUEST INTENSITY</div>
                                    <strong>{q.totalUnits || 1} {q.unitName} total</strong>
                                  </div>
                                  <div>
                                    <div style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: 8, letterSpacing: '0.04em', marginBottom: 2 }}>DAILY PACING SPEED</div>
                                    <strong style={{ color }}>~{dailyPace} {q.unitName} / day</strong>
                                  </div>
                                  <div>
                                    <div style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: 8, letterSpacing: '0.04em', marginBottom: 2 }}>EST. TIME NEEDED</div>
                                    <strong>~{Math.round(((q.totalUnits * (q.estUnitDuration || 0)) / 60) * 10) / 10} hours total</strong>
                                  </div>
                                  {q.estUnitDuration > 0 && (
                                    <div>
                                      <div style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: 8, letterSpacing: '0.04em', marginBottom: 2 }}>EST. TIME / DAY</div>
                                      <strong style={{ color: 'var(--accent-cyan)' }}>~{estDailyMinutes} mins / day</strong>
                                    </div>
                                  )}
                                </div>

                                {q.subTasks && q.subTasks.length > 0 && (
                                  <div style={{ marginBottom: 12, padding: '8px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: 8, letterSpacing: '0.04em', marginBottom: 6, fontWeight: 700 }}>SUB-TASKS</div>
                                    {q.subTasks.map((st, idx) => (
                                      <div key={st.id || idx} style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', gap: 6, padding: '2px 0' }}>
                                        <span style={{ color }}>•</span> {st.n}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                  {q.isCustom && (
                                    <button className="btn" onClick={() => removeCustomQuest(q.id)} style={{
                                      background: 'transparent', border: '1px solid rgba(248,113,113,0.2)', color: 'var(--accent-red)',
                                      borderRadius: 8, padding: '6px 12px', fontSize: 10, fontWeight: 700
                                    }}>
                                      DISCARD QUEST
                                    </button>
                                  )}
                                  <div style={{ flex: 1 }} />

                                  {!isDone && !isActive && (
                                    <button
                                      onClick={() => {
                                        if (isCatFull) {
                                          alert(`SYSTEM DECREE: "${cat}" limit reached! Deactivate current active quest in this category first.`);
                                        } else {
                                          activateQuest(q.id);
                                        }
                                      }}
                                      disabled={isCatFull}
                                      className="btn animate-glow-purple"
                                      style={{
                                        background: isCatFull ? 'rgba(255,255,255,0.02)' : `linear-gradient(135deg, ${color}, #16162a)`,
                                        border: `1px solid ${isCatFull ? 'var(--border-subtle)' : color}`,
                                        borderRadius: 8, padding: '7px 18px', color: isCatFull ? 'var(--text-muted)' : '#fff',
                                        fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: isCatFull ? 'not-allowed' : 'pointer'
                                      }}
                                    >
                                      {isCatFull ? "Slot Locked 🔒" : "ACTIVATE FOCUS ⚡"}
                                    </button>
                                  )}

                                  {isActive && (
                                    <button className="btn" onClick={() => deactivateQuest(q.id)} style={{
                                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                      borderRadius: 8, padding: '7px 14px', color: 'var(--text-tertiary)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase'
                                    }}>
                                      DEACTIVATE FOCUS
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ── Tab 3: Completed Quests ── */}
      {subTab === "completed" && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {allQuests.filter(q => completed[q.id]).length === 0 ? (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '40px 16px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🛡️</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>No Completed Quests</div>
              <div style={{ fontSize: 11, marginTop: 6, lineHeight: 1.5 }}>
                Your completed archives are empty. Finish active focus quests to earn achievements and advance your hunter rank!
              </div>
            </div>
          ) : (
            allQuests
              .filter(q => completed[q.id])
              .map(q => {
                const color = CAT_COLORS[q.cat] || 'var(--accent-purple)';
                return (
                  <div key={q.id} className="hud-panel" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(52, 211, 153, 0.04)', borderColor: 'rgba(52, 211, 153, 0.15)' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
                    }}>{q.icon || '🏆'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-green)', textDecoration: 'line-through' }}>{q.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>{q.cat} • Awarded +{q.xp} XP</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{ color: 'var(--accent-green)', fontSize: 18, fontWeight: 900 }}>✓ Done</span>
                      <button onClick={() => updateQuestProgress(q.id, (q.totalUnits || 1) - 1)} style={{
                        background: 'transparent', border: '1px solid rgba(248,113,113,0.3)', color: 'var(--accent-red)',
                        borderRadius: 6, padding: '2px 8px', fontSize: 9, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase'
                      }}>
                        Undo
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}

      {/* ── Tab 4: Quest Forge Form ── */}
      {subTab === "forge" && (
        <form onSubmit={handleForgeSubmit} className="hud-panel cyber-corners" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--accent-purple)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>⚒ SYSTEM FORGE WORKSHOP</span>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>Formulate a custom focus goal to track and pace dynamically.</div>
          </div>

          {/* Quest Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 9, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Quest Name / Title</label>
            <input type="text" value={forgeName} onChange={e => setForgeName(e.target.value)} placeholder="e.g. Learn React Native" className="cyber-input" required />
          </div>

          {/* Quest Category */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 9, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Category Focus Area</label>
            <select value={forgeCat} onChange={e => setForgeCat(e.target.value)} className="cyber-select">
              <option value="📚 Books">📚 Books (Limit: 1 active)</option>
              <option value="📺 TV Shows/Anime">📺 TV Shows/Anime (Limit: 1 active)</option>
              <option value="🎮 Gaming">🎮 Gaming (Limit: 1 active)</option>
              <option value="🎬 Films">🎬 Films (Limit: 2 active)</option>
              <option value="🎞️ Documentaries">🎞️ Documentaries (Limit: 1 active)</option>
              <option value="🎯 Hobbies">🎯 Hobbies (Limit: 2 active)</option>
              <option value="🏆 Challenges">🏆 Challenges (Limit: 1 active)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {/* Total Units */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 9, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Total Chapters / Episodes</label>
              <input type="number" min="1" max="1000" value={forgeUnits} onChange={e => setForgeUnits(parseInt(e.target.value) || 1)} className="cyber-input" required />
            </div>

            {/* Unit Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 9, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Unit Label</label>
              <input type="text" value={forgeUnitName} onChange={e => setForgeUnitName(e.target.value)} placeholder="e.g., episodes" className="cyber-input" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {/* Unit Duration */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 9, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Unit Duration (Mins)</label>
              <input type="number" min="0" max="600" value={forgeDuration} onChange={e => setForgeDuration(parseInt(e.target.value) || 0)} className="cyber-input" required />
            </div>

            {/* Target Duration Days */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 9, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Days To Complete</label>
              <input type="number" min="1" max="180" value={forgeDays} onChange={e => setForgeDays(parseInt(e.target.value) || 1)} className="cyber-input" required />
            </div>
          </div>

          {/* XP Rewards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 9, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>XP Completion Reward</label>
            <input type="number" min="10" max="10000" value={forgeXp} onChange={e => setForgeXp(parseInt(e.target.value) || 100)} className="cyber-input" required />
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary animate-glow-purple" style={{ padding: '12px', borderRadius: 10, width: '100%', marginTop: 6, fontWeight: 900, letterSpacing: '0.08em' }}>
            FORGE QUEST PROTOCOL ⚒
          </button>
        </form>
      )}
    </div>
  );
}
