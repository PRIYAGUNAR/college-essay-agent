import { useState, useEffect } from 'react'

export default function EssayStrengthMeter({ data, onClose }) {
  const [visible, setVisible] = useState(false)
  const [barsVisible, setBarsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 10)
    setTimeout(() => setBarsVisible(true), 400)
  }, [])

  if (!data) return null

  const {
    overall_score, hook_score, voice_score,
    story_score, reflection_score, originality_score,
    hook_feedback, voice_feedback, story_feedback,
    reflection_feedback, originality_feedback,
    biggest_strength, top_suggestion
  } = data

  const scoreColor = (score) => {
    if (score >= 8) return '#4ade80'
    if (score >= 6) return '#f59e0b'
    return '#ef4444'
  }

  function ScoreRow({ label, score, feedback }) {
    return (
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '6px'
        }}>
          <span style={{ fontSize: '13px', color: '#ccc' }}>{label}</span>
          <span style={{
            fontSize: '13px', fontWeight: '700',
            color: scoreColor(score),
            textShadow: `0 0 8px ${scoreColor(score)}66`
          }}>
            {score}/10
          </span>
        </div>
        <div style={{
          height: '5px', background: '#1a1a2e',
          borderRadius: '3px', overflow: 'hidden', marginBottom: '6px'
        }}>
          <div style={{
            height: '100%',
            width: barsVisible ? `${score * 10}%` : '0%',
            background: `linear-gradient(90deg, ${scoreColor(score)}66, ${scoreColor(score)})`,
            borderRadius: '3px',
            transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 0 6px ${scoreColor(score)}44`
          }} />
        </div>
        <p style={{
          fontSize: '12px', color: '#555',
          margin: 0, lineHeight: '1.5'
        }}>
          {feedback}
        </p>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 6000, padding: '20px',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease'
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #0f0f23, #0d0d1f)',
        border: '1px solid #2a2a3e',
        borderRadius: '24px', width: '100%', maxWidth: '540px',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: '28px'
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '24px'
        }}>
          <div>
            <div style={{
              fontSize: '17px', fontWeight: '700',
              background: 'linear-gradient(135deg, #fff, #f59e0b)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              📊 Essay Strength Meter
            </div>
            <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>
              AI-powered quality analysis
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: '1px solid #2a2a3e',
            color: '#666', cursor: 'pointer',
            width: '34px', height: '34px', borderRadius: '10px',
            fontSize: '14px', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>✕</button>
        </div>

        {/* Overall Score */}
        <div style={{
          background: '#1a1a2e', borderRadius: '16px',
          padding: '24px', marginBottom: '24px', textAlign: 'center',
          border: '1px solid #2a2a3e'
        }}>
          <div style={{
            fontSize: '60px', fontWeight: '900',
            color: scoreColor(overall_score), marginBottom: '4px',
            textShadow: `0 0 24px ${scoreColor(overall_score)}66`,
            lineHeight: 1
          }}>
            {overall_score}
          </div>
          <div style={{ fontSize: '14px', color: '#555', marginBottom: '16px' }}>
            out of 10
          </div>
          <div style={{
            height: '10px', background: '#0a0a1a',
            borderRadius: '5px', overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: barsVisible ? `${overall_score * 10}%` : '0%',
              background: `linear-gradient(90deg, ${scoreColor(overall_score)}66, ${scoreColor(overall_score)})`,
              borderRadius: '5px',
              transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `0 0 16px ${scoreColor(overall_score)}44`
            }} />
          </div>
        </div>

        {/* Score Breakdown */}
        <div style={{ marginBottom: '20px' }}>
          <ScoreRow label="🎣 Opening Hook" score={hook_score} feedback={hook_feedback} />
          <ScoreRow label="🗣️ Student Voice" score={voice_score} feedback={voice_feedback} />
          <ScoreRow label="📖 Story Quality" score={story_score} feedback={story_feedback} />
          <ScoreRow label="💭 Reflection" score={reflection_score} feedback={reflection_feedback} />
          <ScoreRow label="✨ Originality" score={originality_score} feedback={originality_feedback} />
        </div>

        {/* Biggest Strength */}
        <div style={{
          background: 'linear-gradient(135deg, #0d1a0d, #0a160a)',
          border: '1px solid #4ade8033',
          borderRadius: '12px', padding: '14px', marginBottom: '12px'
        }}>
          <div style={{
            fontSize: '11px', color: '#4ade80',
            fontWeight: '600', marginBottom: '6px'
          }}>
            💪 Biggest Strength
          </div>
          <p style={{
            fontSize: '13px', color: '#ccc', lineHeight: '1.6', margin: 0
          }}>
            {biggest_strength}
          </p>
        </div>

        {/* Top Suggestion */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e, #16162a)',
          border: '1px solid #667eea33',
          borderRadius: '12px', padding: '14px', marginBottom: '24px'
        }}>
          <div style={{
            fontSize: '11px', color: '#667eea',
            fontWeight: '600', marginBottom: '6px'
          }}>
            🎯 Top Improvement
          </div>
          <p style={{
            fontSize: '13px', color: '#ccc', lineHeight: '1.6', margin: 0
          }}>
            {top_suggestion}
          </p>
        </div>

        <button onClick={onClose} style={{
          width: '100%', padding: '13px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          border: 'none', color: 'white', cursor: 'pointer',
          fontSize: '14px', fontWeight: '600',
          boxShadow: '0 4px 16px rgba(102,126,234,0.3)'
        }}>
          Got it — Let me improve it! ✍️
        </button>
      </div>
    </div>
  )
}