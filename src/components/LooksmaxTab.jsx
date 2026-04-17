export default function LooksmaxTab({areas,selected,setSelected,expanded,setExpanded}){
  const area=areas[selected];
  return(
    <div>
      <div style={{fontFamily:"'Quicksand',sans-serif",fontSize:9,color:'#78716c',letterSpacing:'0.05em',marginBottom:10}}>PHYSICAL OPTIMIZATION PROTOCOL</div>

      <div style={{display:'flex',gap:5,overflowX:'auto',marginBottom:14,paddingBottom:2,msOverflowStyle:'none',scrollbarWidth:'none'}}>
        {areas.map((a,i)=>(
          <button key={i} className="btn" onClick={()=>{setSelected(i);setExpanded(null);}} style={{flex:'0 0 auto',padding:'9px 12px',background:selected===i?`${a.color}1a`:'#292524',border:`1px solid ${selected===i?a.color+'44':'#44403c'}`,borderRadius:12,color:selected===i?a.color:'#a8a29e',fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:11,display:'flex',flexDirection:'column',alignItems:'center',gap:3,transition:'all 0.2s',letterSpacing:'0.04em'}}>
            <span style={{fontSize:18}}>{a.icon}</span>
            {a.area.split(' ')[0]}
          </button>
        ))}
      </div>

      <div style={{background:`linear-gradient(135deg,#292524,#36302e)`,border:`1px solid ${area.color}2a`,borderRadius:16,padding:'13px 14px 10px',marginBottom:12}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:26}}>{area.icon}</span>
          <div>
            <div style={{fontFamily:"'Quicksand',sans-serif",fontSize:14,fontWeight:700,color:area.color}}>{area.area}</div>
            <div style={{fontSize:11,color:'#a8a29e',marginTop:2}}>{area.tips.length} protocols — tap each to expand</div>
          </div>
        </div>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:7}}>
        {area.tips.map((tip,i)=>{
          const key=`${selected}_${i}`;
          const isExp=expanded===key;
          return(
            <div key={i} style={{background:'#292524',border:`1px solid ${isExp?area.color+'33':'#44403c'}`,borderRadius:14,overflow:'hidden',cursor:'pointer',transition:'all 0.2s'}} onClick={()=>setExpanded(isExp?null:key)}>
              <div style={{padding:'12px 13px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:26,height:26,borderRadius:'50%',background:`${area.color}1a`,border:`1px solid ${area.color}33`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontFamily:"'Quicksand',sans-serif",color:area.color,fontWeight:700,flexShrink:0}}>{i+1}</div>
                  <span style={{fontWeight:700,fontSize:14,color:isExp?area.color:'#f5f5f4'}}>{tip.t}</span>
                </div>
                <span style={{color:isExp?area.color:'#78716c',fontSize:12,transition:'transform 0.2s',transform:isExp?'rotate(180deg)':'none',marginLeft:8}}>▼</span>
              </div>
              {isExp&&(
                <div style={{padding:'0 13px 14px',borderTop:'1px solid #292524'}}>
                  <div style={{paddingTop:10,fontSize:13,color:'#bbb',lineHeight:1.8}}>{tip.d}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
