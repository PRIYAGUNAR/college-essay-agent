export default function StageTracker({ stages, currentStage }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      padding: '10px 20px',
      gap: '4px',
      borderBottom: '1px solid #1e1e2e',
      background: '#0d0d1f',
      flexWrap: 'wrap'
    }}>
      {stages.map((stage, index) => {
        const isActive = stage.id === currentStage
        const isDone = stage.id < currentStage

        return (
          <div key={stage.id} style={{
            display: 'flex', alignItems: 'center', gap: '4px'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 12px', borderRadius: '20px',
              fontSize: '12px',
              fontWeight: isActive ? '600' : '400',
              background: isActive
                ? 'linear-gradient(135deg, #667eea22, #764ba222)'
                : isDone ? '#0d1a0d' : 'transparent',
              border: isActive
                ? '1px solid #667eea'
                : isDone ? '1px solid #4ade8033' : '1px solid transparent',
              color: isActive ? '#a78bfa' : isDone ? '#4ade80' : '#444',
              transition: 'all 0.4s ease',
              boxShadow: isActive ? '0 0 12px rgba(102,126,234,0.2)' : 'none'
            }}>
              <span style={{ fontSize: '13px' }}>
                {isDone ? '✓' : stage.icon}
              </span>
              <span>{stage.name}</span>
            </div>

            {index < stages.length - 1 && (
              <div style={{
                width: '20px', height: '1px',
                background: isDone ? '#4ade8033' : '#1e1e2e',
                transition: 'background 0.4s ease'
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}