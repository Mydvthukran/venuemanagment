import { useState } from 'react'
import {
  Navigation, Clock, Users, Footprints,
  ArrowRight, MapPin, AlertTriangle,
  Car, DoorOpen, UtensilsCrossed, Ticket
} from 'lucide-react'

const destinations = [
  { id: 'seat', label: 'My Seat (A-14)', icon: Ticket },
  { id: 'food', label: 'Nearest Food Court', icon: UtensilsCrossed },
  { id: 'restroom', label: 'Nearest Restroom', icon: DoorOpen },
  { id: 'exit', label: 'Exit / Parking', icon: Car },
]

const routesData = {
  seat: [
    { id: 1, name: 'Via Concourse A (Main)', detail: 'Through Gate A → Concourse A → Section 14', time: '4 min', distance: '280m', crowd: 'Low', crowdColor: 'emerald', recommended: true, steps: 156 },
    { id: 2, name: 'Via Concourse B (Scenic)', detail: 'Through Gate B → Concourse B → Upper Deck → Section 14', time: '6 min', distance: '410m', crowd: 'Medium', crowdColor: 'amber', recommended: false, steps: 220 },
    { id: 3, name: 'Via VIP Elevator', detail: 'Elevator L2 → VIP corridor → Section 14', time: '3 min', distance: '150m', crowd: 'Low', crowdColor: 'emerald', recommended: false, steps: 80 },
  ],
  food: [
    { id: 1, name: 'Pizza Station (Closest)', detail: 'Turn left → 50m → Zone B Food Area', time: '2 min', distance: '80m', crowd: 'Low', crowdColor: 'emerald', recommended: true, steps: 45 },
    { id: 2, name: 'Main Food Court', detail: 'Concourse A → Level 1 Food Hall', time: '5 min', distance: '320m', crowd: 'High', crowdColor: 'rose', recommended: false, steps: 175 },
    { id: 3, name: 'VIP Lounge Bar', detail: 'Elevator → Level 3 → VIP Area', time: '4 min', distance: '200m', crowd: 'Low', crowdColor: 'emerald', recommended: false, steps: 110 },
  ],
  restroom: [
    { id: 1, name: 'Restroom Block D (Closest)', detail: 'Exit Section → 30m right → Block D', time: '1 min', distance: '40m', crowd: 'Low', crowdColor: 'emerald', recommended: true, steps: 22 },
    { id: 2, name: 'Restroom Block A', detail: 'Concourse A → Near Gate A', time: '3 min', distance: '180m', crowd: 'Medium', crowdColor: 'amber', recommended: false, steps: 100 },
  ],
  exit: [
    { id: 1, name: 'Gate D (Least Congested)', detail: 'Concourse D → Gate D → Parking Lot D', time: '7 min', distance: '520m', crowd: 'Low', crowdColor: 'emerald', recommended: true, steps: 290 },
    { id: 2, name: 'Gate A (Nearest)', detail: 'Concourse A → Gate A → Main Parking', time: '5 min', distance: '350m', crowd: 'High', crowdColor: 'rose', recommended: false, steps: 195 },
    { id: 3, name: 'Gate C (South)', detail: 'Concourse C → Gate C → South Parking', time: '8 min', distance: '580m', crowd: 'Medium', crowdColor: 'amber', recommended: false, steps: 320 },
  ],
}

export default function SmartNav() {
  const [destination, setDestination] = useState('seat')

  const routes = routesData[destination] || []

  return (
    <div>
      <div className="page-header animate-fadeInUp">
        <div className="page-header-left">
          <h2>Smart Navigation</h2>
          <p>AI-optimized routes that avoid crowd congestion</p>
        </div>
      </div>

      {/* Current location */}
      <div className="delivery-banner animate-fadeInUp delay-1" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(99,102,241,0.06))' }}>
        <div className="delivery-banner-icon" style={{ background: 'var(--gradient-purple)' }}>
          <MapPin size={22} />
        </div>
        <div className="delivery-banner-text">
          <h3>Your Location: Section 14, Concourse A</h3>
          <p>Location tracked via Bluetooth beacons — updated in real-time</p>
        </div>
      </div>

      {/* Destination selector */}
      <div className="card animate-fadeInUp delay-2" style={{ marginBottom: 24 }}>
        <div className="card-title mb-3">Where do you want to go?</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10 }}>
          {destinations.map(dest => {
            const Icon = dest.icon
            const isActive = destination === dest.id
            return (
              <button
                key={dest.id}
                onClick={() => setDestination(dest.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '14px 16px',
                  background: isActive ? 'rgba(59,130,246,0.12)' : 'var(--bg-surface)',
                  border: `1.5px solid ${isActive ? 'var(--accent-blue)' : 'var(--border-default)'}`,
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={18} />
                {dest.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Routes */}
      <div className="card-title mb-3 animate-fadeInUp delay-3">
        Suggested Routes
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: 8 }}>
          ({routes.length} options)
        </span>
      </div>

      <div className="nav-routes animate-fadeInUp delay-3">
        {routes.map(route => (
          <div
            key={route.id}
            className={`route-card ${route.recommended ? 'recommended' : ''}`}
          >
            <div className="route-icon" style={{
              background: route.recommended ? 'rgba(16,185,129,0.12)' : 'rgba(59,130,246,0.1)',
              color: route.recommended ? 'var(--accent-emerald)' : 'var(--accent-blue)'
            }}>
              <Navigation size={22} />
            </div>
            <div className="route-info">
              <div className="route-name">{route.name}</div>
              <div className="route-detail">{route.detail}</div>
              <div className="route-stats">
                <span className="route-stat">
                  <MapPin size={12} /> {route.distance}
                </span>
                <span className="route-stat">
                  <Footprints size={12} /> {route.steps} steps
                </span>
                <span className="route-stat" style={{
                  color: `var(--accent-${route.crowdColor})`
                }}>
                  <Users size={12} /> {route.crowd} traffic
                </span>
              </div>
            </div>
            <div className="route-eta">
              <div className="route-eta-value">{route.time}</div>
              <div className="route-eta-label">ETA</div>
            </div>
            <button className="btn-icon" style={{ flexShrink: 0 }}>
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Crowd advisory */}
      <div style={{
        marginTop: 24,
        padding: '16px 20px',
        background: 'rgba(245,158,11,0.08)',
        border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: 'var(--radius-md)',
        display: 'flex', alignItems: 'flex-start', gap: 12,
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
      }} className="animate-fadeInUp delay-4">
        <AlertTriangle size={18} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={{ fontWeight: 600, color: 'var(--accent-amber)', marginBottom: 2 }}>Crowd Advisory</div>
          Half-time approaching in 8 minutes. Expect increased foot traffic near restrooms and food courts.
          We recommend using alternate routes via Gate D corridor.
        </div>
      </div>
    </div>
  )
}
