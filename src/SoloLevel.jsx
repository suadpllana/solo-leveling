import { useState, useEffect } from "react";
import { 
  RANKS, RANK_TITLES, RANK_COLORS, XP_PER_RANK, getRankInfo,
  DAILY_TASKS, WEEKEND_TASKS, ONE_TIME_TASKS, STOIC_QUOTES, LOOKSMAX_AREAS, YOUTUBE_DATA, CATS 
} from "./data/constants";
import DashTab from "./components/DashTab";
import DailyTab from "./components/DailyTab";
import QuestsTab from "./components/QuestsTab";
import LooksmaxTab from "./components/LooksmaxTab";
import YtTab from "./components/YtTab";

import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";

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

  useEffect(()=>{
    try{
      const res=localStorage.getItem("solo_grind_v1");
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
      localStorage.setItem("solo_grind_v1",JSON.stringify({xp,streak,completedDaily,completedOnce,missedTasks,lastDate:todayStr,watchedYt}));
    }catch(e){}
  },[xp,streak,completedDaily,completedOnce,missedTasks,watchedYt,loaded]);

  function doPopup(msg){setPopup(msg);setTimeout(()=>setPopup(null),2200);}

  function completeSub(id, xp, name) { if(completedDaily[id]) return; setCompletedDaily(p=>({...p, [id]: true})); setXp(p=>p+xp); doPopup('+' + xp + ' XP — ' + name + ' complete!'); }
  function completeDaily(id){
    if(completedDaily[id])return;
    const t=[...DAILY_TASKS, ...WEEKEND_TASKS].find(x=>x.id===id);
    setCompletedDaily(p=>({...p,[id]:true}));
    setXp(p=>p+t.xp);
    setMissedTasks(p=>p.filter(m=>m!==id));
    doPopup(`+${t.xp} XP • ${t.name} complete!`);
  }
  function completeOnce(id){
    if(completedOnce[id])return;
    const t=ONE_TIME_TASKS.find(x=>x.id===id);
    setCompletedOnce(p=>({...p,[id]:true}));
    setXp(p=>p+t.xp);
    doPopup(`+${t.xp} XP • Quest complete!`);
  }
  function watchVideo(cat,idx){
    const key=`${cat}_${idx}`;
    if(!watchedYt[key]){
      setWatchedYt(p=>({...p,[key]:true}));
      setXp(p=>p+40);
      doPopup("+40 XP � Knowledge acquired!");
    }
  }

  const ri=getRankInfo(xp);
  const rc=RANK_COLORS[ri.rank];
  const currentYear = new Date().getFullYear();
  let deadline = new Date(`${currentYear}-05-01T00:00:00`);
  if (deadline < new Date()) deadline = new Date(`${currentYear + 1}-05-01T00:00:00`);
  const timeDiff = Math.max(0, deadline - nowTime);
  const diffD = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const diffH = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
  const diffM = Math.floor((timeDiff / 1000 / 60) % 60);
  const diffS = Math.floor((timeDiff / 1000) % 60);
  const daysLeft = Math.max(0, Math.ceil((deadline - new Date()) / 86400000));
  
  const dailyDone=DAILY_TASKS.filter(t=>completedDaily[t.id]).length;
  const onceDone=ONE_TIME_TASKS.filter(t=>completedOnce[t.id]).length;

  if(!loaded)return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#1c1917",fontFamily:"\"Quicksand\",monospace",fontSize:16,color:"#00f0ff",letterSpacing:"0.05em"}}>
      ? AWAKENING JOURNAL...
    </div>
  );

  const css=`
    @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Quicksand:wght@500;600;700&display=swap");
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#1c1917;}
    ::-webkit-scrollbar{width:3px;}
    ::-webkit-scrollbar-track{background:#292524;}
    ::-webkit-scrollbar-thumb{background:#44403c;border-radius:2px;}
    @keyframes slideUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes xpFly{0%{transform:translate(-50%,-40%) scale(0.7);opacity:0}20%{transform:translate(-50%,-70%) scale(1.1);opacity:1}80%{transform:translate(-50%,-90%) scale(1);opacity:1}100%{transform:translate(-50%,-110%) scale(0.9);opacity:0}}
    @keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100%)}}
    @keyframes rankPulse{0%,100%{opacity:0.7}50%{opacity:1}}
    .card{background:#292524;border:1px solid #44403c;borderRadius:16px;transition:all 0.2s;}
    .card:hover{border-color:#2a2a4a;background:#36302e;}
    .btn{cursor:pointer;font-family:"Nunito",sans-serif;font-weight:700;transition:all 0.15s;border:none;outline:none;}
    .btn:hover{transform:scale(1.03);}
    .btn:active{transform:scale(0.97);}
    .tab-anim{animation:slideUp 0.25s ease;}
  `;

  return(
    <div style={{fontFamily:"\"Nunito\",sans-serif",background:"#1c1917",minHeight:"100vh",color:"#f5f5f4",position:"relative",overflow:"hidden"}}>
      <style>{css}</style>

      {/* Ambient glows */}
      <div style={{position:"fixed",top:"-30%",left:"-20%",width:"70%",height:"70%",borderRadius:"50%",background:"radial-gradient(circle,#00f0ff06 0%,transparent 65%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:"-30%",right:"-20%",width:"70%",height:"70%",borderRadius:"50%",background:"radial-gradient(circle,#7b2fff06 0%,transparent 65%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",top:"40%",right:"-10%",width:"40%",height:"40%",borderRadius:"50%",background:`radial-gradient(circle,${rc}04 0%,transparent 65%)`,pointerEvents:"none",zIndex:0,transition:"background 1s"}}/>

      {/* XP Popup */}
      {popup&&(
        <div style={{position:"fixed",top:"18%",left:"50%",zIndex:9999,animation:"xpFly 2.2s ease forwards",pointerEvents:"none",whiteSpace:"nowrap"}}>
          <div style={{background:"linear-gradient(135deg,#292524,#44403c)",border:`1px solid ${rc}66`,borderRadius:16,padding:"12px 24px",textAlign:"center",backdropFilter:"blur(8px)"}}>
            <div style={{fontFamily:"\"Quicksand\",sans-serif",fontSize:22,fontWeight:900,color:"#ffd700"}}>{popup}</div>
            <div style={{fontSize:10,color:"#00f0ff",letterSpacing:"0.05em",marginTop:3}}>JOURNAL</div>
          </div>
        </div>
      )}

      <div style={{maxWidth:500,margin:"0 auto",position:"relative",zIndex:1,paddingBottom:110}}>
        {/* Header */}
        <div style={{padding:"20px 16px 0",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontFamily:"\"Quicksand\",sans-serif",fontSize:10,letterSpacing:"0.02em",color:rc,marginBottom:5,animation:"rankPulse 2s infinite"}}>{RANKS[ri.rank]}-RANK • {RANK_TITLES[ri.rank]}</div>
            <div style={{fontFamily:"\"Quicksand\",sans-serif",fontSize:22,fontWeight:900,color:"#fff",lineHeight:1.1}}> GRIND</div>
            <div style={{fontSize:12,color:"#a8a29e",marginTop:3,letterSpacing:"0.05em"}}>Cozy Tracking Mode</div>
          </div>
          <div style={{textAlign:"right",paddingTop:2}}>
            <div style={{fontFamily:"\"Quicksand\",sans-serif",fontSize:15,fontWeight:900,color:"#ffd700",marginBottom:4}}>🔥 {streak}d streak</div>
            <div style={{fontSize:12,color:daysLeft<=7?"#ff4444":"#666",marginBottom:3}}>⏳ {daysLeft}d to deadline</div>
            <div style={{fontFamily:"\"Quicksand\",sans-serif",fontSize:13,color:"#00f0ff"}}>{xp.toLocaleString()} XP</div>
          </div>
        </div>

        {/* XP Bar */}
        <div style={{padding:"12px 16px 0"}}>
          <div style={{height:5,background:"#292524",borderRadius:3,overflow:"hidden",border:"1px solid #44403c"}}>
            <div style={{height:"100%",width:`${ri.pct}%`,background:`linear-gradient(90deg,${rc}88,${rc})`,borderRadius:3,transition:"width 1s ease",boxShadow:`0 0 6px ${rc}44`}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginTop:4,color:"#78716c"}}>
            <span style={{color:rc,letterSpacing:"0.02em"}}>{RANK_TITLES[ri.rank]}</span>
            <span>{ri.current.toLocaleString()}/{ri.needed.toLocaleString()} → {RANKS[Math.min(ri.rank+1,7)]}-Rank</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,padding:"14px 16px 0",overflowX:"auto",msOverflowStyle:"none",scrollbarWidth:"none"}}>
          {[["dash","⚡","Home"],["daily","📋","Daily"],["quests","🗺️","Quests"],["looksmax","👁️","Looks"],["yt","▶️","Knowledge"]].map(([id,icon,label])=>(
            <button key={id} className="btn" onClick={()=>setTab(id)} style={{flex:"0 0 auto",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"8px 14px",background:tab===id?"#36302e":"transparent",border:tab===id?`1px solid ${rc}44`:"1px solid #44403c",borderRadius:12,color:tab===id?rc:"#a8a29e",fontFamily:"\"Nunito\",sans-serif",fontWeight:700,fontSize:10,letterSpacing:"0.02em",textTransform:"uppercase"}}>
              <span style={{fontSize:15}}>{icon}</span>{label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{padding:"14px 16px"}} className="tab-anim" key={tab}>
          <Routes>
            <Route path="/" element={<DashTab ri={ri} rc={rc} streak={streak} daysLeft={daysLeft} dailyDone={dailyDone} onceDone={onceDone} missed={missedTasks} quote={todayQuotes[0]} setTab={setTab} xp={xp}/>} />
            <Route path="/daily" element={<DailyTab tasks={DAILY_TASKS} weekendTasks={WEEKEND_TASKS} completed={completedDaily} missed={missedTasks} onComplete={completeDaily} onCompleteSub={completeSub} quotes={todayQuotes} expanded={expandedDaily} setExpanded={setExpandedDaily}/>} />
            <Route path="/quests" element={<QuestsTab tasks={ONE_TIME_TASKS} completed={completedOnce} onComplete={completeOnce} daysLeft={daysLeft} expanded={expandedQuest} setExpanded={setExpandedQuest}/>} />
            <Route path="/looksmax" element={<LooksmaxTab areas={LOOKSMAX_AREAS} selected={lookArea} setSelected={setLookArea} expanded={expandedTip} setExpanded={setExpandedTip}/>} />
            <Route path="/yt" element={<YtTab data={YOUTUBE_DATA} cats={CATS} cat={ytCat} setCat={c=>{setYtCat(c);setYtIdx(0);}} idx={ytIdx} setIdx={setYtIdx} watched={watchedYt} onWatch={watchVideo}/>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>

      {/* Floating Countdown */}
      <div style={{position:"fixed",bottom:24,right:24,zIndex:9998,background:"#292524ee",border:`1px solid ${daysLeft<7?'#ff4444':'#44403c'}`,borderRadius:14,padding:"14px 20px",backdropFilter:"blur(5px)",boxShadow:`0 8px 24px rgba(0,0,0,0.6)`,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
        <div style={{fontFamily:"\"Quicksand\",sans-serif",fontSize:10,letterSpacing:"0.05em",color:"#a8a29e",fontWeight:700}}>DEADLINE � 1 MAY {deadline.getFullYear()}</div>
        <div style={{fontFamily:"\"Quicksand\",monospace",fontSize:22,fontWeight:900,color:daysLeft<7?"#ff4444":"#ffd700",letterSpacing:"2px"}}>
          {diffD}d {String(diffH).padStart(2,'0')}:{String(diffM).padStart(2,'0')}:{String(diffS).padStart(2,'0')}
        </div>
      </div>

    </div>
  );
}




