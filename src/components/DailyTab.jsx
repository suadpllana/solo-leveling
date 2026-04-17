import { useState } from "react";

export default function DailyTab({tasks,weekendTasks,completed,missed,onComplete,onCompleteSub,quotes,expanded,setExpanded}){
  const [qIdx, setQIdx] = useState(0);
  const done=tasks.filter(t=>completed[t.id]).length;
  const isStoicDone = completed['stoic'];

  return(
    <div>
      <div style={{background:'linear-gradient(135deg,#292524,#36302e)',border:'1px solid #00f0ff1a',borderRadius:14,padding:'12px 14px',marginBottom:12}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
          <div style={{fontFamily:"'Quicksand',sans-serif",fontSize:9,letterSpacing:'0.05em',color:'#00f0ff'}}>TODAY'S STOIC MANDATE ({qIdx+1}/10)</div>
          {isStoicDone && <span style={{fontSize:10,color:'#00ff88',fontWeight:700}}>✓ DONE</span>}
        </div>
        <div style={{fontSize:13,color:'#d6d3d0',fontStyle:'italic',lineHeight:1.7,minHeight:45}}>"{quotes[qIdx].q}"</div>
        <div style={{fontSize:11,color:'#7b2fff',marginTop:6,fontWeight:600}}>— {quotes[qIdx].a}</div>
        
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
          <div>
            {qIdx > 0 && <button className="btn" onClick={()=>setQIdx(p=>p-1)} style={{background:'transparent',border:'1px solid #44403c',color:'#a8a29e',padding:'4px 10px',fontSize:10,borderRadius:6}}>PREV</button>}
          </div>
          <div>
            {qIdx < 9 ? (
              <button className="btn" onClick={()=>setQIdx(p=>p+1)} style={{background:'#00f0ff1a',border:'1px solid #00f0ff33',color:'#00f0ff',padding:'4px 10px',fontSize:10,borderRadius:6}}>NEXT</button>
            ) : (
              !isStoicDone && <button className="btn" onClick={()=>onComplete('stoic')} style={{background:'#00ff8822',border:'1px solid #00ff8844',color:'#00ff88',padding:'4px 12px',fontSize:10,borderRadius:6,fontWeight:800}}>MARK DONE</button>
            )}
          </div>
        </div>
      </div>

      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
        <div style={{fontFamily:"'Quicksand',sans-serif",fontSize:10,color:'#a8a29e',letterSpacing:'0.02em'}}>DAILY MISSIONS</div>
        <div style={{color:'#00f0ff',fontSize:13,fontWeight:700}}>{done}/{tasks.length}</div>
      </div>

      {missed.length>0&&(
        <div style={{background:'#120808',border:'1px solid #ff33331a',borderRadius:12,padding:'8px 12px',marginBottom:10,fontSize:12,color:'#ff7777',lineHeight:1.5}}>
          ⚠ {missed.length} task{missed.length>1?'s':''} missed yesterday — complete them today for full XP
        </div>
      )}

      <div style={{display:'flex',flexDirection:'column',gap:7}}>
        {tasks.map(task=>{
          const isDone=completed[task.id];
          const isMissed=missed.includes(task.id);
          const isExp=expanded===task.id;
          return(
            <div key={task.id} style={{background:isDone?'#0a180a':isMissed?'#180a0a':'#292524',border:`1px solid ${isDone?'#00ff8822':isMissed?'#ff333322':'#44403c'}`,borderRadius:14,overflow:'hidden',transition:'all 0.2s',cursor:'pointer'}} onClick={()=>setExpanded(isExp?null:task.id)}>
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'11px 12px'}}>
                <div style={{fontSize:20}}>{task.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
                    <span style={{fontWeight:700,fontSize:14,color:isDone?'#00ff88':isMissed?'#ff8888':'#f5f5f4',textDecoration:isDone?'line-through':'none'}}>{task.name}</span>
                    {isMissed&&!isDone&&<span style={{fontSize:8,background:'#ff33331a',color:'#ff4444',padding:'1px 6px',borderRadius:4,letterSpacing:'0.02em',fontFamily:"'Quicksand',sans-serif"}}>MISSED</span>}
                  </div>
                  <div style={{fontSize:11,color:'#a8a29e',marginTop:2}}>🕐 {task.time} • <span style={{color:'#ffd70077'}}>+{task.xp} XP</span> • <span style={{color:'#78716c'}}>tap for tip</span></div>
                </div>
                <div style={{transition:'transform 0.2s ease',transform:isExp?'rotate(180deg)':'rotate(0deg)',color:'#78716c',fontSize:10,marginLeft:4,marginRight:4}}>
                  ▼
                </div>
                {!isDone&&(
                  <button className="btn" onClick={e=>{e.stopPropagation();onComplete(task.id);}} style={{background:'linear-gradient(135deg,#00f0ff1a,#00f0ff0d)',border:'1px solid #00f0ff33',borderRadius:7,padding:'6px 11px',color:'#00f0ff',fontSize:11,letterSpacing:'0.02em'}}>
                    DONE
                  </button>
                )}
                {isDone&&<span style={{color:'#00ff88',fontSize:20}}>✓</span>}
              </div>
              {isExp&&(
                <div style={{padding:'0 12px 12px',borderTop:'1px solid #44403c'}}>
                  <div style={{paddingTop:10,fontSize:13,color:'#aaa',lineHeight:1.75}}>{task.tip}</div>
                  {task.subTasks && (
                    <div style={{marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6}}>
                      {task.subTasks.map(sub => {
                        const subDone = completed[sub.id];
                        return (
                          <div key={sub.id} onClick={(e) => { e.stopPropagation(); if(!subDone) onCompleteSub(sub.id, 20, sub.n); }} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: subDone ? '#00ff8811' : '#1c1917', border: `1px solid ${subDone ? '#00ff8833' : '#44403c'}`, borderRadius: 8, cursor: subDone ? 'default' : 'pointer'}}>
                            <div style={{width: 16, height: 16, borderRadius: 4, border: `2px solid ${subDone ? '#00ff88' : '#78716c'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: subDone ? '#00ff88' : 'transparent'}}>
                              {subDone && <span style={{color: '#000', fontSize: 12, fontWeight: 900}}>✓</span>}
                            </div>
                            <span style={{fontSize: 13, color: subDone ? '#00ff88' : '#d6d3d0', textDecoration: subDone ? 'line-through' : 'none'}}>{sub.n}</span>
                            {!subDone && <span style={{marginLeft: 'auto', fontSize: 10, color: '#ffd70077'}}>+20 XP</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {weekendTasks && weekendTasks.length > 0 && (
        <div style={{marginTop:28}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
            <div style={{fontFamily:"'Quicksand',sans-serif",fontSize:10,color:'#00f0ff',letterSpacing:'0.02em'}}>WEEKEND MISSIONS</div>
            <div style={{flex:1, height: 1, background: 'linear-gradient(90deg, #00f0ff33, transparent)', marginLeft: 12}}></div>
          </div>
          
          <div style={{display:'flex',flexDirection:'column',gap:7}}>
            {weekendTasks.map(task=>{
              const isDone=completed[task.id];
              const isMissed=false; // Weekend tasks don't count as missed for now
              const isExp=expanded===task.id;
              return(
                <div key={task.id} style={{background:isDone?'#0a180a':'#292524',border:`1px solid ${isDone?'#00ff8822':'#44403c'}`,borderRadius:14,overflow:'hidden',transition:'all 0.2s',cursor:'pointer'}} onClick={()=>setExpanded(isExp?null:task.id)}>
                  <div style={{display:'flex',alignItems:'center',gap:10,padding:'11px 12px'}}>
                    <div style={{fontSize:20}}>{task.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
                        <span style={{fontWeight:700,fontSize:14,color:isDone?'#00ff88':'#f5f5f4',textDecoration:isDone?'line-through':'none'}}>{task.name}</span>
                      </div>
                      <div style={{fontSize:11,color:'#a8a29e',marginTop:2}}>⭐ {task.time} • <span style={{color:'#ffd70077'}}>+{task.xp} XP</span> • <span style={{color:'#78716c'}}>tap for tip</span></div>
                    </div>
                    <div style={{transition:'transform 0.2s ease',transform:isExp?'rotate(180deg)':'rotate(0deg)',color:'#78716c',fontSize:10,marginLeft:4,marginRight:4}}>
                      ▼
                    </div>
                    {!isDone&&(
                      <button className="btn" onClick={e=>{e.stopPropagation();onComplete(task.id);}} style={{background:'linear-gradient(135deg,#00f0ff1a,#00f0ff0d)',border:'1px solid #00f0ff33',borderRadius:7,padding:'6px 11px',color:'#00f0ff',fontSize:11,letterSpacing:'0.02em'}}>
                        DONE
                      </button>
                    )}
                    {isDone&&<span style={{color:'#00ff88',fontSize:20}}>✓</span>}
                  </div>
                  {isExp&&(
                    <div style={{padding:'0 12px 12px',borderTop:'1px solid #44403c'}}>
                      <div style={{paddingTop:10,fontSize:13,color:'#aaa',lineHeight:1.75}}>{task.tip}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

