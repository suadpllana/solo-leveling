import { useEffect, useMemo, useRef, useState } from "react";
import {
  RANKS, RANK_TITLES, RANK_COLORS, getRankInfo,
  DAILY_TASKS, WEEKEND_TASKS, ONE_TIME_TASKS, STOIC_QUOTES, YOUTUBE_DATA, CATS,
  DEADLINE_DATE, DEADLINE_LABEL, MOTIVATION_TIPS, CATEGORY_LIMITS
} from "./data/constants";
import DashTab from "./components/DashTab";
import QuestsTab from "./components/QuestsTab";
import YtTab from "./components/YtTab";
import StatsTab from "./components/StatsTab";

import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";


const TABS = [
  ["dash","⚡","Home"],
  ["quests","🗺️","Quests"],
  ["yt","▶️","Learn"],
  ["stats","📊","Stats"]
];

const DAILY_PLAN_VERSION = "2026-04-27-v2"; 
const DAILY_TRACKING_START = "2026-04-27";
const KOSOVO_TIME_ZONE = "Europe/Belgrade";
const KOSOVO_DATE_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: KOSOVO_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function getKosovoDateStr(date = new Date()){
  return KOSOVO_DATE_FORMATTER.format(date);
}

function getKosovoNow(){
  return new Date(new Date().toLocaleString("en-US", { timeZone: KOSOVO_TIME_ZONE }));
}

function readJsonStorage(key, fallback){
  try{
    const rawValue = localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  }catch{
    return fallback;
  }
}

function writeJsonStorage(key, value){
  try{
    localStorage.setItem(key, JSON.stringify(value));
  }catch{
    /* Ignore local storage write failures. */
  }
}

function buildHistoryEntry(completedDaily = {}){
  const dailyIds = DAILY_TASKS.map((task) => task.id);
  const completed = Object.keys(completedDaily).filter((taskId) => completedDaily[taskId] && dailyIds.includes(taskId));
  return {
    completed,
    missed: dailyIds.filter((taskId) => !completed.includes(taskId)),
  };
}

function addExtraAchievement(todayStr, label){
  const savedStats = readJsonStorage("solo_grind_stats", {});
  const today = savedStats[todayStr] || { completed: [], missed: [], extras: [] };

  if (today.extras?.includes(label)) {
    return;
  }

  savedStats[todayStr] = {
    ...today,
    extras: [...(today.extras || []), label],
  };
  writeJsonStorage("solo_grind_stats", savedStats);
}

function removeExtraAchievement(todayStr, label){
  const savedStats = readJsonStorage("solo_grind_stats", {});
  const today = savedStats[todayStr];

  if (!today?.extras?.includes(label)) {
    return;
  }

  savedStats[todayStr] = {
    ...today,
    extras: today.extras.filter((entry) => entry !== label),
  };
  writeJsonStorage("solo_grind_stats", savedStats);
}

function loadPersistedState(todayStr){
  const emptyState = {
    xp: 0,
    streak: 0,
    completedDaily: {},
    completedOnce: {},
    missedTasks: [],
    watchedYt: {},
    activeQuests: {},
    customQuests: [],
    pendingHistoryEntry: null,
  };

  const savedState = readJsonStorage("solo_grind_v2", null);
  if (!savedState) {
    return emptyState;
  }

  const matchesDailyPlan = savedState.planVersion === DAILY_PLAN_VERSION;
  const completedDaily = matchesDailyPlan ? (savedState.completedDaily || {}) : {};
  const sharedState = {
    ...emptyState,
    xp: savedState.xp || 0,
    completedOnce: savedState.completedOnce || {},
    watchedYt: savedState.watchedYt || {},
    activeQuests: savedState.activeQuests || {},
    customQuests: savedState.customQuests || [],
  };

  if (matchesDailyPlan && savedState.lastDate === todayStr) {
    return {
      ...sharedState,
      streak: savedState.streak || 0,
      completedDaily,
      missedTasks: savedState.missedTasks || [],
    };
  }

  const yesterday = getKosovoNow();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getKosovoDateStr(yesterday);

  const missedFromPreviousDay = DAILY_TASKS.filter((task) => !completedDaily[task.id]).map((task) => task.id);
  const wasPerfectYesterday =
    matchesDailyPlan &&
    savedState.lastDate === yesterdayStr &&
    DAILY_TASKS.every((task) => completedDaily[task.id]);
  const shouldCarryMissedForward =
    matchesDailyPlan &&
    savedState.lastDate === yesterdayStr &&
    savedState.lastDate >= DAILY_TRACKING_START;

  return {
    ...sharedState,
    streak: wasPerfectYesterday ? (savedState.streak || 0) + 1 : 0,
    completedDaily: {},
    missedTasks: shouldCarryMissedForward ? [...new Set([...(savedState.missedTasks || []), ...missedFromPreviousDay])] : [],
    pendingHistoryEntry: matchesDailyPlan && savedState.lastDate && savedState.lastDate >= DAILY_TRACKING_START && savedState.completedDaily
      ? { date: savedState.lastDate, ...buildHistoryEntry(savedState.completedDaily) }
      : null,
  };
}

export default function SoloLevel(){
  const navigate = useNavigate();
  const location = useLocation();
  const tab = location.pathname.replace("/", "") || "dash";

  const setTab = (newTab) => {
    navigate(`/${newTab === "dash" ? "" : newTab}`);
  };

  const todayStr = useMemo(() => getKosovoDateStr(), []);
  const initialState = useMemo(() => loadPersistedState(todayStr), [todayStr]);
  const pendingHistoryRef = useRef(initialState.pendingHistoryEntry);

  const[xp,setXp]=useState(() => initialState.xp);
  const[streak]=useState(() => initialState.streak);
  const[completedDaily,setCompletedDaily]=useState(() => initialState.completedDaily);
  const[completedOnce,setCompletedOnce]=useState(() => initialState.completedOnce);
  const[missedTasks,setMissedTasks]=useState(() => initialState.missedTasks);
  const[watchedYt,setWatchedYt]=useState(() => initialState.watchedYt);
  const[activeQuests,setActiveQuests]=useState(() => initialState.activeQuests || {});
  const[customQuests,setCustomQuests]=useState(() => initialState.customQuests || []);
  const[popup,setPopup]=useState(null);
  const[ytCat,setYtCat]=useState("CS2");
  const[ytIdx,setYtIdx]=useState(0);
  const[expandedDaily,setExpandedDaily]=useState(null);
  const[nowTime,setNowTime]=useState(() => getKosovoNow());

  useEffect(() => {
    // Automatically purge any active focus quests that are completed
    const toRemove = Object.keys(activeQuests).filter(id => completedOnce[id]);
    if (toRemove.length > 0) {
      setActiveQuests(prev => {
        const next = { ...prev };
        toRemove.forEach(id => delete next[id]);
        return Object.keys(prev).length !== Object.keys(next).length ? next : prev;
      });
    }
  }, [completedOnce, activeQuests]);

  useEffect(() => {
    const timer = setInterval(() => setNowTime(getKosovoNow()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentKosovoTime = nowTime;
  const startOfYear = new Date(currentKosovoTime.getFullYear(), 0, 0);
  const diff = currentKosovoTime - startOfYear;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const quoteStartIdx = (dayOfYear * 10) % STOIC_QUOTES.length;
  const todayQuotes = Array.from({length: 10}, (_, i) => STOIC_QUOTES[(quoteStartIdx + i) % STOIC_QUOTES.length]);

  // Daily motivation tip
  const dailyTip = MOTIVATION_TIPS[dayOfYear % MOTIVATION_TIPS.length];

  useEffect(()=>{
    if (!pendingHistoryRef.current) {
      return;
    }

    const { date, completed, missed } = pendingHistoryRef.current;
    const savedStats = readJsonStorage("solo_grind_stats", {});
    savedStats[date] = {
      completed,
      missed,
      extras: savedStats[date]?.extras || [],
    };
    writeJsonStorage("solo_grind_stats", savedStats);
    pendingHistoryRef.current = null;
  }, []);

  useEffect(()=>{
    writeJsonStorage("solo_grind_v2", { xp, streak, completedDaily, completedOnce, missedTasks, lastDate: todayStr, watchedYt, activeQuests, customQuests, planVersion: DAILY_PLAN_VERSION });

    const savedStats = readJsonStorage("solo_grind_stats", {});
    savedStats[todayStr] = {
      ...buildHistoryEntry(completedDaily),
      extras: savedStats[todayStr]?.extras || [],
    };
    writeJsonStorage("solo_grind_stats", savedStats);
  },[xp,streak,completedDaily,completedOnce,missedTasks,watchedYt,activeQuests,customQuests,todayStr]);

  function doPopup(msg){setPopup(msg);setTimeout(()=>setPopup(null),2500);}

  function completeSub(id, xpVal, name) { if(completedDaily[id]) return; setCompletedDaily(p=>({...p, [id]: true})); setXp(p=>p+xpVal); doPopup('+' + xpVal + ' XP — ' + name + ' complete!'); }
  function undoSub(id, xpVal, name) { if(!completedDaily[id]) return; setCompletedDaily(p=>{const n={...p}; delete n[id]; return n;}); setXp(p=>Math.max(0, p-xpVal)); doPopup('-' + xpVal + ' XP — ' + name + ' undone'); }
  function completeDaily(id){
    if(completedDaily[id])return;
    const t=[...DAILY_TASKS, ...WEEKEND_TASKS].find(x=>x.id===id);
    if(!t)return;
    setCompletedDaily(p=>({...p,[id]:true}));
    setXp(p=>p+t.xp);
    setMissedTasks(p=>p.filter(m=>m!==id));
    doPopup(`+${t.xp} XP • ${t.name} complete!`);
    if (WEEKEND_TASKS.some(w => w.id === id)) {
      addExtraAchievement(todayStr, `Completed "${t.name}"`);
    }
  }
  function undoDaily(id){
    if(!completedDaily[id])return;
    const t=[...DAILY_TASKS, ...WEEKEND_TASKS].find(x=>x.id===id);
    if(!t)return;
    setCompletedDaily(p=>{const n={...p}; delete n[id]; return n;});
    setXp(p=>Math.max(0, p-t.xp));
    doPopup(`-${t.xp} XP • ${t.name} undone`);
    if (WEEKEND_TASKS.some(w => w.id === id)) {
      removeExtraAchievement(todayStr, `Completed "${t.name}"`);
    }
  }
  function completeOnce(id){
    if(completedOnce[id])return;
    const t=[...ONE_TIME_TASKS, ...customQuests].find(x=>x.id===id);
    if(!t)return;
    setCompletedOnce(p=>({...p,[id]:true}));
    setXp(p=>p+t.xp);
    doPopup(`+${t.xp} XP • Quest complete!`);
    addExtraAchievement(todayStr, `Completed "${t.name}"`);
  }
  function undoOnce(id){
    if(!completedOnce[id])return;
    const t=[...ONE_TIME_TASKS, ...customQuests].find(x=>x.id===id);
    if(!t)return;
    setCompletedOnce(p=>{const n={...p}; delete n[id]; return n;});
    setXp(p=>Math.max(0, p-t.xp));
    doPopup(`-${t.xp} XP • Quest undone`);
    removeExtraAchievement(todayStr, `Completed "${t.name}"`);
  }
  function watchVideo(cat,idx){
    const key=`${cat}_${idx}`;
    if(!watchedYt[key]){
      setWatchedYt(p=>({...p,[key]:true}));
      setXp(p=>p+40);
      doPopup("+40 XP • Knowledge acquired!");
    }
  }

  function activateQuest(id) {
    const allQuests = [...ONE_TIME_TASKS, ...customQuests];
    const quest = allQuests.find(q => q.id === id);
    if (!quest) return false;

    // Check category constraints
    const limit = CATEGORY_LIMITS[quest.cat] || 99;
    const currentActiveInCat = Object.keys(activeQuests).filter(qid => {
      const q = allQuests.find(x => x.id === qid);
      return q && q.cat === quest.cat;
    }).length;

    if (currentActiveInCat >= limit) {
      alert(`SYSTEM DECREE: Cannot activate quest! Focus limit reached for "${quest.cat}". You are only permitted to have ${limit} active quest(s) of this category simultaneously. Complete or deactivate your current active quest first to avoid a debuff status!`);
      return false;
    }

    setActiveQuests(prev => ({
      ...prev,
      [id]: { activatedAt: todayStr, progress: 0 }
    }));
    doPopup(`Quest Activated • Focus assigned!`);
    return true;
  }

  function deactivateQuest(id, silent = false) {
    setActiveQuests(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (!silent) doPopup(`Quest Deactivated • Backlog`);
  }

  function updateQuestProgress(id, newProgress) {
    const allQuests = [...ONE_TIME_TASKS, ...customQuests];
    const quest = allQuests.find(q => q.id === id);
    if (!quest) return;

    const clampedProgress = Math.max(0, Math.min(quest.totalUnits || 1, newProgress));

    setActiveQuests(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], progress: clampedProgress }
      };
    });

    if (clampedProgress === quest.totalUnits && !completedOnce[id]) {
      completeOnce(id);
      deactivateQuest(id, true);
    } else if (clampedProgress < quest.totalUnits && completedOnce[id]) {
      undoOnce(id);
    }
  }

  function forgeCustomQuest(newQuest) {
    setCustomQuests(prev => [...prev, newQuest]);
    doPopup(`Quest Forged • Custom Quest Added!`);
  }

  function removeCustomQuest(id) {
    deactivateQuest(id);
    setCustomQuests(prev => prev.filter(q => q.id !== id));
    doPopup(`Quest Forged • Custom Quest Deleted`);
  }

  const ri=getRankInfo(xp);
  const rc=RANK_COLORS[ri.rank];
  const deadline = new Date(DEADLINE_DATE);
  const timeDiff = Math.max(0, deadline - nowTime);
  const diffD = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const diffH = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
  const diffM = Math.floor((timeDiff / 1000 / 60) % 60);
  const diffS = Math.floor((timeDiff / 1000) % 60);
  const daysLeft = Math.max(0, Math.ceil((deadline - nowTime) / 86400000));

  const dailyDone=DAILY_TASKS.filter(t=>completedDaily[t.id]).length;
  const onceDone=ONE_TIME_TASKS.filter(t=>completedOnce[t.id]).length;

  return(
    <div style={{fontFamily:"'Inter',sans-serif",background:'var(--bg-primary)',minHeight:"100vh",color:'var(--text-primary)',position:"relative",overflow:"hidden"}}>

      {/* Ambient Background */}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-40%",left:"-30%",width:"80%",height:"80%",borderRadius:"50%",background:`radial-gradient(circle,${rc}08 0%,transparent 60%)`,transition:"background 2s"}} />
        <div style={{position:"absolute",bottom:"-40%",right:"-30%",width:"80%",height:"80%",borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.04) 0%,transparent 60%)"}} />
        <div style={{position:"absolute",top:"20%",right:"0",width:"60%",height:"60%",borderRadius:"50%",background:"radial-gradient(circle,rgba(0,229,255,0.03) 0%,transparent 60%)"}} />
        {/* Grid overlay */}
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",backgroundSize:"60px 60px",opacity:0.5}} />
      </div>

      {/* XP Popup */}
      {popup&&(
        <div style={{position:"fixed",top:"16%",left:"50%",zIndex:9999,animation:"xpFly 2.5s ease forwards",pointerEvents:"none",whiteSpace:"nowrap"}}>
          <div style={{background:"rgba(22,22,31,0.95)",backdropFilter:"blur(20px)",border:`1px solid ${rc}55`,borderRadius:16,padding:"14px 28px",textAlign:"center",boxShadow:`0 8px 40px rgba(0,0,0,0.5), 0 0 30px ${rc}22`}}>
            <div style={{fontFamily:"'Inter',sans-serif",fontSize:18,fontWeight:900,color:"var(--accent-gold)",letterSpacing:"0.02em"}}>{popup}</div>
          </div>
        </div>
      )}

      <div style={{maxWidth:520,margin:"0 auto",position:"relative",zIndex:1,paddingBottom:120}}>
        {/* ── Header ── */}
        <div style={{padding:"24px 16px 0",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:10,letterSpacing:"0.12em",color:rc,marginBottom:6,textTransform:"uppercase",fontWeight:700,animation:"pulse 2s infinite"}}>
              {RANKS[ri.rank]}-RANK • {RANK_TITLES[ri.rank]}
            </div>
            <div style={{fontSize:26,fontWeight:900,color:"#fff",lineHeight:1.1,letterSpacing:"-0.02em"}}>
              SHADOW<span style={{color:rc}}> PROTOCOL</span>
            </div>
            <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:5,letterSpacing:"0.04em"}}>
              {dailyTip}
            </div>
          </div>
          <div style={{textAlign:"right",paddingTop:2}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:6,marginBottom:6}}>
              <span style={{fontSize:18}}>🔥</span>
              <span className="number-display" style={{fontSize:20,fontWeight:900,color:"var(--accent-gold)"}}>{streak}</span>
              <span style={{fontSize:11,color:'var(--text-tertiary)'}}>day streak</span>
            </div>
            <div className="number-display" style={{fontSize:14,color:"var(--accent-cyan)",fontWeight:700}}>
              {xp.toLocaleString()} XP
            </div>
          </div>
        </div>

        {/* ── XP Progress Bar ── */}
        <div style={{padding:"16px 16px 0"}}>
          <div style={{height:6,background:"rgba(255,255,255,0.04)",borderRadius:6,overflow:"hidden",border:"1px solid var(--border-subtle)"}}>
            <div style={{height:"100%",width:`${ri.pct}%`,background:`linear-gradient(90deg,${rc}99,${rc})`,borderRadius:6,transition:"width 1s cubic-bezier(0.4,0,0.2,1)",boxShadow:`0 0 12px ${rc}33`}} />
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginTop:6,color:'var(--text-tertiary)'}}>
            <span style={{color:rc,fontWeight:600}}>{RANK_TITLES[ri.rank]}</span>
            <span className="number-display">{ri.current.toLocaleString()}/{ri.needed.toLocaleString()} → {RANKS[Math.min(ri.rank+1,7)]}-Rank</span>
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <div style={{display:"flex",gap:3,padding:"16px 16px 0",overflowX:"auto",msOverflowStyle:"none",scrollbarWidth:"none"}}>
          {TABS.map(([id,icon,label])=>(
            <button key={id} className="btn" onClick={()=>setTab(id)} style={{
              flex:"0 0 auto",display:"flex",flexDirection:"column",alignItems:"center",gap:3,
              padding:"10px 14px",
              background:tab===id?"rgba(255,255,255,0.06)":"transparent",
              border:tab===id?`1px solid ${rc}44`:"1px solid transparent",
              borderRadius:12,
              color:tab===id?rc:'var(--text-tertiary)',
              fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:9,
              letterSpacing:"0.08em",textTransform:"uppercase",
              transition:"all 0.25s"
            }}>
              <span style={{fontSize:16,filter:tab===id?`drop-shadow(0 0 6px ${rc}66)`:'none',transition:"filter 0.3s"}}>{icon}</span>{label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div style={{padding:"16px 16px"}} className="tab-anim" key={tab}>
          <Routes>
            <Route path="/" element={<DashTab ri={ri} rc={rc} streak={streak} daysLeft={daysLeft} dailyDone={dailyDone} onceDone={onceDone} missed={missedTasks} setTab={setTab} activeQuests={activeQuests} customQuests={customQuests} />} />
            <Route path="/quests" element={<QuestsTab tasks={ONE_TIME_TASKS} completed={completedOnce} onComplete={completeOnce} onUndo={undoOnce} activeQuests={activeQuests} customQuests={customQuests} activateQuest={activateQuest} deactivateQuest={deactivateQuest} updateQuestProgress={updateQuestProgress} forgeCustomQuest={forgeCustomQuest} removeCustomQuest={removeCustomQuest} />} />
            <Route path="/yt" element={<YtTab data={YOUTUBE_DATA} cats={CATS} cat={ytCat} setCat={c=>{setYtCat(c);setYtIdx(0);}} idx={ytIdx} setIdx={setYtIdx} watched={watchedYt} onWatch={watchVideo}/>} />
            <Route path="/stats" element={<StatsTab />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>

      {/* ── Floating Countdown ── */}
      <div style={{
        position:"fixed",bottom:20,right:20,zIndex:9998,
        background:"rgba(10,10,15,0.85)",
        backdropFilter:"blur(20px)",
        border:`1px solid ${daysLeft<7?'rgba(248,113,113,0.3)':'var(--border-default)'}`,
        borderRadius:18,padding:"16px 22px",
        boxShadow: daysLeft<7 ? '0 8px 30px rgba(248,113,113,0.15)' : 'var(--shadow-elevated)',
        display:"flex",flexDirection:"column",alignItems:"center",gap:8,
        animation: daysLeft<7 ? 'countdownPulse 2s infinite' : 'none'
      }}>
        <div style={{fontSize:9,letterSpacing:"0.12em",color:'var(--text-tertiary)',fontWeight:700,textTransform:"uppercase"}}>
          DEADLINE • {DEADLINE_LABEL}
        </div>
        <div className="number-display" style={{fontSize:24,fontWeight:900,color:daysLeft<7?"var(--accent-red)":"var(--accent-gold)",letterSpacing:"2px"}}>
          {diffD}d {String(diffH).padStart(2,'0')}:{String(diffM).padStart(2,'0')}:{String(diffS).padStart(2,'0')}
        </div>
        <div style={{width:"100%",height:2,background:"rgba(255,255,255,0.04)",borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${Math.max(0,100-(daysLeft/35*100))}%`,background:daysLeft<7?'var(--accent-red)':'var(--accent-gold)',borderRadius:2,transition:"width 1s"}} />
        </div>
      </div>
    </div>
  );
}
