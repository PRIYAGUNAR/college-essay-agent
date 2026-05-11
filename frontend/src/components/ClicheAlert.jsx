import { useEffect, useState } from 'react'

export default function ClicheAlert({ show, data }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setTimeout(() => setVisible(true), 10)
    } else {
      setVisible(false)
    }
  }, [show])

  if (!show || !data) return null

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1200, #1a0f00)',
      borderLeft: '4px solid #f59e0b',
      borderBottom: '1px solid #f59e0b33',
      padding: '12px 20px',
      display: 'flex', flexDirection: 'column', gap: '8px',
      width: '100%',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-8px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '16px' }}>⚠️</span>
        <span style={{
          fontSize: '13px', fontWeight: '600', color: '#f59e0b'
        }}>
          Cliché Detected: {data.cliche_found}
        </span>
      </div>

      {data.why_overused && (
        <p style={{ fontSize: '12px', color: '#888', margin: 0, lineHeight: '1.5' }}>
          {data.why_overused}
        </p>
      )}

      {data.better_angles?.length > 0 && (
        <div>
          <p style={{
            fontSize: '12px', color: '#f59e0b',
            margin: '4px 0 6px', fontWeight: '500'
          }}>
            Try these angles instead:
          </p>
          {data.better_angles.map((angle, i) => (
            <div key={i} style={{
              fontSize: '12px', color: '#ccc',
              padding: '4px 0 4px 12px',
              borderLeft: '2px solid #f59e0b44',
              marginBottom: '4px'
            }}>
              {angle}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}