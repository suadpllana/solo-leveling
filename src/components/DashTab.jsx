import StatBox from './StatBox';
import { DAILY_TASKS, ONE_TIME_TASKS, RANKS, RANK_COLORS } from '../data/constants';

export default function DashTab({ri,rc,streak,daysLeft,dailyDone,onceDone,missed,quote,setTab,xp}){
  const totalD=DAILY_TASKS.length,totalO=ONE_TIME_TASKS.length;
  const pct=Math.round((dailyDone/totalD)*100);
  const totalXpPossible=DAILY_TASKS.reduce((a,t)=>a+t.xp,0)+ONE_TIME_TASKS.reduce((a,t)=>a+t.xp,0);
  return(
    <div style={{display:'flex',flexDirection:'column',gap:12}}>

      

      {/* Stats grid */}
      <div style={{display:'flex',gap:6}}>
        <StatBox v={`${dailyDone}/${totalD}`} label="Daily Tasks" color='#00f0ff'/>
        <StatBox v={`${onceDone}/${totalO}`} label="Quests Done" color='#7b2fff'/>
        <StatBox v={streak} label="Streak Days" color='#ffd700'/>
        <StatBox v={daysLeft} label="Days Left" color={daysLeft<=7?'#ff4444':'#ff6b00'}/>
      </div>

      {/* Today's progress */}
      <div className="card" style={{padding:14}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <div style={{fontFamily:"'Quicksand',sans-serif",fontSize:10,color:'#a8a29e',letterSpacing:'0.02em'}}>TODAY'S COMPLETION</div>
          <div style={{color:'#00f0ff',fontSize:13,fontWeight:700}}>{pct}%</div>
        </div>
        <div style={{height:8,background:'#1c1917',borderRadius:4,overflow:'hidden',border:'1px solid #44403c'}}>
          <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#00f0ff,#7b2fff)',borderRadius:4,transition:'width 1s ease'}}/>
        </div>
        <div style={{fontSize:11,color:'#78716c',marginTop:5}}>{dailyDone} of {totalD} daily tasks · {onceDone} of {totalO} quests</div>
      </div>

      {/* Missed tasks */}
      {missed.length>0&&(
        <div style={{background:'#180a0a',border:'1px solid #ff333333',borderRadius:16,padding:12,cursor:'pointer'}} onClick={()=>setTab('daily')}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <div style={{fontFamily:"'Quicksand',sans-serif",fontSize:9,color:'#ff4444',letterSpacing:'0.02em'}}>⚠ MISSED — CARRIED OVER</div>
            <div style={{background:'#ff44441a',color:'#ff6666',borderRadius:20,padding:'2px 10px',fontSize:12,fontWeight:700}}>{missed.length}</div>
          </div>
          {missed.slice(0,3).map(id=>{
            const t=DAILY_TASKS.find(x=>x.id===id);
            return t?<div key={id} style={{fontSize:13,color:'#ff8888',padding:'2px 0'}}>• {t.icon} {t.name}</div>:null;
          })}
          {missed.length>3&&<div style={{fontSize:11,color:'#ff444488',marginTop:4}}>+{missed.length-3} more — tap to open Daily tab</div>}
        </div>
      )}

      {/* Quick nav */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        {[['📋','daily','Complete Daily Tasks','Do your missions'],['🗺️','quests','Complete Quests','One-time objectives'],['👁️','looksmax','Looksmax Guide','Physical protocols'],['▶️','yt','Watch a Video','+40 XP per video']].map(([icon,tabId,label,sub])=>(
          <button key={tabId} className="btn card" onClick={()=>setTab(tabId)} style={{padding:'14px 12px',textAlign:'left',display:'flex',gap:10,alignItems:'center',color:'#f5f5f4',background:'#292524',cursor:'pointer'}}>
            <span style={{fontSize:20}}>{icon}</span>
            <div>
              <div style={{fontSize:13,fontWeight:700}}>{label}</div>
              <div style={{fontSize:11,color:'#a8a29e',marginTop:1}}>{sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Rank track */}
      <div className="card" style={{padding:14}}>
        <div style={{fontFamily:"'Quicksand',sans-serif",fontSize:9,color:'#78716c',letterSpacing:'0.02em',marginBottom:12}}>RANK TRACK</div>
        <div style={{display:'flex',gap:4,justifyContent:'space-between'}}>
          {RANKS.map((r,i)=>(
            <div key={r} style={{flex:1,textAlign:'center'}}>
              <div style={{width:'100%',aspectRatio:'1',borderRadius:'50%',background:i<ri.rank?RANK_COLORS[i]:i===ri.rank?`${RANK_COLORS[i]}22`:'#1c1917',border:i===ri.rank?`2px solid ${RANK_COLORS[i]}`:'1px solid #44403c',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontFamily:"'Quicksand',sans-serif",color:i<ri.rank?'#000':i===ri.rank?RANK_COLORS[i]:'#78716c',fontWeight:900,transition:'all 0.5s'}}>{r}</div>
              <div style={{fontSize:8,color:i===ri.rank?RANK_COLORS[i]:'#78716c',marginTop:3,fontFamily:"'Quicksand',sans-serif"}}>{i===ri.rank?'◆':i<ri.rank?'✓':'🔒'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


