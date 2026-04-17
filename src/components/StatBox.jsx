export default function StatBox({v,label,color}){
  return(
    <div style={{flex:1,background:'#292524',borderRadius:9,padding:'10px 6px',textAlign:'center',border:`1px solid ${color}22`}}>
      <div style={{fontFamily:"'Quicksand',sans-serif",fontSize:17,fontWeight:900,color}}>{v}</div>
      <div style={{fontSize:10,color:'#a8a29e',marginTop:2,letterSpacing:'0.04em',lineHeight:1.3}}>{label}</div>
    </div>
  );
}
