export default function YtTab({data,cats,cat,setCat,idx,setIdx,watched,onWatch}){
  const vids=data[cat]||[];
  const vid=vids[idx];
  const key=`${cat}_${idx}`;
  const isWatched=watched[key];
  const watchedCount=Object.keys(watched).length;
  const totalVids = cats.reduce((a,c) => a + (data[c]?.length || 0), 0);
  const pct = Math.round((watchedCount/totalVids)*100);

  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
        <div>
          <div style={{fontSize:9,color:'var(--text-tertiary)',letterSpacing:'0.08em',textTransform:'uppercase',fontWeight:700}}>KNOWLEDGE PROTOCOL</div>
          <div style={{fontSize:12,color:'var(--text-secondary)',marginTop:2}}>+40 XP per video watched</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div className="number-display" style={{fontSize:16,fontWeight:900,color:'var(--accent-orange)'}}>{watchedCount}</div>
          <div style={{fontSize:10,color:'var(--text-tertiary)'}}>videos watched</div>
        </div>
      </div>

      {/* Category grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:5,marginBottom:16}}>
        {cats.map(c=>{
          const hasWatched=Object.keys(watched).some(k=>k.startsWith(c+'_'));
          const allWatched=(data[c]||[]).every((v,i)=>watched[`${c}_${i}`]);
          return(
            <button key={c} className="btn" onClick={()=>setCat(c)} style={{
              padding:'8px 4px',
              background:cat===c?'rgba(251,146,60,0.1)':'var(--bg-card)',
              border:`1px solid ${cat===c?'rgba(251,146,60,0.35)':allWatched?'rgba(52,211,153,0.15)':'var(--border-subtle)'}`,
              borderRadius:8,
              color:cat===c?'var(--accent-orange)':allWatched?'rgba(52,211,153,0.5)':'var(--text-tertiary)',
              fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:9,
              letterSpacing:'0.02em',textAlign:'center',transition:'all 0.2s',lineHeight:1.3
            }}>
              {allWatched?<span style={{display:'block',fontSize:8,color:'var(--accent-green)'}}>✓</span>:hasWatched?<span style={{display:'block',fontSize:8,color:'rgba(52,211,153,0.4)'}}>◐</span>:null}
              {c}
            </button>
          );
        })}
      </div>

      {/* Video Card */}
      {vid&&(
        <div className="glass-card" style={{padding:18,marginBottom:14,borderLeft:`3px solid ${isWatched?'var(--accent-green)':'var(--accent-orange)'}`}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <span className={`badge ${isWatched?'badge-done':''}`} style={isWatched?{}:{background:'rgba(251,146,60,0.1)',color:'var(--accent-orange)',border:'1px solid rgba(251,146,60,0.2)'}}>
              {isWatched?'✓ WATCHED':'▶ RECOMMENDED'}
            </span>
            <span style={{fontSize:11,color:'rgba(251,191,36,0.4)'}}>+40 XP</span>
          </div>
          <div style={{fontSize:17,fontWeight:800,color:'var(--text-primary)',lineHeight:1.4,marginBottom:8}}>{vid.t}</div>
          <div style={{fontSize:12,color:'var(--accent-orange)',marginBottom:10,fontWeight:600}}>📺 {vid.ch}</div>
          <div style={{fontSize:13,color:'var(--text-tertiary)',lineHeight:1.7,marginBottom:16}}>{vid.d}</div>
          <div style={{display:'flex',gap:8}}>
            <a href={vid.url || `https://www.youtube.com/results?search_query=${encodeURIComponent(vid.t+' '+vid.ch)}`} target="_blank" rel="noopener noreferrer" style={{
              flex:1,display:'block',
              background:'linear-gradient(135deg,#cc0000,#990000)',
              borderRadius:12,padding:'12px',
              color:'#fff',fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13,
              textAlign:'center',textDecoration:'none',letterSpacing:'0.04em',
              cursor:'pointer',border:'none',
              boxShadow:'0 4px 20px rgba(204,0,0,0.25)',
              transition:'all 0.2s'
            }}>
              ▶ WATCH ON YOUTUBE
            </a>
            {!isWatched && (
              <button className="btn" onClick={()=>onWatch(cat,idx)} style={{
                padding:'12px 16px',background:'rgba(52,211,153,0.08)',
                border:'1px solid rgba(52,211,153,0.25)',borderRadius:12,
                color:'var(--accent-green)',fontSize:11,letterSpacing:'0.06em',fontWeight:700
              }}>DONE</button>
            )}
            {vids.length>1&&(
              <button className="btn" onClick={()=>setIdx((idx+1)%vids.length)} style={{
                padding:'12px 16px',background:'var(--bg-card)',
                border:'1px solid var(--border-subtle)',borderRadius:12,
                color:'var(--text-tertiary)',fontSize:11,letterSpacing:'0.06em',fontWeight:700
              }}>NEXT</button>
            )}
          </div>
        </div>
      )}

      {/* Knowledge Progress */}
      <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:14,padding:'14px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
          <div style={{fontSize:9,color:'var(--text-tertiary)',letterSpacing:'0.06em',fontWeight:700,textTransform:'uppercase'}}>KNOWLEDGE PROGRESS</div>
          <div className="number-display" style={{fontSize:11,color:'rgba(251,191,36,0.5)'}}>+{watchedCount*40} XP earned</div>
        </div>
        <div style={{height:5,background:'rgba(255,255,255,0.04)',borderRadius:3,overflow:'hidden',border:'1px solid var(--border-subtle)'}}>
          <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,var(--accent-orange),var(--accent-gold))',borderRadius:3,transition:'width 0.5s'}} />
        </div>
        <div style={{fontSize:10,color:'var(--text-tertiary)',marginTop:6}}>{watchedCount} of {totalVids} videos watched across all categories</div>
      </div>
    </div>
  );
}
