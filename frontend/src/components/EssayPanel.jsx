import { useState, useEffect } from 'react'
import axios from 'axios'
import EssayStrengthMeter from './EssayStrengthMeter'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const HARDCODED_PROMPTS = {
  "1": "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.",
  "2": "The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn?",
  "3": "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?",
  "4": "Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?",
  "5": "Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.",
  "6": "Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you?",
  "7": "Share an essay on any topic of your choice — it can be one you have already written or one of your own design.",
}

const REVISION_BUTTONS = [
  { type: 'MORE_PERSONAL', label: '💭 More Personal', color: '#a78bfa' },
  { type: 'STRONGER_HOOK', label: '🎣 Stronger Hook', color: '#667eea' },
  { type: 'TIGHTEN_IT', label: '✂️ Tighten It', color: '#f59e0b' },
  { type: 'MORE_VIVID', label: '🎨 More Vivid', color: '#4ade80' },
  { type: 'BETTER_ENDING', label: '🎯 Better Ending', color: '#ef4444' },
]

export default function EssayPanel({
  story, school, voiceProfile, studentProfile, onClose
}) {
  const [essay, setEssay] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRevising, setIsRevising] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeRevision, setActiveRevision] = useState(null)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState([])
  const [selectedPrompt, setSelectedPrompt] = useState('1')
  const [strengthData, setStrengthData] = useState(null)
  const [showStrength, setShowStrength] = useState(false)
  const [customInstruction, setCustomInstruction] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const [showSentenceRevision, setShowSentenceRevision] = useState(false)
  const [sentenceInstruction, setSentenceInstruction] = useState('')
  const [currentVersion, setCurrentVersion] = useState(0)
  const [isCustomRevising, setIsCustomRevising] = useState(false)
  const [isSentenceRevising, setIsSentenceRevising] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 10)
  }, [])

  const safeVoice = voiceProfile || null
  const safeProfile = studentProfile || {}
  const safeSchool = school || 'Stanford'
  const safeStory = story || ''

  const wordCount = essay
    ? essay.trim().split(/\s+/).filter(Boolean).length
    : 0

  async function generateEssay() {
    setIsGenerating(true)
    try {
      let res
      if (safeVoice) {
        res = await axios.post(`${API_URL}/generate-voice-essay`, {
          profile: safeProfile, story: safeStory,
          school: safeSchool, voice_profile: safeVoice,
          prompt_id: selectedPrompt
        })
      } else {
        res = await axios.post(`${API_URL}/generate-essay`, {
          profile: safeProfile, story: safeStory,
          school: safeSchool, prompt_id: selectedPrompt
        })
      }
      const text = res.data.essay || ''
      setEssay(text)
      setHistory([text])
      setCurrentVersion(0)
    } catch (e) {
      setEssay('Error generating essay. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  async function reviseEssay(revisionType) {
    if (!essay) return
    setIsRevising(true)
    setActiveRevision(revisionType)
    try {
      const res = await axios.post(`${API_URL}/revise-essay`, {
        essay, revision_type: revisionType
      })
      const revised = res.data.essay || ''
      const newHistory = [...history.slice(0, currentVersion + 1), revised]
      setHistory(newHistory)
      setCurrentVersion(newHistory.length - 1)
      setEssay(revised)
    } catch (e) { console.error(e) } finally {
      setIsRevising(false)
      setActiveRevision(null)
    }
  }

  async function applyCustomRevision() {
    if (!essay || !customInstruction.trim()) return
    setIsCustomRevising(true)
    try {
      const res = await axios.post(`${API_URL}/custom-revise-essay`, {
        essay, instruction: customInstruction
      })
      const revised = res.data.essay || ''
      const newHistory = [...history.slice(0, currentVersion + 1), revised]
      setHistory(newHistory)
      setCurrentVersion(newHistory.length - 1)
      setEssay(revised)
      setCustomInstruction('')
      setShowCustom(false)
    } catch (e) { console.error(e) } finally { setIsCustomRevising(false) }
  }

  async function applySentenceRevision() {
    if (!essay || !selectedText || !sentenceInstruction.trim()) return
    setIsSentenceRevising(true)
    try {
      const res = await axios.post(`${API_URL}/revise-sentence`, {
        essay, selected_text: selectedText,
        instruction: sentenceInstruction
      })
      const revisedText = res.data.revised_text || ''
      const newEssay = essay.replace(selectedText, revisedText)
      const newHistory = [...history.slice(0, currentVersion + 1), newEssay]
      setHistory(newHistory)
      setCurrentVersion(newHistory.length - 1)
      setEssay(newEssay)
      setSelectedText('')
      setSentenceInstruction('')
      setShowSentenceRevision(false)
    } catch (e) { console.error(e) } finally { setIsSentenceRevising(false) }
  }

  async function analyzeStrength() {
    if (!essay) return
    setIsAnalyzing(true)
    try {
      const res = await axios.post(`${API_URL}/analyze-essay-strength`, { essay })
      setStrengthData(res.data)
      setShowStrength(true)
    } catch (e) { console.error(e) } finally { setIsAnalyzing(false) }
  }

  function handleTextSelection() {
    const selection = window.getSelection()
    const text = selection?.toString().trim()
    if (text && text.length > 10) {
      setSelectedText(text)
      setShowSentenceRevision(true)
    }
  }

  function switchVersion(index) {
    setCurrentVersion(index)
    setEssay(history[index])
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(essay)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadEssay() {
    const blob = new Blob([essay], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `essay_${safeSchool}_prompt${selectedPrompt}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      {showStrength && (
        <EssayStrengthMeter
          data={strengthData}
          onClose={() => setShowStrength(false)}
        />
      )}

      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 4000, padding: '20px',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}>
        <div style={{
          background: 'linear-gradient(180deg, #0f0f23, #0d0d1f)',
          border: '1px solid #2a2a3e',
          borderRadius: '24px', width: '100%', maxWidth: '760px',
          maxHeight: '92vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>

          {/* Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #1e1e2e',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexShrink: 0
          }}>
            <div>
              <div style={{
                fontSize: '17px', fontWeight: '700',
                background: 'linear-gradient(135deg, #fff, #a78bfa)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                ✍️ Essay Studio
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>
                {safeSchool} · Prompt {selectedPrompt}
                {safeVoice && (
                  <span style={{ color: '#4ade80', marginLeft: '8px' }}>
                    · Voice matched ✓
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {essay && (
                <div style={{
                  fontSize: '12px', padding: '5px 12px', borderRadius: '8px',
                  background: wordCount > 600 ? '#2a1a1a' : '#0d1a0d',
                  border: `1px solid ${wordCount > 600 ? '#ef444466' : '#4ade8066'}`,
                  color: wordCount > 600 ? '#ef4444' : '#4ade80',
                  fontWeight: '600'
                }}>
                  {wordCount}/650
                </div>
              )}
              <button onClick={onClose} style={{
                background: 'transparent', border: '1px solid #2a2a3e',
                color: '#888', cursor: 'pointer',
                padding: '7px 16px', borderRadius: '10px', fontSize: '13px'
              }}>
                ✕ Close
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

            {/* Prompt Selector */}
            {!essay && !isGenerating && (
              <div>
                <div style={{
                  fontSize: '12px', color: '#555',
                  fontWeight: '600', marginBottom: '12px',
                  textTransform: 'uppercase', letterSpacing: '0.5px'
                }}>
                  Select Common App Prompt
                </div>
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  gap: '8px', marginBottom: '24px'
                }}>
                  {Object.entries(HARDCODED_PROMPTS).map(([id, text]) => (
                    <button key={id} onClick={() => setSelectedPrompt(id)}
                      style={{
                        padding: '13px 16px', borderRadius: '12px',
                        background: selectedPrompt === id
                          ? 'linear-gradient(135deg, #667eea11, #764ba211)'
                          : '#1a1a2e',
                        border: `1px solid ${selectedPrompt === id ? '#667eea66' : '#2a2a3e'}`,
                        color: selectedPrompt === id ? '#a78bfa' : '#666',
                        cursor: 'pointer', fontSize: '12px',
                        textAlign: 'left', lineHeight: '1.6',
                        transition: 'all 0.2s ease',
                        boxShadow: selectedPrompt === id
                          ? '0 0 12px rgba(102,126,234,0.15)' : 'none'
                      }}>
                      <span style={{
                        fontWeight: '700', marginRight: '10px',
                        color: selectedPrompt === id ? '#667eea' : '#444',
                        fontSize: '13px'
                      }}>
                        #{id}
                      </span>
                      {text.slice(0, 115)}...
                    </button>
                  ))}
                </div>
                {safeVoice && (
                  <div style={{
                    display: 'flex', gap: '8px',
                    justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px'
                  }}>
                    {[
                      { label: 'Tone', value: safeVoice.tone },
                      { label: 'Style', value: safeVoice.vocabulary },
                      { label: 'Humor', value: safeVoice.humor },
                    ].filter(x => x.value).map(({ label, value }) => (
                      <div key={label} style={{
                        fontSize: '12px', padding: '5px 14px',
                        borderRadius: '20px', background: '#4ade8011',
                        border: '1px solid #4ade8033', color: '#4ade80'
                      }}>
                        {label}: {value}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ textAlign: 'center' }}>
                  <button onClick={generateEssay} style={{
                    padding: '14px 44px', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    border: 'none', color: 'white', cursor: 'pointer',
                    fontSize: '15px', fontWeight: '700',
                    boxShadow: '0 6px 20px rgba(102,126,234,0.35)',
                    letterSpacing: '0.3px'
                  }}>
                    Generate My Essay ✨
                  </button>
                </div>
              </div>
            )}

            {/* Loading */}
            {isGenerating && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{
                  display: 'flex', gap: '8px',
                  justifyContent: 'center', marginBottom: '20px'
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '12px', height: '12px', borderRadius: '50%',
                      background: '#667eea',
                      animation: 'bounce 1.4s ease infinite',
                      animationDelay: `${i * 0.2}s`,
                      boxShadow: '0 0 8px rgba(102,126,234,0.6)'
                    }} />
                  ))}
                </div>
                <p style={{ color: '#555', fontSize: '14px' }}>
                  {safeVoice ? 'Writing in your voice...' : 'Crafting your essay...'}
                </p>
              </div>
            )}

            {/* Essay */}
            {essay && !isGenerating && (
              <div>
                {/* Revision toolbar */}
                <div style={{
                  display: 'flex', gap: '6px',
                  flexWrap: 'wrap', marginBottom: '10px'
                }}>
                  {REVISION_BUTTONS.map(btn => (
                    <button key={btn.type}
                      onClick={() => reviseEssay(btn.type)}
                      disabled={isRevising || isCustomRevising}
                      style={{
                        padding: '6px 12px', borderRadius: '20px',
                        background: activeRevision === btn.type
                          ? `${btn.color}22` : '#1a1a2e',
                        border: `1px solid ${activeRevision === btn.type
                          ? btn.color : '#2a2a3e'}`,
                        color: activeRevision === btn.type ? btn.color : '#666',
                        cursor: 'pointer', fontSize: '12px', fontWeight: '500',
                        transition: 'all 0.2s',
                        boxShadow: activeRevision === btn.type
                          ? `0 0 8px ${btn.color}33` : 'none'
                      }}>
                      {activeRevision === btn.type ? '...' : btn.label}
                    </button>
                  ))}

                  <button onClick={() => setShowCustom(!showCustom)} style={{
                    padding: '6px 12px', borderRadius: '20px',
                    background: showCustom ? '#667eea22' : '#1a1a2e',
                    border: `1px solid ${showCustom ? '#667eea' : '#2a2a3e'}`,
                    color: showCustom ? '#667eea' : '#666',
                    cursor: 'pointer', fontSize: '12px', fontWeight: '500'
                  }}>
                    ✏️ Custom
                  </button>

                  <button onClick={analyzeStrength} disabled={isAnalyzing} style={{
                    padding: '6px 12px', borderRadius: '20px',
                    background: '#1a1a2e', border: '1px solid #f59e0b44',
                    color: isAnalyzing ? '#444' : '#f59e0b',
                    cursor: 'pointer', fontSize: '12px', fontWeight: '500'
                  }}>
                    {isAnalyzing ? '...' : '📊 Score'}
                  </button>
                </div>

                {/* Custom input */}
                {showCustom && (
                  <div style={{
                    background: '#1a1a2e', borderRadius: '12px',
                    padding: '14px', marginBottom: '10px',
                    border: '1px solid #667eea22'
                  }}>
                    <div style={{
                      fontSize: '11px', color: '#667eea',
                      marginBottom: '8px', fontWeight: '600'
                    }}>
                      ✏️ Custom Edit
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input value={customInstruction}
                        onChange={e => setCustomInstruction(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyCustomRevision()}
                        placeholder="e.g. Make the ending more hopeful..."
                        style={{
                          flex: 1, background: '#0d0d1f',
                          border: '1px solid #2a2a3e', borderRadius: '8px',
                          padding: '8px 12px', color: 'white',
                          fontSize: '13px', outline: 'none'
                        }} />
                      <button onClick={applyCustomRevision}
                        disabled={isCustomRevising || !customInstruction.trim()}
                        style={{
                          padding: '8px 16px', borderRadius: '8px',
                          background: customInstruction.trim()
                            ? 'linear-gradient(135deg, #667eea, #764ba2)'
                            : '#2a2a3e',
                          border: 'none', color: 'white', cursor: 'pointer',
                          fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap'
                        }}>
                        {isCustomRevising ? '...' : 'Apply'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Sentence revision */}
                {showSentenceRevision && selectedText && (
                  <div style={{
                    background: '#1a1a2e', borderRadius: '12px',
                    padding: '14px', marginBottom: '10px',
                    border: '1px solid #a78bfa22'
                  }}>
                    <div style={{
                      fontSize: '11px', color: '#a78bfa',
                      marginBottom: '8px', fontWeight: '600'
                    }}>
                      🖊️ Rewrite Selected
                    </div>
                    <div style={{
                      background: '#0d0d1f', borderRadius: '8px',
                      padding: '8px 12px', marginBottom: '8px',
                      fontSize: '12px', color: '#666', fontStyle: 'italic'
                    }}>
                      "{selectedText.slice(0, 80)}{selectedText.length > 80 ? '...' : ''}"
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input value={sentenceInstruction}
                        onChange={e => setSentenceInstruction(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applySentenceRevision()}
                        placeholder="What should change?"
                        style={{
                          flex: 1, background: '#0d0d1f',
                          border: '1px solid #2a2a3e', borderRadius: '8px',
                          padding: '8px 12px', color: 'white',
                          fontSize: '13px', outline: 'none'
                        }} />
                      <button onClick={applySentenceRevision}
                        disabled={isSentenceRevising}
                        style={{
                          padding: '8px 16px', borderRadius: '8px',
                          background: 'linear-gradient(135deg, #a78bfa, #667eea)',
                          border: 'none', color: 'white',
                          cursor: 'pointer', fontSize: '13px'
                        }}>
                        {isSentenceRevising ? '...' : 'Rewrite'}
                      </button>
                      <button onClick={() => {
                        setShowSentenceRevision(false)
                        setSelectedText('')
                      }} style={{
                        padding: '8px 12px', borderRadius: '8px',
                        background: 'transparent', border: '1px solid #2a2a3e',
                        color: '#555', cursor: 'pointer', fontSize: '12px'
                      }}>✕</button>
                    </div>
                  </div>
                )}

                {/* Tip */}
                {!showSentenceRevision && (
                  <div style={{
                    fontSize: '11px', color: '#2a2a3e',
                    marginBottom: '8px', textAlign: 'center'
                  }}>
                    💡 Select any text to revise just that part
                  </div>
                )}

                {/* Version tabs */}
                {history.length > 1 && (
                  <div style={{
                    display: 'flex', gap: '6px',
                    marginBottom: '12px', flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: '11px', color: '#444', marginRight: '4px'
                    }}>
                      Versions:
                    </span>
                    {history.map((_, i) => (
                      <button key={i} onClick={() => switchVersion(i)}
                        style={{
                          padding: '4px 10px', borderRadius: '10px',
                          background: currentVersion === i ? '#667eea22' : 'transparent',
                          border: `1px solid ${currentVersion === i ? '#667eea' : '#2a2a3e'}`,
                          color: currentVersion === i ? '#667eea' : '#444',
                          cursor: 'pointer', fontSize: '11px',
                          transition: 'all 0.2s'
                        }}>
                        {i === 0 ? 'Original' : `v${i + 1}`}
                      </button>
                    ))}
                  </div>
                )}

                {/* Change prompt */}
                <button onClick={() => { setEssay(''); setHistory([]) }}
                  style={{
                    marginBottom: '12px', padding: '6px 12px',
                    borderRadius: '8px', background: 'transparent',
                    border: '1px solid #2a2a3e', color: '#444',
                    cursor: 'pointer', fontSize: '12px'
                  }}>
                  ← Change Prompt
                </button>

                {/* Essay text */}
                <div onMouseUp={handleTextSelection}
                  style={{
                    background: '#1a1a2e', borderRadius: '14px',
                    padding: '24px', fontSize: '14px',
                    lineHeight: '1.9', color: '#ddd',
                    whiteSpace: 'pre-wrap', marginBottom: '16px',
                    cursor: 'text', userSelect: 'text',
                    border: '1px solid #2a2a3e',
                    fontFamily: 'Georgia, serif'
                  }}>
                  {essay}
                </div>

                {/* Export */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={copyToClipboard} style={{
                    flex: 1, padding: '12px', borderRadius: '12px',
                    background: copied ? '#0d1a0d' : '#1a1a2e',
                    border: `1px solid ${copied ? '#4ade8066' : '#2a2a3e'}`,
                    color: copied ? '#4ade80' : '#666',
                    cursor: 'pointer', fontSize: '13px', transition: 'all 0.3s'
                  }}>
                    {copied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                  <button onClick={downloadEssay} style={{
                    flex: 1, padding: '12px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    border: 'none', color: 'white', cursor: 'pointer',
                    fontSize: '13px', fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(102,126,234,0.3)'
                  }}>
                    ⬇️ Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
