import ReactMarkdown from 'react-markdown'
import { useState, useEffect } from 'react'

export default function ChatMessage({ message, isNew }) {
  const isUser = message.role === 'user'
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '16px',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
    }}>
      {!isUser && (
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginRight: '10px', flexShrink: 0,
          fontSize: '14px', fontWeight: 'bold', color: 'white',
          boxShadow: '0 2px 8px rgba(102,126,234,0.4)'
        }}>
          M
        </div>
      )}

      <div style={{
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser
          ? 'linear-gradient(135deg, #667eea, #764ba2)'
          : '#1e1e2e',
        color: 'white',
        fontSize: '15px',
        lineHeight: '1.6',
        boxShadow: isUser
          ? '0 4px 12px rgba(102,126,234,0.3)'
          : '0 2px 8px rgba(0,0,0,0.3)',
        border: isUser ? 'none' : '1px solid #2a2a3e'
      }}>
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>

      {isUser && (
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: '#2a2a3e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginLeft: '10px', flexShrink: 0,
          fontSize: '14px', color: '#888',
          border: '1px solid #3a3a4e'
        }}>
          G
        </div>
      )}
    </div>
  )
}