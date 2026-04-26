import { useState, useEffect, useMemo } from "react";
import {
  RANKS, RANK_TITLES, RANK_COLORS, XP_PER_RANK, getRankInfo,
  DAILY_TASKS, WEEKEND_TASKS, ONE_TIME_TASKS, STOIC_QUOTES, YOUTUBE_DATA, CATS,
  DEADLINE_DATE, DEADLINE_LABEL, MOTIVATION_TIPS
} from "./data/constants";
import DashTab from "./components/DashTab";
import DailyTab from "./components/DailyTab";
import QuestsTab from "./components/QuestsTab";
import YtTab from "./components/YtTab";
import StatsTab from "./components/StatsTab";

import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";

import ScheduleTab from "./components/ScheduleTab";

const TABS = [
  ["dash","⚡","Home"],
  ["daily","📋","Daily"],
  ["schedule","🗓️","Plan"],
  ["quests","🗺️","Quests"],
  ["yt","▶️","Learn"],
  ["stats","📊","Stats"]
];

export default function SoloLevel(){
  const navigate = useNavigate();
  const location = useLocation();
  const tab = location.pathname.replace("/", "") || "dash";

  const setTab = (newTab) => {
    navigate(`/${newTab === "dash" ? "" : newTab}`);
  };

  const[loaded,setLoaded]=useState(false);
  const[xp,setXp]=useState(0);
  const[streak,setStreak]=useState(0);
  const[completedDaily,setCompletedDaily]=useState({});
  const[completedOnce,setCompletedOnce]=useState({});
  const[missedTasks,setMissedTasks]=useState([]);
  const[watchedYt,setWatchedYt]=useState({});
  const[popup,setPopup]=useState(null);
  const[ytCat,setYtCat]=useState("CS2");
  const[ytIdx,setYtIdx]=useState(0);
  const[lookArea,setLookArea]=useState(0);
  const[expandedTip,setExpandedTip]=useState(null);
  const[expandedDaily,setExpandedDaily]=useState(null);
  const[expandedQuest,setExpandedQuest]=useState(null);
  const[nowTime,setNowTime]=useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNowTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  function getKosovoDateStr(){
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Belgrade', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  }
  const todayStr=getKosovoDateStr();

  const currentKosovoTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Belgrade"}));
  const startOfYear = new Date(currentKosovoTime.getFullYear(), 0, 0);
  const diff = currentKosovoTime - startOfYear;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const quoteStartIdx = (dayOfYear * 10) % STOIC_QUOTES.length;
  const todayQuotes = Array.from({length: 10}, (_, i) => STOIC_QUOTES[(quoteStartIdx + i) % STOIC_QUOTES.length]);

  // Daily motivation tip
  const dailyTip = MOTIVATION_TIPS[dayOfYear % MOTIVATION_TIPS.length];

  useEffect(()=>{
    try{
      const res=localStorage.getItem("solo_grind_v2");
      if(res){
        const d=JSON.parse(res);
        setXp(d.xp||0);
        setWatchedYt(d.watchedYt||{});
        setCompletedOnce(d.completedOnce||{});
        if(d.lastDate===todayStr){
          setCompletedDaily(d.completedDaily||{});
          setMissedTasks(d.missedTasks||[]);
          setStreak(d.streak||0);
        }else{
          // Snapshot the previous day's stats before resetting
          if(d.lastDate && d.completedDaily) {
            try {
              const dailyIds = DAILY_TASKS.map(t => t.id);
              const prevCompleted = Object.keys(d.completedDaily).filter(k => d.completedDaily[k] && dailyIds.includes(k));
              const prevMissed = dailyIds.filter(id => !d.completedDaily[id]);
              const savedStats = JSON.parse(localStorage.getItem("solo_grind_stats") || "{}");
              savedStats[d.lastDate] = {
                completed: prevCompleted,
                missed: prevMissed,
                extras: savedStats[d.lastDate]?.extras || []
              };
              localStorage.setItem("solo_grind_stats", JSON.stringify(savedStats));
            } catch(e) {}
          }

          const missed=DAILY_TASKS.filter(t=>!d.completedDaily?.[t.id]).map(t=>t.id);
          const allMissed=[...new Set([...(d.missedTasks||[]),...missed])];
          setMissedTasks(allMissed);
          setCompletedDaily({});

          let yStr = "";
          try{
            const yest = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Belgrade"}));
            yest.setDate(yest.getDate() - 1);
            yStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Belgrade', year: 'numeric', month: '2-digit', day: '2-digit' }).format(yest);
          }catch(e){}

          if(d.lastDate===yStr&&DAILY_TASKS.every(t=>d.completedDaily?.[t.id])){
            setStreak((d.streak||0)+1);
          }else{setStreak(0);}
        }
      }
    }catch(e){}
    setLoaded(true);
  },[]);

  useEffect(()=>{
    if(!loaded)return;
    try{
      localStorage.setItem("solo_grind_v2",JSON.stringify({xp,streak,completedDaily,completedOnce,missedTasks,lastDate:todayStr,watchedYt}));
      // Always sync today's stats to history
      const dailyIds = DAILY_TASKS.map(t => t.id);
      const completedIds = Object.keys(completedDaily).filter(k => completedDaily[k] && dailyIds.includes(k));
      const savedStats = JSON.parse(localStorage.getItem("solo_grind_stats") || "{}");
      savedStats[todayStr] = {
        completed: completedIds,
        missed: dailyIds.filter(id => !completedIds.includes(id)),
        extras: savedStats[todayStr]?.extras || []
      };
      localStorage.setItem("solo_grind_stats", JSON.stringify(savedStats));
    }catch(e){}
  },[xp,streak,completedDaily,completedOnce,missedTasks,watchedYt,loaded]);

  function doPopup(msg){setPopup(msg);setTimeout(()=>setPopup(null),2500);}

  function completeSub(id, xpVal, name) { if(completedDaily[id]) return; setCompletedDaily(p=>({...p, [id]: true})); setXp(p=>p+xpVal); doPopup('+' + xpVal + ' XP — ' + name + ' complete!'); }
  function undoSub(id, xpVal, name) { if(!completedDaily[id]) return; setCompletedDaily(p=>{const n={...p}; delete n[id]; return n;}); setXp(p=>Math.max(0, p-xpVal)); doPopup('-' + xpVal + ' XP — ' + name + ' undone'); }
  function completeDaily(id){
    if(completedDaily[id])return;
    const t=[...DAILY_TASKS, ...WEEKEND_TASKS].find(x=>x.id===id);
    setCompletedDaily(p=>({...p,[id]:true}));
    setXp(p=>p+t.xp);
    setMissedTasks(p=>p.filter(m=>m!==id));
    doPopup(`+${t.xp} XP • ${t.name} complete!`);
    if (WEEKEND_TASKS.some(w => w.id === id)) {
      try {
        const savedStats = JSON.parse(localStorage.getItem("solo_grind_stats") || "{}");
        const today = savedStats[todayStr] || { completed: [], missed: [], extras: [] };
        const label = `Completed "${t.name}"`;
        if (!today.extras.includes(label)) {
          today.extras = [...(today.extras || []), label];
          savedStats[todayStr] = today;
          localStorage.setItem("solo_grind_stats", JSON.stringify(savedStats));
        }
      } catch(e) {}
    }
  }
  function undoDaily(id){
    if(!completedDaily[id])return;
    const t=[...DAILY_TASKS, ...WEEKEND_TASKS].find(x=>x.id===id);
    setCompletedDaily(p=>{const n={...p}; delete n[id]; return n;});
    setXp(p=>Math.max(0, p-t.xp));
    doPopup(`-${t.xp} XP • ${t.name} undone`);
  }
  function completeOnce(id){
    if(completedOnce[id])return;
    const t=ONE_TIME_TASKS.find(x=>x.id===id);
    setCompletedOnce(p=>({...p,[id]:true}));
    setXp(p=>p+t.xp);
    doPopup(`+${t.xp} XP • Quest complete!`);
    try {
      const savedStats = JSON.parse(localStorage.getItem("solo_grind_stats") || "{}");
      const today = savedStats[todayStr] || { completed: [], missed: [], extras: [] };
      const label = `Completed "${t.name}"`;
      if (!today.extras.includes(label)) {
        today.extras = [...(today.extras || []), label];
        savedStats[todayStr] = today;
        localStorage.setItem("solo_grind_stats", JSON.stringify(savedStats));
      }
    } catch(e) {}
  }
  function undoOnce(id){
    if(!completedOnce[id])return;
    const t=ONE_TIME_TASKS.find(x=>x.id===id);
    setCompletedOnce(p=>{const n={...p}; delete n[id]; return n;});
    setXp(p=>Math.max(0, p-t.xp));
    doPopup(`-${t.xp} XP • Quest undone`);
  }
  function watchVideo(cat,idx){
    const key=`${cat}_${idx}`;
    if(!watchedYt[key]){
      setWatchedYt(p=>({...p,[key]:true}));
      setXp(p=>p+40);
      doPopup("+40 XP • Knowledge acquired!");
    }
  }

  const ri=getRankInfo(xp);
  const rc=RANK_COLORS[ri.rank];
  const deadline = new Date(DEADLINE_DATE);
  const timeDiff = Math.max(0, deadline - nowTime);
  const diffD = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const diffH = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
  const diffM = Math.floor((timeDiff / 1000 / 60) % 60);
  const diffS = Math.floor((timeDiff / 1000) % 60);
  const daysLeft = Math.max(0, Math.ceil((deadline - new Date()) / 86400000));

  const dailyDone=DAILY_TASKS.filter(t=>completedDaily[t.id]).length;
  const onceDone=ONE_TIME_TASKS.filter(t=>completedOnce[t.id]).length;
  const totalDailyXp = DAILY_TASKS.reduce((a,t) => a+t.xp, 0);
  const earnedDailyXp = DAILY_TASKS.filter(t=>completedDaily[t.id]).reduce((a,t) => a+t.xp, 0);

  if(!loaded)return(
    <div className="loading-screen">
      <div className="loading-spinner" />
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:'var(--accent-cyan)',letterSpacing:"0.1em",textTransform:'uppercase'}}>
        Initializing Shadow System...
      </div>
    </div>
  );

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
            <Route path="/" element={<DashTab ri={ri} rc={rc} streak={streak} daysLeft={daysLeft} dailyDone={dailyDone} onceDone={onceDone} missed={missedTasks} quote={todayQuotes[0]} setTab={setTab} xp={xp} dailyTip={dailyTip} diffD={diffD} diffH={diffH} diffM={diffM} diffS={diffS} />} />
            <Route path="/daily" element={<DailyTab tasks={DAILY_TASKS} weekendTasks={WEEKEND_TASKS} completed={completedDaily} missed={missedTasks} onComplete={completeDaily} onUndo={undoDaily} onCompleteSub={completeSub} onUndoSub={undoSub} quotes={todayQuotes} expanded={expandedDaily} setExpanded={setExpandedDaily}/>} />
            <Route path="/schedule" element={<ScheduleTab />} />
            <Route path="/quests" element={<QuestsTab tasks={ONE_TIME_TASKS} completed={completedOnce} onComplete={completeOnce} onUndo={undoOnce} daysLeft={daysLeft} expanded={expandedQuest} setExpanded={setExpandedQuest}/>} />
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
