import { lazy, Suspense, useState, useCallback, useEffect, useMemo } from 'react'
import { Info, Bot, Mic, Send, Globe, X } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Login from './components/Login'
import { getAssistantResponse, sanitizeUserInput } from './lib/assistant'
import { trackVenueEvent } from './services/firebase'
import { getScenarioMeta, listScenarios } from './lib/scenarioEngine'
import { buildActionPlan, buildOpsSnapshot, buildScenarioReport } from './lib/opsAdvisor'

const Dashboard = lazy(() => import('./components/Dashboard'))
const VenueMap = lazy(() => import('./components/VenueMap'))
const QueueManager = lazy(() => import('./components/QueueManager'))
const FoodOrder = lazy(() => import('./components/FoodOrder'))
const SmartNav = lazy(() => import('./components/SmartNav'))
const EventTimeline = lazy(() => import('./components/EventTimeline'))
const Notifications = lazy(() => import('./components/Notifications'))
const ImpactLab = lazy(() => import('./components/ImpactLab'))

const pages = {
  impact: ImpactLab,
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
  const [activePage, setActivePage] = useState('impact')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toasts, setToasts] = useState([])
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [activeLang, setActiveLang] = useState('EN')
  const [isResponding, setIsResponding] = useState(false)
  const [simulationMode, setSimulationMode] = useState('normal')
  
  const initialBotMsg = activeLang === 'EN' ? "Hello! I'm your digital concierge. How can I assist your venue experience today?" : "¡Hola! Soy tu conserje digital. ¿Cómo puedo asistir en tu experiencia hoy?"
  
  const [chatMessages, setChatMessages] = useState([{ id: 'bot-welcome', type: 'bot', text: initialBotMsg }])
  const [chatInput, setChatInput] = useState('')
  const scenarioOptions = listScenarios()
  const activeScenario = getScenarioMeta(simulationMode)
  const opsSnapshot = useMemo(() => buildOpsSnapshot(simulationMode), [simulationMode])
  const actionPlan = useMemo(() => buildActionPlan(simulationMode), [simulationMode])

  const downloadScenarioReport = () => {
    const report = buildScenarioReport(simulationMode)
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `venueflow-${simulationMode}-report.json`
    link.click()

    URL.revokeObjectURL(url)
    showToast('Scenario report downloaded.', Info)
    trackVenueEvent('scenario_report_downloaded', {
      scenario: simulationMode,
      score: opsSnapshot.score,
    })
  }

  const handleSendAI = () => {
    if (isResponding) return

    const safeInput = sanitizeUserInput(chatInput)
    if (!safeInput) return

    const userMessageId = `user-${Date.now()}`
    setChatMessages(prev => [...prev, { id: userMessageId, type: 'user', text: safeInput }])
    setChatInput('')
    setIsResponding(true)
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
      setIsResponding(false)
    }, 1200)
  }

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    trackVenueEvent('page_view', { page: activePage })
  }, [isAuthenticated, activePage])

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
      <a href="#main-content" className="skip-link">Skip to main content</a>

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

      <div className={`ai-panel ${aiPanelOpen ? 'open' : ''}`} role="dialog" aria-label="VenueFlow AI assistant" aria-busy={isResponding}>
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
          <button className="mic-button" aria-label="Send message" style={{ background: 'transparent' }} onClick={handleSendAI} disabled={isResponding}>
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
        simulationMode={simulationMode}
      />

      <main className="main-content" id="main-content">
        <div className="card animate-fadeInUp" style={{ marginBottom: 20 }}>
          <div className="card-header" style={{ marginBottom: 12 }}>
            <div>
              <div className="card-title">Scenario Simulation Mode</div>
              <div className="card-subtitle">{activeScenario.description}</div>
            </div>
            <span className="badge badge-amber">{activeScenario.shortLabel}</span>
          </div>
          <div className="pill-tabs" style={{ flexWrap: 'wrap' }}>
            {scenarioOptions.map((scenario) => (
              <button
                key={scenario.id}
                className={`pill-tab ${simulationMode === scenario.id ? 'active' : ''}`}
                onClick={() => {
                  setSimulationMode(scenario.id)
                  showToast(`Scenario switched to ${scenario.label}.`, Info)
                  trackVenueEvent('scenario_mode_changed', { scenario: scenario.id })
                }}
              >
                {scenario.label}
              </button>
            ))}
          </div>

          <div className="ops-brief-grid" style={{ marginTop: 14 }}>
            <div className="ops-brief-card">
              <div className="ops-brief-label">AI Operational Score</div>
              <div className={`ops-score-chip ${opsSnapshot.status.toLowerCase()}`}>
                {opsSnapshot.score}/100 • {opsSnapshot.status}
              </div>
              <div className="ops-brief-meta">Avg wait {opsSnapshot.avgWait} min • High-risk queues {opsSnapshot.highRiskCount}</div>
            </div>

            <div className="ops-brief-card">
              <div className="ops-brief-label">Priority Action Plan</div>
              {actionPlan.slice(0, 2).map((action, index) => (
                <div key={index} className="ops-brief-action">{index + 1}. {action}</div>
              ))}
            </div>

            <div className="ops-brief-card" style={{ justifyContent: 'space-between' }}>
              <div>
                <div className="ops-brief-label">Evidence Export</div>
                <div className="ops-brief-meta">Download scenario report JSON for judging proof.</div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={downloadScenarioReport}>
                Export Report
              </button>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="card">Loading module...</div>}>
          <PageComponent
            setActivePage={setActivePage}
            showToast={showToast}
            simulationMode={simulationMode}
            opsSnapshot={opsSnapshot}
            actionPlan={actionPlan}
          />
        </Suspense>
      </main>
    </div>
  )
}
