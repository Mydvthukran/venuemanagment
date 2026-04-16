import { lazy, Suspense, useState, useCallback } from 'react'
import { Info, Bot, Mic, Send, Globe, X } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Login from './components/Login'
import { getAssistantResponse, sanitizeUserInput } from './lib/assistant'
import { trackVenueEvent } from './services/firebase'

const Dashboard = lazy(() => import('./components/Dashboard'))
const VenueMap = lazy(() => import('./components/VenueMap'))
const QueueManager = lazy(() => import('./components/QueueManager'))
const FoodOrder = lazy(() => import('./components/FoodOrder'))
const SmartNav = lazy(() => import('./components/SmartNav'))
const EventTimeline = lazy(() => import('./components/EventTimeline'))
const Notifications = lazy(() => import('./components/Notifications'))

const pages = {
  dashboard: Dashboard,
  map: VenueMap,
  queues: QueueManager,
  food: FoodOrder,
  navigate: SmartNav,
  timeline: EventTimeline,
  notifications: Notifications,
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState('John Doe')
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toasts, setToasts] = useState([])
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [activeLang, setActiveLang] = useState('EN')
  
  const initialBotMsg = activeLang === 'EN' ? "Hello! I'm your digital concierge. How can I assist your venue experience today?" : "¡Hola! Soy tu conserje digital. ¿Cómo puedo asistir en tu experiencia hoy?"
  
  const [chatMessages, setChatMessages] = useState([{ id: 'bot-welcome', type: 'bot', text: initialBotMsg }])
  const [chatInput, setChatInput] = useState('')

  const handleSendAI = () => {
    const safeInput = sanitizeUserInput(chatInput)
    if (!safeInput) return

    const userMessageId = `user-${Date.now()}`
    setChatMessages(prev => [...prev, { id: userMessageId, type: 'user', text: safeInput }])
    setChatInput('')
    trackVenueEvent('assistant_message_sent', { language: activeLang })
    
    // Simulate bot thinking
    setTimeout(() => {
      const assistantReply = getAssistantResponse(safeInput, activeLang)
      trackVenueEvent('assistant_reply_generated', {
        language: activeLang,
        intent: assistantReply.intent,
      })

      setChatMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          type: 'bot',
          text: assistantReply.text,
        },
      ])
    }, 1200)
  }

  const toggleListen = () => {
    setIsListening(true)
    setTimeout(() => {
      setIsListening(false)
      showToast('Voice processing complete', Bot)
    }, 2500)
  }

  const showToast = useCallback((message, icon = Info) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, icon }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  if (!isAuthenticated) {
    return <Login onLogin={(data) => {
      setIsAuthenticated(true)
      if (data?.fullName) setUserName(data.fullName)
    }} />
  }

  const PageComponent = pages[activePage] || Dashboard

  return (
    <div className="app-layout">
      {/* Global AI Assistant */}
      <button
        type="button"
        className="fab-ai" 
        onClick={() => setAiPanelOpen(!aiPanelOpen)}
        aria-label="Toggle AI assistant panel"
        style={{ zIndex: 9901 }}
      >
        <Bot size={24} />
      </button>

      <div className={`ai-panel ${aiPanelOpen ? 'open' : ''}`} role="dialog" aria-label="VenueFlow AI assistant">
        <div className="ai-panel-header">
          <div className="title">
            <Bot size={18} color="var(--accent-blue)" />
            VenueFlow Core AI
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="ai-lang-toggle" aria-label="Switch assistant language" onClick={() => setActiveLang(activeLang === 'EN' ? 'ES' : 'EN')}>
              <Globe size={10} style={{ display: 'inline', marginRight: 4 }} />
              {activeLang}
            </button>
            <button className="btn-icon" aria-label="Close AI panel" style={{ width: 24, height: 24, background: 'transparent', border: 'none' }} onClick={() => setAiPanelOpen(false)}>
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="ai-chat-area" aria-live="polite">
          {chatMessages.map((msg, idx) => (
            <div key={msg.id || idx} className={`ai-msg ${msg.type}`}>
              {msg.text}
            </div>
          ))}
          {isListening && (
            <div className="ai-msg bot" style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'transparent', border: 'none' }}>
              <div className="soundwave-container">
                <div className="soundwave-bar"></div>
                <div className="soundwave-bar"></div>
                <div className="soundwave-bar"></div>
                <div className="soundwave-bar"></div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>Processing Audio...</span>
            </div>
          )}
        </div>
        <div className="ai-input-area">
          <input 
            type="text" 
            className="ai-input" 
            placeholder={activeLang === 'EN' ? "Ask me anything..." : "Pregúntame cualquier cosa..."}
            aria-label="Assistant message input"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendAI()}
          />
          <button className={`mic-button ${isListening ? 'listening' : ''}`} aria-label="Record voice command" onClick={toggleListen}>
            <Mic size={16} />
          </button>
          <button className="mic-button" aria-label="Send message" style={{ background: 'transparent' }} onClick={handleSendAI}>
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Global Toast Notifications */}
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {toasts.map(toast => {
          const Icon = toast.icon
          return (
            <div key={toast.id} className="toast">
              <span className="toast-icon"><Icon size={18} /></span>
              <span className="toast-message">{toast.message}</span>
            </div>
          )
        })}
      </div>

      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile toggle */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <Sidebar
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page)
          setSidebarOpen(false)
        }}
        isOpen={sidebarOpen}
        showToast={showToast}
        userName={userName}
      />

      <main className="main-content">
        <Suspense fallback={<div className="card">Loading module...</div>}>
          <PageComponent setActivePage={setActivePage} showToast={showToast} />
        </Suspense>
      </main>
    </div>
  )
}
