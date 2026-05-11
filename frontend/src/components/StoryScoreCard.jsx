import { useState, useEffect } from 'react'

export default function StoryScoreCard({ data, onClose }) {
  const [visible, setVisible] = useState(false)
  const [scoresVisible, setScoresVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 10)
    setTimeout(() => setScoresVisible(true), 400)
  }, [])

  if (!data || !data.has_story) return null

  const {
    uniqueness_score, emotional_depth_score, story_summary,
    why_powerful, dig_question, moment_type
  } = data

  const typeConfig = {
    failure: { color: '#ef4444', bg: '#ef444411', label: 'Failure & Growth' },
    discovery: { color: '#667eea', bg: '#667eea11', label: 'Discovery' },
    habit: { color: '#f59e0b', bg: '#f59e0b11', label: 'Hidden Habit' },
    conversation: { color: '#4ade80', bg: '#4ade8011', label: 'Conversation' },
    realization: { color: '#a78bfa', bg: '#a78bfa11', label: 'Realization' },
    other: { color: '#888', bg: '#88888811', label: 'Unique Moment' },
  }

  const config = typeConfig[moment_type] || typeConfig.other

  function ScoreBar({ label, score, color }) {
    return (
      <div style={{ marginBottom: '14px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginBottom: '6px'
        }}>
          <span style={{ fontSize: '12px', color: '#888' }}>{label}</span>
          <span style={{
            fontSize: '13px', fontWeight: '700', color,
            textShadow: `0 0 8px ${color}66`
          }}>
            {score}/10
          </span>
        </div>
        <div style={{
          height: '7px', background: '#1a1a2e',
          borderRadius: '4px', overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: scoresVisible ? `${score * 10}%` : '0%',
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            borderRadius: '4px',
            transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 0 8px ${color}44`
          }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 3000, padding: '20px',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease'
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #0f0f23, #0d0d1f)',
        border: '1px solid #2a2a3e',
        borderRadius: '24px', padding: '28px',
        width: '100%', maxWidth: '400px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: '20px'
        }}>
          <div>
            <div style={{
              fontSize: '16px', fontWeight: '700',
              color: 'white', marginBottom: '4px'
            }}>
              ⛏️ Story Score Card
            </div>
            <span style={{
              fontSize: '11px', padding: '3px 10px',
              borderRadius: '12px', fontWeight: '600',
              background: config.bg, color: config.color,
              border: `1px solid ${config.color}33`
            }}>
              {config.label}
            </span>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: '1px solid #2a2a3e',
            color: '#666', cursor: 'pointer',
            width: '32px', height: '32px', borderRadius: '8px',
            fontSize: '14px', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>✕</button>
        </div>

        {/* Story Summary */}
        <div style={{
          background: '#1a1a2e', borderRadius: '14px',
          padding: '14px', marginBottom: '20px',
          fontSize: '13px', color: '#ccc', lineHeight: '1.7',
          border: '1px solid #2a2a3e'
        }}>
          {story_summary}
        </div>

        {/* Score Bars */}
        <ScoreBar label="✨ Uniqueness" score={uniqueness_score} color="#667eea" />
        <ScoreBar label="💗 Emotional Depth" score={emotional_depth_score} color="#a78bfa" />

        {/* Why Powerful */}
        <div style={{
          background: 'linear-gradient(135deg, #0d1a0d, #0a160a)',
          border: '1px solid #4ade8033',
          borderRadius: '12px', padding: '14px', marginBottom: '12px'
        }}>
          <div style={{
            fontSize: '11px', color: '#4ade80',
            fontWeight: '600', marginBottom: '6px'
          }}>
            💡 Why This Story Is Powerful
          </div>
          <p style={{
            fontSize: '13px', color: '#ccc',
            lineHeight: '1.6', margin: 0
          }}>
            {why_powerful}
          </p>
        </div>

        {/* Dig Question */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e, #16162a)',
          border: '1px solid #667eea33',
          borderRadius: '12px', padding: '14px', marginBottom: '24px'
        }}>
          <div style={{
            fontSize: '11px', color: '#a78bfa',
            fontWeight: '600', marginBottom: '6px'
          }}>
            ❓ Go Deeper
          </div>
          <p style={{
            fontSize: '13px', color: '#ccc',
            lineHeight: '1.6', margin: 0
          }}>
            {dig_question}
          </p>
        </div>

        <button onClick={onClose} style={{
          width: '100%', padding: '13px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          border: 'none', color: 'white', cursor: 'pointer',
          fontSize: '14px', fontWeight: '600',
          boxShadow: '0 4px 16px rgba(102,126,234,0.3)',
          letterSpacing: '0.3px'
        }}>
          Got it — I will dig deeper! 🚀
        </button>
      </div>
    </div>
  )
}