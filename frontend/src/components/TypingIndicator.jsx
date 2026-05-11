export default function TypingIndicator() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      gap: '10px', marginBottom: '16px',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '14px', fontWeight: 'bold', color: 'white',
        boxShadow: '0 2px 8px rgba(102,126,234,0.4)'
      }}>
        M
      </div>
      <div style={{
        padding: '14px 18px',
        borderRadius: '18px 18px 18px 4px',
        background: '#1e1e2e',
        border: '1px solid #2a2a3e',
        display: 'flex', gap: '5px', alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#667eea',
            animation: 'bounce 1.4s ease infinite',
            animationDelay: `${i * 0.2}s`,
            boxShadow: '0 0 6px rgba(102,126,234,0.6)'
          }} />
        ))}
      </div>
    </div>
  )
}