import { useState, useRef, useEffect } from 'react'
import ChatMessage from './components/ChatMessage'
import TypingIndicator from './components/TypingIndicator'
import StageTracker from './components/StageTracker'
import ClicheAlert from './components/ClicheAlert'
import SchoolSelector from './components/SchoolSelector'
import StoryScoreCard from './components/StoryScoreCard'
import EssayPanel from './components/EssayPanel'
import SchoolDNA from './components/SchoolDNA'
import useChat from './hooks/useChat'

export default function App() {
  const [input, setInput] = useState('')
  const [selectedSchool, setSelectedSchool] = useState('Stanford')
  const [showSchoolSelector, setShowSchoolSelector] = useState(false)
  const [showEssayPanel, setShowEssayPanel] = useState(false)
  const [essayStory, setEssayStory] = useState('')
  const [celebrateEssay, setCelebrateEssay] = useState(false)
  const [dnaLoading, setDnaLoading] = useState(false)

  const {
    messages, isLoading, sendMessage, resetChat,
    currentStage, stages, clicheAlert, clicheData,
    wordCount, voiceProfile,
    momentData, showMomentCard, setShowMomentCard,
    studentProfile,
    schoolDNAData, showSchoolDNA, setShowSchoolDNA,
    analyzeSchoolDNA, error
  } = useChat()

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const prevStage = useRef(1)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Celebrate when reaching Stage 5 for the first time
  useEffect(() => {
    if (currentStage === 5 && prevStage.current !== 5) {
      setCelebrateEssay(true)
      setTimeout(() => setCelebrateEssay(false), 4000)
    }
    prevStage.current = currentStage
  }, [currentStage])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const text = input.trim()
    setInput('')
    await sendMessage(text)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleOpenEssay = () => {
    const story = messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join(' ')
    setEssayStory(story)
    setShowEssayPanel(true)
  }

  const handleSchoolDNA = async () => {
    if (dnaLoading) return
    setDnaLoading(true)
    const story = messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join(' ')
    await analyzeSchoolDNA(story, selectedSchool)
    setDnaLoading(false)
  }

  const handleReset = () => {
    if (messages.length > 0) {
      if (window.confirm('Start a new session? Your current conversation will be cleared.')) {
        resetChat()
      }
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      background: '#0a0a1a',
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: 'white', overflow: 'hidden'
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a1a; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-7px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.9); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 8px rgba(102,126,234,0.4); } 50% { box-shadow: 0 0 20px rgba(102,126,234,0.8); } }
        @keyframes celebrate { 0% { transform: scale(1); } 25% { transform: scale(1.08) rotate(-3deg); } 50% { transform: scale(1) rotate(0deg); } 75% { transform: scale(1.05) rotate(2deg); } 100% { transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        textarea:focus { outline: none; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a3e; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #3a3a5e; }
        button { transition: all 0.2s ease; }
        button:not(:disabled):hover { opacity: 0.85; transform: translateY(-1px); }
        button:not(:disabled):active { transform: translateY(0); }
      `}</style>

      {/* Modals */}
      {showSchoolSelector && (
        <SchoolSelector
          selected={selectedSchool}
          onSelect={setSelectedSchool}
          onClose={() => setShowSchoolSelector(false)}
        />
      )}
      {showMomentCard && (
        <StoryScoreCard
          data={momentData}
          onClose={() => setShowMomentCard(false)}
        />
      )}
      {showEssayPanel && (
        <EssayPanel
          story={essayStory}
          school={selectedSchool}
          voiceProfile={voiceProfile}
          studentProfile={studentProfile}
          onClose={() => setShowEssayPanel(false)}
        />
      )}
      {showSchoolDNA && (
        <SchoolDNA
          data={schoolDNAData}
          school={selectedSchool}
          onClose={() => setShowSchoolDNA(false)}
        />
      )}

      {/* Header */}
      <div style={{
        padding: '13px 20px',
        borderBottom: '1px solid #1e1e2e',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(180deg, #0f0f23 0%, #0d0d1f 100%)',
        flexWrap: 'wrap', gap: '8px',
        boxShadow: '0 1px 20px rgba(0,0,0,0.4)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(102,126,234,0.4)',
            animation: celebrateEssay ? 'celebrate 0.8s ease' : 'glow 4s ease infinite',
            flexShrink: 0
          }}>M</div>
          <div>
            <div style={{
              fontWeight: '700', fontSize: '16px',
              background: 'linear-gradient(135deg, #fff, #a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              Maya
            </div>
            <div style={{ fontSize: '11px', color: '#555' }}>
              College Essay Counselor
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '8px', flexWrap: 'wrap'
        }}>
          {wordCount > 0 && (
            <div style={{
              padding: '4px 10px', borderRadius: '8px',
              background: wordCount > 600 ? '#2a1a1a' : '#0d1a0d',
              border: `1px solid ${wordCount > 600 ? '#ef444466' : '#4ade8066'}`,
              fontSize: '11px', fontWeight: '600',
              color: wordCount > 600 ? '#ef4444' : '#4ade80'
            }}>
              {wordCount}/650
            </div>
          )}

          {messages.length > 6 && (
            <>
              <button
                onClick={handleSchoolDNA}
                disabled={dnaLoading}
                style={{
                  padding: '6px 12px', borderRadius: '8px',
                  background: '#1e1e2e',
                  border: '1px solid #a78bfa44',
                  color: dnaLoading ? '#555' : '#a78bfa',
                  cursor: dnaLoading ? 'default' : 'pointer',
                  fontSize: '12px', fontWeight: '500',
                  display: 'flex', alignItems: 'center', gap: '5px'
                }}>
                {dnaLoading ? (
                  <span style={{
                    display: 'inline-block', width: '10px', height: '10px',
                    border: '2px solid #a78bfa', borderTopColor: 'transparent',
                    borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                  }} />
                ) : '🧬'}
                {dnaLoading ? 'Analyzing...' : 'DNA'}
              </button>

              <button onClick={handleOpenEssay} style={{
                padding: '6px 14px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none', color: 'white',
                cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                boxShadow: '0 4px 12px rgba(102,126,234,0.3)'
              }}>
                ✍️ Essay
              </button>
            </>
          )}

          <button onClick={() => setShowSchoolSelector(true)} style={{
            padding: '6px 12px', borderRadius: '8px',
            background: '#1e1e2e', border: '1px solid #2a2a3e',
            color: '#aaa', cursor: 'pointer', fontSize: '12px',
            display: 'flex', alignItems: 'center', gap: '5px'
          }}>
            🎓 {selectedSchool}
          </button>

          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#4ade80', boxShadow: '0 0 8px #4ade80',
            animation: 'pulse 2.5s ease infinite'
          }} />

          <button
            onClick={handleReset}
            style={{
              padding: '6px 12px', borderRadius: '8px',
              background: 'transparent', border: '1px solid #1e1e2e',
              color: '#444', cursor: 'pointer', fontSize: '12px'
            }}>
            ↺
          </button>
        </div>
      </div>

      {/* Cliche Alert */}
      <ClicheAlert show={clicheAlert} data={clicheData} />

      {/* Stage Tracker */}
      <StageTracker stages={stages} currentStage={currentStage} />

      {/* Celebration banner */}
      {celebrateEssay && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea22, #764ba222)',
          borderBottom: '1px solid #667eea33',
          padding: '10px 20px', textAlign: 'center',
          fontSize: '13px', color: '#a78bfa', fontWeight: '600',
          animation: 'slideUp 0.4s ease', flexShrink: 0
        }}>
          🎉 Your story is ready! Click <strong style={{ color: '#667eea' }}>✍️ Essay</strong> to generate your college essay now!
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div style={{
          background: '#1a0d0d', borderBottom: '1px solid #ef444433',
          padding: '8px 20px', textAlign: 'center',
          fontSize: '12px', color: '#ef4444', flexShrink: 0
        }}>
          ⚠️ {error} — Please try again
        </div>
      )}

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '20px',
        maxWidth: '800px', width: '100%', margin: '0 auto'
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            animation: 'slideUp 0.6s ease'
          }}>
            <div style={{
              width: '76px', height: '76px', borderRadius: '22px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '34px', fontWeight: 'bold', margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(102,126,234,0.4)',
              animation: 'glow 3s ease infinite'
            }}>M</div>
            <h2 style={{
              fontSize: '26px', marginBottom: '12px', fontWeight: '700',
              background: 'linear-gradient(135deg, #fff, #a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              Hi, I am Maya
            </h2>
            <p style={{
              color: '#666', fontSize: '15px',
              maxWidth: '420px', margin: '0 auto 10px', lineHeight: '1.7'
            }}>
              Your personal college essay counselor. I will help you find
              the story only you can tell.
            </p>
            <p style={{ color: '#333', fontSize: '13px', marginBottom: '28px' }}>
              Applying to{' '}
              <span
                onClick={() => setShowSchoolSelector(true)}
                style={{ color: '#667eea', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {selectedSchool}
              </span>
              {' '}— click to change
            </p>
            <div style={{
              display: 'flex', gap: '10px',
              justifyContent: 'center', flexWrap: 'wrap'
            }}>
              {[
                "Hi Maya, I need help with my essay",
                `Applying to ${selectedSchool}`,
                "I don't know what to write about"
              ].map((prompt, i) => (
                <button key={prompt} onClick={() => sendMessage(prompt)}
                  style={{
                    padding: '10px 16px', borderRadius: '24px',
                    background: '#1a1a2e', border: '1px solid #2a2a3e',
                    color: '#888', cursor: 'pointer', fontSize: '13px',
                    animation: `slideUp 0.5s ease ${i * 0.1 + 0.2}s both`
                  }}>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Profile Banner */}
      {voiceProfile && !voiceProfile.error && (
        <div style={{
          maxWidth: '800px', width: '100%',
          margin: '0 auto', padding: '0 20px 10px',
          animation: 'slideUp 0.4s ease', flexShrink: 0
        }}>
          <div style={{
            background: '#0a140a', border: '1px solid #4ade8022',
            borderRadius: '12px', padding: '10px 16px',
            display: 'flex', alignItems: 'center',
            gap: '12px', flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: '600' }}>
              ✓ Voice Detected
            </span>
            {[
              { label: 'Tone', value: voiceProfile.tone },
              { label: 'Style', value: voiceProfile.vocabulary },
              { label: 'Humor', value: voiceProfile.humor },
            ].filter(x => x.value).map(({ label, value }) => (
              <div key={label} style={{
                display: 'flex', gap: '5px', alignItems: 'center'
              }}>
                <span style={{ fontSize: '11px', color: '#2a3a2a' }}>{label}</span>
                <span style={{
                  fontSize: '11px', color: '#4ade80',
                  background: '#4ade8011', padding: '2px 8px',
                  borderRadius: '10px', textTransform: 'capitalize',
                  border: '1px solid #4ade8022'
                }}>{value}</span>
              </div>
            ))}
            <span style={{ fontSize: '11px', color: '#1a2a1a', marginLeft: 'auto' }}>
              Essay matched to your voice
            </span>
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '12px 20px', borderTop: '1px solid #1a1a2e',
        background: 'linear-gradient(180deg, #0d0d1f 0%, #0a0a1a 100%)',
        maxWidth: '800px', width: '100%', margin: '0 auto',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex', gap: '10px', alignItems: 'flex-end',
          background: '#1a1a2e', borderRadius: '18px', padding: '11px 14px',
          border: `1px solid ${input ? '#667eea44' : '#2a2a3e'}`,
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: input ? '0 0 16px rgba(102,126,234,0.08)' : 'none'
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? 'Maya is thinking...' : 'Tell Maya about yourself...'}
            disabled={isLoading}
            rows={1}
            style={{
              flex: 1, background: 'transparent', border: 'none',
              color: isLoading ? '#555' : 'white',
              fontSize: '15px', resize: 'none', lineHeight: '1.5',
              maxHeight: '120px', fontFamily: 'inherit',
              cursor: isLoading ? 'default' : 'text'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            style={{
              width: '36px', height: '36px', borderRadius: '12px',
              background: input.trim() && !isLoading
                ? 'linear-gradient(135deg, #667eea, #764ba2)'
                : '#2a2a3e',
              border: 'none',
              cursor: input.trim() && !isLoading ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: '15px', color: 'white',
              boxShadow: input.trim() && !isLoading
                ? '0 4px 12px rgba(102,126,234,0.3)' : 'none'
            }}>
            {isLoading ? (
              <span style={{
                display: 'inline-block', width: '12px', height: '12px',
                border: '2px solid #667eea', borderTopColor: 'transparent',
                borderRadius: '50%', animation: 'spin 0.8s linear infinite'
              }} />
            ) : '➤'}
          </button>
        </div>
        <p style={{
          textAlign: 'center', fontSize: '11px',
          color: '#1e1e2e', marginTop: '7px'
        }}>
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}