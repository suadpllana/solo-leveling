export default function QuestsTab({tasks,completed,onComplete,daysLeft,expanded,setExpanded}){
  const cats=[...new Set(tasks.map(t=>t.cat))];
  const totalXp=tasks.reduce((a,t)=>a+t.xp,0);
  const earnedXp=tasks.filter(t=>completed[t.id]).reduce((a,t)=>a+t.xp,0);
  return(
    <div>
      {cats.map(cat=>{
        const catTasks=tasks.filter(t=>t.cat===cat);
        const catDone=catTasks.filter(t=>completed[t.id]).length;
        return(
          <div key={cat} style={{marginBottom:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
              <div style={{fontFamily:"'Quicksand',sans-serif",fontSize:10,color:'#7b2fff',letterSpacing:'0.02em'}}>{cat}</div>
              <div style={{fontSize:11,color:'#78716c'}}>{catDone}/{catTasks.length}</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {catTasks.map(task=>{
                const isDone=completed[task.id];
                return(
                  <div key={task.id} style={{background:isDone?'#0a180a':'#292524',border:`1px solid ${isDone?'#00ff8822':'#44403c'}`,borderRadius:12,padding:'11px 13px',display:'flex',alignItems:'center',gap:10,transition:'all 0.2s'}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:600,color:isDone?'#00ff88':'#f5f5f4',textDecoration:isDone?'line-through':'none'}}>{task.name}</div>
                      <div style={{fontSize:11,color:'#ffd70055',marginTop:2}}>+{task.xp} XP</div>
                    </div>
                    {!isDone?(
                      <button className="btn" onClick={()=>onComplete(task.id)} style={{background:'#7b2fff1a',border:'1px solid #7b2fff33',borderRadius:6,padding:'6px 11px',color:'#c084fc',fontSize:11,letterSpacing:'0.02em'}}>
                        DONE
                      </button>
                    ):<span style={{color:'#00ff88',fontSize:20}}>✓</span>}
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
