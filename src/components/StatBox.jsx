export default function StatBox({v, label, color, icon}) {
  return (
    <div style={{
      flex: 1,
      background: 'var(--bg-card)',
      borderRadius: 14,
      padding: '14px 8px',
      textAlign: 'center',
      border: `1px solid ${color}15`,
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${color}44, transparent)`,
      }} />
      {icon && <div style={{fontSize: 16, marginBottom: 4}}>{icon}</div>}
      <div className="number-display" style={{
        fontSize: 22,
        fontWeight: 900,
        color,
        letterSpacing: '-0.02em',
      }}>{v}</div>
      <div style={{
        fontSize: 9,
        color: 'var(--text-tertiary)',
        marginTop: 4,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontWeight: 600,
        lineHeight: 1.3,
      }}>{label}</div>
    </div>
  );
}
