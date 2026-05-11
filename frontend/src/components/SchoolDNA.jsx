import { useState, useEffect } from 'react'

export default function SchoolDNA({ data, school, onClose }) {
  const [visible, setVisible] = useState(false)
  const [scoreVisible, setScoreVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 10)
    setTimeout(() => setScoreVisible(true), 500)
  }, [])

  if (!data) return null

  const {
    fit_score, why_it_fits, school_angle,
    keywords_to_include, what_to_emphasize,
    what_to_downplay, opening_suggestion
  } = data

  const schoolConfig = {
    MIT: { emoji: '⚙️', color: '#A31F34' },
    Harvard: { emoji: '📚', color: '#A51C30' },
    Stanford: { emoji: '🌲', color: '#8C1515' },
    Yale: { emoji: '🎭', color: '#00356B' },
    Princeton: { emoji: '🐯', color: '#E77500' },
    Columbia: { emoji: '🗽', color: '#003DA5' },
  }

  const sc = schoolConfig[school] || { emoji: '🎓', color: '#667eea' }

  const scoreColor = fit_score >= 8
    ? '#4ade80' : fit_score >= 6
    ? '#f59e0b' : '#ef4444'

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 5000, padding: '20px',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease'
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #0f0f23, #0d0d1f)',
        border: '1px solid #2a2a3e',
        borderRadius: '24px', width: '100%', maxWidth: '580px',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: '28px'
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '16px',
              background: `${sc.color}22`,
              border: `1px solid ${sc.color}44`,
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '26px'
            }}>
              {sc.emoji}
            </div>
            <div>
              <div style={{
                fontSize: '17px', fontWeight: '700',
                background: 'linear-gradient(135deg, #fff, #a78bfa)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                {school} DNA Match
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>
                How well your story fits this school
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: '1px solid #2a2a3e',
            color: '#666', cursor: 'pointer',
            width: '34px', height: '34px', borderRadius: '10px',
            fontSize: '14px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>✕</button>
        </div>

        {/* Fit Score */}
        <div style={{
          background: '#1a1a2e', borderRadius: '16px',
          padding: '20px', marginBottom: '20px', textAlign: 'center',
          border: '1px solid #2a2a3e'
        }}>
          <div style={{
            fontSize: '52px', fontWeight: '800',
            color: scoreColor, marginBottom: '4px',
            textShadow: `0 0 20px ${scoreColor}66`
          }}>
            {fit_score}/10
          </div>
          <div style={{ fontSize: '12px', color: '#555', marginBottom: '12px' }}>
            Story Fit Score
          </div>
          <div style={{
            height: '8px', background: '#0a0a1a',
            borderRadius: '4px', overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: scoreVisible ? `${fit_score * 10}%` : '0%',
              background: `linear-gradient(90deg, ${scoreColor}66, ${scoreColor})`,
              borderRadius: '4px',
              transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `0 0 12px ${scoreColor}44`
            }} />
          </div>
        </div>

        {/* Sections */}
        {[
          { title: '✅ Why Your Story Fits', content: why_it_fits, color: '#4ade80', bg: '#0d1a0d', border: '#4ade8033' },
          { title: '🎯 Angle to Emphasize', content: school_angle, color: '#667eea', bg: '#1a1a2e', border: '#667eea33' },
          { title: '⬆️ Emphasize This', content: what_to_emphasize, color: '#f59e0b', bg: '#1a1200', border: '#f59e0b33' },
          ...(what_to_downplay ? [{ title: '⬇️ Downplay This', content: what_to_downplay, color: '#ef4444', bg: '#1a0d0d', border: '#ef444433' }] : []),
        ].map(({ title, content, color, bg, border: bd }) => (
          <div key={title} style={{
            background: bg, border: `1px solid ${bd}`,
            borderRadius: '12px', padding: '14px', marginBottom: '12px'
          }}>
            <div style={{
              fontSize: '11px', color, fontWeight: '600', marginBottom: '8px'
            }}>
              {title}
            </div>
            <p style={{
              fontSize: '13px', color: '#ccc', lineHeight: '1.6', margin: 0
            }}>
              {content}
            </p>
          </div>
        ))}

        {/* Keywords */}
        {keywords_to_include?.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{
              fontSize: '11px', color: '#a78bfa',
              fontWeight: '600', marginBottom: '10px'
            }}>
              🔑 Keywords to Weave In
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {keywords_to_include.map((kw, i) => (
                <span key={i} style={{
                  padding: '5px 14px', borderRadius: '20px',
                  background: '#a78bfa11',
                  border: '1px solid #a78bfa33',
                  color: '#a78bfa', fontSize: '12px', fontWeight: '500'
                }}>
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Opening Suggestion */}
        {opening_suggestion && (
          <div style={{
            background: '#1e1e2e', border: '1px solid #2a2a3e',
            borderRadius: '12px', padding: '16px', marginBottom: '24px'
          }}>
            <div style={{
              fontSize: '11px', color: '#888',
              fontWeight: '600', marginBottom: '8px'
            }}>
              ✨ Suggested Opening Line
            </div>
            <p style={{
              fontSize: '14px', color: '#ddd',
              lineHeight: '1.7', margin: 0, fontStyle: 'italic'
            }}>
              "{opening_suggestion}"
            </p>
          </div>
        )}

        <button onClick={onClose} style={{
          width: '100%', padding: '13px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          border: 'none', color: 'white', cursor: 'pointer',
          fontSize: '14px', fontWeight: '600',
          boxShadow: '0 4px 16px rgba(102,126,234,0.3)'
        }}>
          Got it — Let us write this essay! 🚀
        </button>
      </div>
    </div>
  )
}