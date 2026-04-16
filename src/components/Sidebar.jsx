import { useState } from 'react'
import {
  LayoutDashboard, Map, Clock, UtensilsCrossed,
  Navigation, CalendarClock, Bell, Settings,
  Ticket, Shield, Award, X
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

export default function Sidebar({ activePage, setActivePage, isOpen, showToast, userName }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

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
      <nav className="sidebar-nav" aria-label="Primary navigation">
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
                  aria-current={activePage === item.id ? 'page' : undefined}
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
        }}>{userName?.charAt(0) || 'U'}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{userName || 'User'}</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Seat A-14, Row 7</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontWeight: 600 }}>
            <Award size={10} /> Fan Lvl 4 • 1,250 pts
          </div>
        </div>
        <button className="btn-icon" aria-label="Open user settings" style={{ width: 30, height: 30 }} onClick={() => setIsSettingsOpen(true)}>
          <Settings size={15} />
        </button>
      </div>

      {isSettingsOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', 
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        }}>
          <div className="card" role="dialog" aria-modal="true" aria-label="User settings" style={{ width: '90%', maxWidth: 400, position: 'relative' }}>
            <button className="btn-icon" aria-label="Close settings" style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'transparent' }} onClick={() => setIsSettingsOpen(false)}>
              <X size={18} />
            </button>
            <div className="card-title" style={{ marginBottom: 20 }}>User Settings</div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>Preferences</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-default)' }}>
                <label htmlFor="pref-push">Receive Push Notifications</label>
                <input id="pref-push" type="checkbox" defaultChecked />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-default)' }}>
                <label htmlFor="pref-iot">Data Sharing (IoT Tracking)</label>
                <input id="pref-iot" type="checkbox" defaultChecked />
              </div>
            </div>

            <button className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 16 }} onClick={() => {
              showToast('Settings saved successfully.', Settings)
              setIsSettingsOpen(false)
            }}>
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
