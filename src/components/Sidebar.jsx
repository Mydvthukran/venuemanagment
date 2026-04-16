import {
  LayoutDashboard, Map, Clock, UtensilsCrossed,
  Navigation, CalendarClock, Bell, Settings,
  Ticket, Shield
} from 'lucide-react'

const navItems = [
  { id: 'main', label: 'MAIN', items: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Venue Map', icon: Map },
    { id: 'queues', label: 'Queue Status', icon: Clock, badge: 3 },
    { id: 'food', label: 'Food & Drinks', icon: UtensilsCrossed },
  ]},
  { id: 'experience', label: 'EXPERIENCE', items: [
    { id: 'navigate', label: 'Smart Navigation', icon: Navigation },
    { id: 'timeline', label: 'Event Timeline', icon: CalendarClock },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 5 },
  ]},
]

export default function Sidebar({ activePage, setActivePage, isOpen, showToast }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">V</div>
        <div className="sidebar-brand">
          <h1>VenueFlow</h1>
          <p>Smart Experience</p>
        </div>
      </div>

      {/* Live Event Card */}
      <div className="sidebar-event-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="live-badge">
            <span className="live-dot"></span>
            LIVE
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>67' min</span>
        </div>
        <div className="event-teams">
          <div className="team">
            <div className="team-flag">🔵</div>
            <span className="team-name">Thunder</span>
          </div>
          <div className="vs-badge">VS</div>
          <div className="team">
            <div className="team-flag">🔴</div>
            <span className="team-name">Phoenix</span>
          </div>
        </div>
        <div className="score-display">2 — 1</div>
        <div className="event-meta">
          <Ticket size={12} />
          <span>Stadium Bowl • Sec 14</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map(section => (
          <div key={section.id}>
            <div className="nav-section-label">{section.label}</div>
            {section.items.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                  onClick={() => setActivePage(item.id)}
                  id={`nav-${item.id}`}
                >
                  <Icon size={18} className="nav-item-icon" />
                  {item.label}
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px 12px',
        borderTop: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--gradient-purple)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.85rem', fontWeight: 700, color: 'white'
        }}>JD</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>John Doe</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Seat A-14, Row 7</div>
        </div>
        <button className="btn-icon" style={{ width: 30, height: 30 }} onClick={() => showToast('Settings panel opened.', Settings)}>
          <Settings size={15} />
        </button>
      </div>
    </aside>
  )
}
