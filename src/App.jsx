import { useState, useCallback } from 'react'
import { Info } from 'lucide-react'
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
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, icon = Info) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, icon }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />
  }

  const PageComponent = pages[activePage] || Dashboard

  return (
    <div className="app-layout">
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
      />

      <main className="main-content">
        <PageComponent setActivePage={setActivePage} showToast={showToast} />
      </main>
    </div>
  )
}
