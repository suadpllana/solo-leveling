export default function YtTab({data,cats,cat,setCat,idx,setIdx,watched,onWatch}){
  const vids=data[cat]||[];
  const vid=vids[idx];
  const key=`${cat}_${idx}`;
  const isWatched=watched[key];
  const watchedCount=Object.keys(watched).length;

  return(
    <div>
      <div style={{fontFamily:"'Quicksand',sans-serif",fontSize:9,color:'#78716c',letterSpacing:'0.05em',marginBottom:10}}>DAILY KNOWLEDGE PROTOCOL — +40 XP PER VIDEO</div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:4,marginBottom:14}}>
        {cats.map(c=>{
          const hasWatched=Object.keys(watched).some(k=>k.startsWith(c+'_'));
          return(
            <button key={c} className="btn" onClick={()=>setCat(c)} style={{padding:'6px 3px',background:cat===c?'#ff6b001a':'#292524',border:`1px solid ${cat===c?'#ff6b0055':hasWatched?'#00ff8822':'#44403c'}`,borderRadius:6,color:cat===c?'#ff6b00':hasWatched?'#00ff8866':'#a8a29e',fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:9,letterSpacing:'0.04em',textAlign:'center',transition:'all 0.15s',lineHeight:1.3}}>
              {hasWatched&&<span style={{display:'block',fontSize:8}}>✓</span>}
              {c}
            </button>
          );
        })}
      </div>

      {vid&&(
        <div style={{background:'linear-gradient(135deg,#292524,#36302e)',border:`1px solid ${isWatched?'#00ff8833':'#ff6b0033'}`,borderRadius:14,padding:16,marginBottom:10}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <div style={{fontSize:9,background:isWatched?'#00ff881a':'#ff6b001a',color:isWatched?'#00ff88':'#ff6b00',padding:'3px 10px',borderRadius:20,letterSpacing:'0.02em',fontFamily:"'Quicksand',sans-serif"}}>{isWatched?'✓ WATCHED':'▶ RECOMMENDED'}</div>
            <div style={{fontSize:11,color:'#ffd70055'}}>+40 XP</div>
          </div>
          <div style={{fontFamily:"'Nunito',sans-serif",fontSize:16,fontWeight:700,color:'#f5f5f4',lineHeight:1.4,marginBottom:6}}>{vid.t}</div>
          <div style={{fontSize:12,color:'#ff6b00',marginBottom:9,fontWeight:600}}>📺 {vid.ch}</div>
          <div style={{fontSize:13,color:'#777',lineHeight:1.65,marginBottom:14}}>{vid.d}</div>
          <div style={{display:'flex',gap:7}}>
            <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(vid.t+' '+vid.ch)}`} target="_blank" rel="noreferrer" style={{flex:1,display:'block',background:'linear-gradient(135deg,#cc0000,#990000)',border:'none',borderRadius:12,padding:'10px',color:'#fff',fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:13,textAlign:'center',textDecoration:'none',letterSpacing:'0.05em',cursor:'pointer'}}>
              ▶ WATCH ON YOUTUBE
            </a>
            {!isWatched && (
              <button className="btn" onClick={()=>onWatch(cat,idx)} style={{padding:'10px 13px',background:'#00ff881a',border:'1px solid #00ff8833',borderRadius:12,color:'#00ff88',fontSize:11,letterSpacing:'0.05em'}}>
                DONE
              </button>
            )}
            {vids.length>1&&(
              <button className="btn" onClick={()=>setIdx((idx+1)%vids.length)} style={{padding:'10px 13px',background:'#292524',border:'1px solid #44403c',borderRadius:12,color:'#a8a29e',fontSize:11,letterSpacing:'0.05em'}}>
                NEXT
              </button>
            )}
          </div>
        </div>
      )}

      <div style={{background:'#292524',border:'1px solid #44403c',borderRadius:14,padding:12}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
          <div style={{fontFamily:"'Quicksand',sans-serif",fontSize:9,color:'#78716c',letterSpacing:'0.02em'}}>KNOWLEDGE PROGRESS</div>
          <div style={{fontSize:11,color:'#ffd70066'}}>+{watchedCount*40} XP earned</div>
        </div>
        <div style={{height:4,background:'#292524',borderRadius:2,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${Math.min(100,(watchedCount/(cats.length*2))*100)}%`,background:'linear-gradient(90deg,#ff6b00,#ff8800)',borderRadius:2}}/>
        </div>
        <div style={{fontSize:10,color:'#78716c',marginTop:4}}>{watchedCount} video{watchedCount!==1?'s':''} watched across all categories</div>
      </div>
    </div>
  );
}
