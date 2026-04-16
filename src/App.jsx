import { useState, useCallback } from 'react'
import { Info, Bot, Mic, Send, Globe, X } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import VenueMap from './components/VenueMap'
import QueueManager from './components/QueueManager'
import FoodOrder from './components/FoodOrder'
import SmartNav from './components/SmartNav'
import EventTimeline from './components/EventTimeline'
import Notifications from './components/Notifications'
import Login from './components/Login'

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
  
  const [chatMessages, setChatMessages] = useState([{ type: 'bot', text: initialBotMsg }])
  const [chatInput, setChatInput] = useState('')

  const handleSendAI = () => {
    if (!chatInput.trim()) return
    const rawInput = chatInput
    const userMsg = chatInput.toLowerCase()
    setChatMessages(prev => [...prev, { type: 'user', text: rawInput }])
    setChatInput('')
    
    // Simulate bot thinking
    setTimeout(() => {
      let botResponseEN = "I'm sorry, I'm just a demo AI. Try asking about food, restrooms, or parking."
      let botResponseES = "Lo siento, solo soy una IA de demostración. Intente preguntar sobre comida, baños o estacionamiento."

      if (userMsg.includes('food') || userMsg.includes('hungry') || userMsg.includes('eat')) {
        botResponseEN = "The nearest food court is in Concourse A. You can also order directly to your seat using the Food & Drinks tab!"
        botResponseES = "El patio de comidas más cercano está en el Concourse A. ¡También puedes pedir directamente a tu asiento!"
      } else if (userMsg.includes('restroom') || userMsg.includes('bathroom') || userMsg.includes('toilet')) {
        botResponseEN = "The closest restroom is 40m away in Block D. It currently has a low wait time of 1 minute."
        botResponseES = "El baño más cercano está a 40 metros en el Bloque D. Actualmente tiene un tiempo de espera de 1 minuto."
      } else if (userMsg.includes('exit') || userMsg.includes('leave') || userMsg.includes('parking')) {
        botResponseEN = "For the quickest exit, use Gate D. It's the least congested right now."
        botResponseES = "Para una salida más rápida, usa la Puerta D. Es la menos congestionada en este momento."
      } else if (userMsg.includes('hi') || userMsg.includes('hello')) {
        botResponseEN = "Hello there! How can I improve your event experience today?"
        botResponseES = "¡Hola! ¿Cómo puedo mejorar tu experiencia en el evento hoy?"
      } else if (userMsg.includes('wait') || userMsg.includes('queue')) {
        botResponseEN = "I monitor all wait times. The Merchandise store currently has an 18-minute wait, the longest in the venue."
        botResponseES = "Monitoreo todos los tiempos de espera. La tienda tiene actualmente una espera de 18 minutos."
      }

      setChatMessages(prev => [...prev, { 
        type: 'bot', 
        text: activeLang === 'EN' ? botResponseEN : botResponseES 
      }])
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
      <div 
        className="fab-ai" 
        onClick={() => setAiPanelOpen(!aiPanelOpen)}
        style={{ zIndex: 9901 }}
      >
        <Bot size={24} />
      </div>

      <div className={`ai-panel ${aiPanelOpen ? 'open' : ''}`}>
        <div className="ai-panel-header">
          <div className="title">
            <Bot size={18} color="var(--accent-blue)" />
            VenueFlow Core AI
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="ai-lang-toggle" onClick={() => setActiveLang(activeLang === 'EN' ? 'ES' : 'EN')}>
              <Globe size={10} style={{ display: 'inline', marginRight: 4 }} />
              {activeLang}
            </button>
            <button className="btn-icon" style={{ width: 24, height: 24, background: 'transparent', border: 'none' }} onClick={() => setAiPanelOpen(false)}>
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="ai-chat-area">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`ai-msg ${msg.type}`}>
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
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendAI()}
          />
          <button className={`mic-button ${isListening ? 'listening' : ''}`} onClick={toggleListen}>
            <Mic size={16} />
          </button>
          <button className="mic-button" style={{ background: 'transparent' }} onClick={handleSendAI}>
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Global Toast Notifications */}
      <div className="toast-container">
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
        <PageComponent setActivePage={setActivePage} showToast={showToast} />
      </main>
    </div>
  )
}
