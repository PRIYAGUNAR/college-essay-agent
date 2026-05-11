import { useEffect, useState } from 'react'

const SCHOOLS = [
  { name: 'Stanford', emoji: '🌲', color: '#8B0000' },
  { name: 'MIT', emoji: '⚙️', color: '#A31F34' },
  { name: 'Harvard', emoji: '📚', color: '#A51C30' },
  { name: 'Yale', emoji: '🎭', color: '#00356B' },
  { name: 'Princeton', emoji: '🐯', color: '#FF8F00' },
  { name: 'Columbia', emoji: '🗽', color: '#003DA5' },
]

export default function SchoolSelector({ selected, onSelect, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 10)
  }, [])

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.2s ease'
    }}>
      <div style={{
        background: '#0d0d1f',
        border: '1px solid #2a2a3e',
        borderRadius: '20px',
        padding: '28px', width: '340px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
        transition: 'transform 0.3s ease'
      }}>
        <div style={{
          fontSize: '16px', fontWeight: '600',
          marginBottom: '6px', color: 'white'
        }}>
          🎓 Select Target School
        </div>
        <div style={{
          fontSize: '13px', color: '#666', marginBottom: '20px'
        }}>
          Maya will tailor the essay to this school's culture
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {SCHOOLS.map(school => (
            <button key={school.name}
              onClick={() => { onSelect(school.name); onClose(); }}
              style={{
                padding: '12px 16px', borderRadius: '12px',
                background: selected === school.name
                  ? 'linear-gradient(135deg, #667eea22, #764ba222)'
                  : '#1e1e2e',
                border: selected === school.name
                  ? '1px solid #667eea'
                  : '1px solid #2a2a3e',
                color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '12px',
                fontSize: '14px', textAlign: 'left',
                transition: 'all 0.2s ease',
                boxShadow: selected === school.name
                  ? '0 0 12px rgba(102,126,234,0.2)' : 'none'
              }}>
              <span style={{ fontSize: '22px' }}>{school.emoji}</span>
              <span style={{ flex: 1 }}>{school.name}</span>
              {selected === school.name && (
                <span style={{ color: '#667eea', fontSize: '16px' }}>✓</span>
              )}
            </button>
          ))}
        </div>

        <button onClick={onClose} style={{
          marginTop: '16px', width: '100%',
          padding: '10px', borderRadius: '10px',
          background: 'transparent',
          border: '1px solid #2a2a3e',
          color: '#666', cursor: 'pointer', fontSize: '13px',
          transition: 'all 0.2s'
        }}>
          Cancel
        </button>
      </div>
    </div>
  )
}