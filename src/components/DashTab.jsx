import StatBox from './StatBox';
import { DAILY_TASKS, ONE_TIME_TASKS, RANKS, RANK_COLORS } from '../data/constants';

function ProgressRing({pct, color, size=80, strokeWidth=5, children}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct/100) * circ;
  return (
    <div style={{position:'relative',width:size,height:size,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <svg width={size} height={size} style={{position:'absolute',top:0,left:0}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{transition:'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)',transform:'rotate(-90deg)',transformOrigin:'50% 50%'}}
        />
      </svg>
      {children}
    </div>
  );
}

export default function DashTab({ri,rc,streak,daysLeft,dailyDone,onceDone,missed,quote,setTab,xp,dailyTip,diffD,diffH,diffM,diffS}){
  const totalD=DAILY_TASKS.length,totalO=ONE_TIME_TASKS.length;
  const pct=Math.round((dailyDone/totalD)*100);

  return(
    <div style={{display:'flex',flexDirection:'column',gap:14}}>

      {/* Hero card with progress ring */}
      <div className="glass-card" style={{padding:'20px 18px',display:'flex',alignItems:'center',gap:18}}>
        <ProgressRing pct={pct} color={rc} size={90} strokeWidth={6}>
          <div style={{textAlign:'center'}}>
            <div className="number-display" style={{fontSize:22,fontWeight:900,color:rc}}>{pct}%</div>
            <div style={{fontSize:8,color:'var(--text-tertiary)',letterSpacing:'0.06em',textTransform:'uppercase'}}>TODAY</div>
          </div>
        </ProgressRing>
        <div style={{flex:1}}>
          <div style={{fontSize:9,color:'var(--text-tertiary)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:6}}>DAILY COMPLETION</div>
          <div style={{fontSize:14,fontWeight:700,color:'var(--text-primary)',marginBottom:4}}>{dailyDone} of {totalD} daily tasks</div>
          <div style={{fontSize:12,color:'var(--text-secondary)'}}>{onceDone} of {totalO} quests completed</div>
          <div style={{height:4,background:'rgba(255,255,255,0.04)',borderRadius:4,overflow:'hidden',marginTop:10}}>
            <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,var(--accent-cyan),var(--accent-purple))`,borderRadius:4,transition:'width 1s ease'}} />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{display:'flex',gap:8}}>
        <StatBox v={`${dailyDone}/${totalD}`} label="Daily Tasks" color='var(--accent-cyan)' icon="📋" />
        <StatBox v={`${onceDone}/${totalO}`} label="Quests Done" color='var(--accent-purple)' icon="🗺️" />
        <StatBox v={streak} label="Streak Days" color='var(--accent-gold)' icon="🔥" />
        <StatBox v={daysLeft} label="Days Left" color={daysLeft<=7?'var(--accent-red)':'var(--accent-orange)'} icon="⏳" />
      </div>

 

      {/* Missed tasks */}
      {missed.length>0&&(
        <div style={{
          background:'rgba(248,113,113,0.04)',
          border:'1px solid rgba(248,113,113,0.12)',
          borderRadius:14,padding:'14px 16px',cursor:'pointer',
          transition:'all 0.2s'
        }} onClick={()=>setTab('daily')}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <div style={{fontSize:10,color:'var(--accent-red)',letterSpacing:'0.06em',fontWeight:700,textTransform:'uppercase'}}>⚠ MISSED — CARRIED OVER</div>
            <div className="badge badge-missed">{missed.length}</div>
          </div>
          {missed.slice(0,3).map(id=>{
            const t=DAILY_TASKS.find(x=>x.id===id);
            return t?<div key={id} style={{fontSize:13,color:'rgba(248,113,113,0.7)',padding:'2px 0'}}>• {t.icon} {t.name}</div>:null;
          })}
          {missed.length>3&&<div style={{fontSize:11,color:'rgba(248,113,113,0.4)',marginTop:6}}>+{missed.length-3} more — tap to see all</div>}
        </div>
      )}

      {/* Quick nav grid */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {[
          ['📋','daily','Daily Tasks','Complete your missions','var(--accent-cyan)'],
          ['🗺️','quests','Quests','One-time objectives','var(--accent-purple)'],
          ['▶️','yt','Knowledge','+40 XP per video','var(--accent-red)'],
          ['📊','stats','Statistics','View your history','var(--accent-green)']
        ].map(([icon,tabId,label,sub,color])=>(
          <button key={tabId} className="btn" onClick={()=>setTab(tabId)} style={{
            padding:'16px 14px',textAlign:'left',display:'flex',gap:12,alignItems:'center',
            color:'var(--text-primary)',background:'var(--bg-card)',cursor:'pointer',
            border:'1px solid var(--border-subtle)',borderRadius:14,
            transition:'all 0.25s',position:'relative',overflow:'hidden'
          }}>
            <div style={{
              width:40,height:40,borderRadius:10,
              background:`${color}11`,border:`1px solid ${color}22`,
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:20,flexShrink:0
            }}>{icon}</div>
            <div>
              <div style={{fontSize:13,fontWeight:700}}>{label}</div>
              <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:2}}>{sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Rank track */}
      <div className="glass-card" style={{padding:'16px 18px'}}>
        <div style={{fontSize:9,color:'var(--text-tertiary)',letterSpacing:'0.08em',marginBottom:14,textTransform:'uppercase',fontWeight:700}}>RANK PROGRESSION</div>
        <div style={{display:'flex',gap:6,justifyContent:'space-between'}}>
          {RANKS.map((r,i)=>(
            <div key={r} style={{flex:1,textAlign:'center'}}>
              <div style={{
                width:'100%',aspectRatio:'1',borderRadius:'50%',
                background:i<ri.rank?RANK_COLORS[i]:i===ri.rank?`${RANK_COLORS[i]}18`:'rgba(255,255,255,0.03)',
                border:i===ri.rank?`2px solid ${RANK_COLORS[i]}`:'1px solid var(--border-subtle)',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:10,fontWeight:900,
                color:i<ri.rank?'#000':i===ri.rank?RANK_COLORS[i]:'var(--text-muted)',
                transition:'all 0.5s',
                boxShadow:i===ri.rank?`0 0 12px ${RANK_COLORS[i]}33`:'none'
              }}>{r}</div>
              <div style={{fontSize:7,color:i===ri.rank?RANK_COLORS[i]:'var(--text-muted)',marginTop:4,fontWeight:700}}>
                {i===ri.rank?'◆':i<ri.rank?'✓':'🔒'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
