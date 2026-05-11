import { useState, useCallback, useRef } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const STAGES = [
  { id: 1, name: 'Welcome', icon: '👋' },
  { id: 2, name: 'Intake', icon: '📋' },
  { id: 3, name: 'Dig Deep', icon: '⛏️' },
  { id: 4, name: 'Story Lock', icon: '🔒' },
  { id: 5, name: 'Essay', icon: '✍️' },
]

function detectStage(messages) {
  const count = messages.filter(m => m.role === 'assistant').length
  if (count === 0) return 1
  if (count <= 2) return 2
  if (count <= 5) return 3
  if (count <= 7) return 4
  return 5
}

export default function useChat() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [studentProfile, setStudentProfile] = useState({})
  const [currentStage, setCurrentStage] = useState(1)
  const [clicheAlert, setClicheAlert] = useState(false)
  const [clicheData, setClicheData] = useState(null)
  const [wordCount, setWordCount] = useState(0)
  const [voiceProfile, setVoiceProfile] = useState(null)
  const [momentData, setMomentData] = useState(null)
  const [showMomentCard, setShowMomentCard] = useState(false)
  const [soWhatData, setSoWhatData] = useState(null)
  const [schoolDNAData, setSchoolDNAData] = useState(null)
  const [showSchoolDNA, setShowSchoolDNA] = useState(false)
  const [error, setError] = useState(null)

  // Use ref to prevent duplicate voice analysis
  const voiceAnalyzed = useRef(false)
  // Track cliche alert timeout
  const clicheTimeout = useRef(null)

  const sendMessage = useCallback(async (content) => {
    if (!content || !content.trim()) return

    const userMessage = { role: 'user', content: content.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setIsLoading(true)
    setError(null)

    // Smart cliche check — only for messages longer than 15 chars
    if (content.trim().length > 15) {
      axios.post(`${API_URL}/analyze-cliche`, { text: content })
        .then(res => {
          if (res.data.has_cliche) {
            setClicheData(res.data)
            setClicheAlert(true)
            if (clicheTimeout.current) clearTimeout(clicheTimeout.current)
            clicheTimeout.current = setTimeout(() => setClicheAlert(false), 8000)
          }
        })
        .catch(() => {})
    }

    // Voice analysis — only once after 3 user messages
    const userMsgCount = updatedMessages.filter(m => m.role === 'user').length
    if (userMsgCount === 3 && !voiceAnalyzed.current) {
      voiceAnalyzed.current = true
      axios.post(`${API_URL}/analyze-voice`, { messages: updatedMessages })
        .then(res => {
          if (res.data && !res.data.error) setVoiceProfile(res.data)
        })
        .catch(() => {})
    }

    // Small moment detection — only after stage 3, for longer messages
    const assistantCount = messages.filter(m => m.role === 'assistant').length
    if (assistantCount >= 3 && content.trim().length > 20) {
      axios.post(`${API_URL}/analyze-moment`, { text: content })
        .then(res => {
          if (res.data.has_story && res.data.uniqueness_score >= 6) {
            setMomentData(res.data)
            setShowMomentCard(true)
          }
        })
        .catch(() => {})

      axios.post(`${API_URL}/analyze-so-what`, { text: content })
        .then(res => { if (res.data && !res.data.error) setSoWhatData(res.data) })
        .catch(() => {})
    }

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        messages: updatedMessages,
        student_profile: studentProfile
      })

      if (!response.data || !response.data.reply) {
        throw new Error('Empty reply from server')
      }

      const assistantMessage = {
        role: 'assistant',
        content: response.data.reply
      }

      const newMessages = [...updatedMessages, assistantMessage]
      setMessages(newMessages)
      setCurrentStage(detectStage(newMessages))

      const replyText = response.data.reply
      if (replyText && replyText.length > 500) {
        setWordCount(replyText.trim().split(/\s+/).length)
      }

    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Something went wrong. Please try again.'
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry — ${errorMsg}`
      }])
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [messages, studentProfile])

  const analyzeSchoolDNA = useCallback(async (story, school) => {
    if (!story || !school) return
    try {
      const res = await axios.post(`${API_URL}/analyze-school-dna`, {
        story, school
      })
      if (res.data && !res.data.error) {
        setSchoolDNAData(res.data)
        setShowSchoolDNA(true)
      }
    } catch (e) {
      console.error('School DNA error:', e)
    }
  }, [])

  const resetChat = useCallback(() => {
    setMessages([])
    setStudentProfile({})
    setCurrentStage(1)
    setClicheAlert(false)
    setClicheData(null)
    setWordCount(0)
    setVoiceProfile(null)
    setMomentData(null)
    setShowMomentCard(false)
    setSoWhatData(null)
    setSchoolDNAData(null)
    setShowSchoolDNA(false)
    setError(null)
    voiceAnalyzed.current = false
    if (clicheTimeout.current) clearTimeout(clicheTimeout.current)
  }, [])

  return {
    messages, isLoading, sendMessage, resetChat,
    studentProfile, setStudentProfile,
    currentStage, stages: STAGES,
    clicheAlert, clicheData,
    wordCount, voiceProfile,
    momentData, showMomentCard, setShowMomentCard,
    soWhatData,
    schoolDNAData, showSchoolDNA, setShowSchoolDNA,
    analyzeSchoolDNA,
    error
  }
}
