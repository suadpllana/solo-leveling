import { useState } from "react";

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

export default function QuestsTab({tasks,completed,onComplete,onUndo}){
  const cats=[...new Set(tasks.map(t=>t.cat))];
  const totalXp=tasks.reduce((a,t)=>a+t.xp,0);
  const earnedXp=tasks.filter(t=>completed[t.id]).reduce((a,t)=>a+t.xp,0);
  const totalDone = tasks.filter(t=>completed[t.id]).length;
  const pct = Math.round((totalDone/tasks.length)*100);
  const [filterCat, setFilterCat] = useState(null);

  const filteredCats = filterCat ? cats.filter(c => c === filterCat) : cats;

  return(
    <div>
      {/* Header */}
      <div style={{marginBottom:16}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
          <div>
            <div style={{fontSize:9,color:'var(--text-tertiary)',letterSpacing:'0.08em',textTransform:'uppercase',fontWeight:700}}>ONE-TIME QUESTS</div>
            <div style={{fontSize:12,color:'var(--text-secondary)',marginTop:2}}>{totalDone} of {tasks.length} completed</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div className="number-display" style={{fontSize:16,fontWeight:900,color:'var(--accent-purple)'}}>{earnedXp.toLocaleString()}</div>
            <div style={{fontSize:10,color:'var(--text-tertiary)'}}>of {totalXp.toLocaleString()} XP</div>
          </div>
        </div>

        {/* Overall progress */}
        <div style={{height:6,background:'rgba(255,255,255,0.04)',borderRadius:4,overflow:'hidden',border:'1px solid var(--border-subtle)'}}>
          <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,var(--accent-purple),var(--accent-pink))',borderRadius:4,transition:'width 1s ease'}} />
        </div>
      </div>

      {/* Category filter pills */}
      <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:16}}>
        <button className="btn" onClick={()=>setFilterCat(null)} style={{
          padding:'5px 10px',fontSize:10,borderRadius:20,fontWeight:600,
          background:!filterCat?'rgba(139,92,246,0.12)':'transparent',
          border:!filterCat?'1px solid rgba(139,92,246,0.3)':'1px solid var(--border-subtle)',
          color:!filterCat?'var(--accent-purple)':'var(--text-tertiary)',
          letterSpacing:'0.04em'
        }}>All</button>
        {cats.map(cat => {
          const color = CAT_COLORS[cat] || 'var(--accent-purple)';
          const catDone = tasks.filter(t=>t.cat===cat&&completed[t.id]).length;
          const catTotal = tasks.filter(t=>t.cat===cat).length;
          return (
            <button key={cat} className="btn" onClick={()=>setFilterCat(filterCat===cat?null:cat)} style={{
              padding:'5px 10px',fontSize:10,borderRadius:20,fontWeight:600,
              background:filterCat===cat?`${color}18`:'transparent',
              border:filterCat===cat?`1px solid ${color}44`:'1px solid var(--border-subtle)',
              color:filterCat===cat?color:'var(--text-tertiary)',
              letterSpacing:'0.04em'
            }}>
              {cat.split(' ')[0]} {catDone}/{catTotal}
            </button>
          );
        })}
      </div>

      {filteredCats.map(cat=>{
        const catTasks=tasks.filter(t=>t.cat===cat);
        const catDone=catTasks.filter(t=>completed[t.id]).length;
        const color = CAT_COLORS[cat] || 'var(--accent-purple)';
        const catPct = Math.round((catDone/catTasks.length)*100);
        return(
          <div key={cat} style={{marginBottom:20}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <div style={{fontSize:11,color,letterSpacing:'0.04em',fontWeight:700}}>{cat}</div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div style={{width:40,height:3,background:'rgba(255,255,255,0.04)',borderRadius:2,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${catPct}%`,background:color,borderRadius:2,transition:'width 0.5s'}} />
                </div>
                <span style={{fontSize:11,color:'var(--text-tertiary)',fontWeight:600}}>{catDone}/{catTasks.length}</span>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {catTasks.map(task=>{
                const isDone=completed[task.id];
                return(
                  <div key={task.id} className="task-item" style={{
                    background:isDone?'rgba(52,211,153,0.04)':'var(--bg-card)',
                    border:`1px solid ${isDone?'rgba(52,211,153,0.12)':'var(--border-subtle)'}`,
                    borderRadius:12,padding:'13px 14px',display:'flex',alignItems:'center',gap:12,transition:'all 0.25s'
                  }}>
                    <div style={{
                      width:36,height:36,borderRadius:8,
                      background:isDone?'rgba(52,211,153,0.1)':`${color}0d`,
                      border:`1px solid ${isDone?'rgba(52,211,153,0.2)':`${color}22`}`,
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontSize:18,flexShrink:0
                    }}>{task.icon || '📌'}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:600,color:isDone?'var(--accent-green)':'var(--text-primary)',textDecoration:isDone?'line-through':'none'}}>
                        {task.url ? <a href={task.url} target="_blank" rel="noopener noreferrer" style={{color:'inherit', textDecoration:'inherit'}}>{task.name}</a> : task.name}
                      </div>
                      <div style={{fontSize:11,color:'rgba(251,191,36,0.4)',marginTop:3}}>+{task.xp} XP</div>
                    </div>
                    {!isDone?(
                      <button className="btn" onClick={()=>onComplete(task.id)} style={{
                        background:`${color}12`,border:`1px solid ${color}33`,
                        borderRadius:8,padding:'8px 14px',color,fontSize:11,
                        letterSpacing:'0.06em',fontWeight:700
                      }}>DONE</button>
                    ):(
                      <div style={{display:'flex', alignItems:'center', gap: 12}}>
                        <button className="btn" onClick={()=>{ if(onUndo) onUndo(task.id); }} style={{background:'transparent', color:'var(--accent-red)', border:'1px solid rgba(248,113,113,0.3)', padding:'4px 8px', fontSize:10, borderRadius:6}}>
                          UNDO
                        </button>
                        <span style={{color:'var(--accent-green)',fontSize:22}}>✓</span>
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
  );
}
