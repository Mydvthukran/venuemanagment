import { useState } from 'react'
import {
  Bell, AlertTriangle, MapPin, UtensilsCrossed,
  Clock, Users, Shield, CheckCircle, Megaphone,
} from 'lucide-react'
import { trackVenueEvent } from '../services/firebase'

const notifications = [
  {
    id: 1,
    type: 'alert',
    title: 'Gate B Congestion Cleared',
    message: 'Traffic flow at Gate B has returned to normal levels. All entry lanes open.',
    time: '2 min ago',
    unread: true,
    icon: Users,
    iconBg: 'rgba(16,185,129,0.12)',
    iconColor: 'var(--accent-emerald)',
  },
  {
    id: 2,
    type: 'food',
    title: 'Order Ready for Pickup',
    message: 'Your order #4782 (Classic Smash Burger + Craft IPA) is ready at Food Station B. Runner en route to your seat.',
    time: '5 min ago',
    unread: true,
    icon: UtensilsCrossed,
    iconBg: 'rgba(245,158,11,0.12)',
    iconColor: 'var(--accent-amber)',
  },
  {
    id: 3,
    type: 'event',
    title: 'GOAL! Thunder Take the Lead',
    message: 'Chen Wei scores with a powerful header! Thunder 2 — 1 Phoenix (57\').',
    time: '10 min ago',
    unread: true,
    icon: Megaphone,
    iconBg: 'rgba(59,130,246,0.12)',
    iconColor: 'var(--accent-blue)',
  },
  {
    id: 4,
    type: 'warning',
    title: 'South Stand Nearing Capacity',
    message: 'Section C is at 91% capacity. Consider using alternate restrooms in Zone D.',
    time: '14 min ago',
    unread: true,
    icon: AlertTriangle,
    iconBg: 'rgba(244,63,94,0.12)',
    iconColor: 'var(--accent-rose)',
  },
  {
    id: 5,
    type: 'info',
    title: 'Half-Time Break Approaching',
    message: 'Half-time in 8 minutes. Pre-order food now to skip the queue rush.',
    time: '18 min ago',
    unread: true,
    icon: Clock,
    iconBg: 'rgba(139,92,246,0.12)',
    iconColor: 'var(--accent-purple)',
  },
  {
    id: 6,
    type: 'security',
    title: 'Security Check Complete',
    message: 'All sections have passed routine security sweep. No issues detected.',
    time: '25 min ago',
    unread: false,
    icon: Shield,
    iconBg: 'rgba(16,185,129,0.12)',
    iconColor: 'var(--accent-emerald)',
  },
  {
    id: 7,
    type: 'event',
    title: 'GOAL! Phoenix Equalize',
    message: 'Marcus Sterling with a close-range finish! Thunder 1 — 1 Phoenix (38\').',
    time: '28 min ago',
    unread: false,
    icon: Megaphone,
    iconBg: 'rgba(59,130,246,0.12)',
    iconColor: 'var(--accent-blue)',
  },
  {
    id: 8,
    type: 'navigation',
    title: 'Parking Lot D — Best Exit Option',
    message: 'Based on your seat location, Parking Lot D via Gate D offers the fastest exit after the match.',
    time: '35 min ago',
    unread: false,
    icon: MapPin,
    iconBg: 'rgba(6,182,212,0.12)',
    iconColor: 'var(--accent-cyan)',
  },
  {
    id: 9,
    type: 'event',
    title: 'GOAL! Thunder Strike First',
    message: 'James Rodriguez with a brilliant free kick! Thunder 1 — 0 Phoenix (22\').',
    time: '44 min ago',
    unread: false,
    icon: Megaphone,
    iconBg: 'rgba(59,130,246,0.12)',
    iconColor: 'var(--accent-blue)',
  },
  {
    id: 10,
    type: 'info',
    title: 'Welcome to the Stadium!',
    message: 'You\'re checked in at Seat A-14, Row 7, Section 14. Enjoy the Championship Final!',
    time: '1h ago',
    unread: false,
    icon: CheckCircle,
    iconBg: 'rgba(16,185,129,0.12)',
    iconColor: 'var(--accent-emerald)',
  },
]

const filterOptions = ['All', 'Events', 'Alerts', 'Orders', 'Navigation']

export default function Notifications() {
  const [filter, setFilter] = useState('All')
  const [items, setItems] = useState(notifications)

  const filtered = items.filter(n => {
    if (filter === 'Events') return n.type === 'event'
    if (filter === 'Alerts') return n.type === 'alert' || n.type === 'warning' || n.type === 'security'
    if (filter === 'Orders') return n.type === 'food'
    if (filter === 'Navigation') return n.type === 'navigation' || n.type === 'info'
    return true
  })

  const unreadCount = items.filter(n => n.unread).length

  const markAllRead = () => {
    setItems(prev => prev.map(n => ({ ...n, unread: false })))
    trackVenueEvent('notifications_marked_read', { unreadCount })
  }

  return (
    <div>
      <div className="page-header animate-fadeInUp">
        <div className="page-header-left">
          <h2>Notifications</h2>
          <p>Stay updated with live events, alerts, and order status</p>
        </div>
        <div className="header-actions">
          {unreadCount > 0 && (
            <button className="btn btn-secondary btn-sm" onClick={markAllRead}>
              <CheckCircle size={14} />
              Mark all read
            </button>
          )}
          <span className="badge badge-rose" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
            {unreadCount} unread
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="pill-tabs mb-4 animate-fadeInUp delay-1">
        {filterOptions.map(opt => (
          <button
            key={opt}
            className={`pill-tab ${filter === opt ? 'active' : ''}`}
            onClick={() => setFilter(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="notification-list animate-fadeInUp delay-2">
        {filtered.map(n => {
          const Icon = n.icon
          return (
            <div
              key={n.id}
              className={`notification-item ${n.unread ? 'unread' : ''}`}
            >
              <div
                className="notification-icon-wrapper"
                style={{ background: n.iconBg, color: n.iconColor }}
              >
                <Icon size={17} />
              </div>
              <div className="notification-body">
                <div className="notification-title">{n.title}</div>
                <div className="notification-message">{n.message}</div>
                <div className="notification-time">
                  <Clock size={10} style={{ verticalAlign: '-1px', marginRight: 3 }} />
                  {n.time}
                </div>
              </div>
              {n.unread && (
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--accent-blue)',
                  flexShrink: 0, marginTop: 4
                }} />
              )}
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: 48,
            color: 'var(--text-muted)', fontSize: '0.9rem'
          }}>
            <Bell size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
            <div>No notifications in this category</div>
          </div>
        )}
      </div>
    </div>
  )
}
