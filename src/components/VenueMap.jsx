import { useState } from 'react'
import { X, Users, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react'

const zones = [
  { id: 'north', label: 'North Stand', d: 'M200,60 Q350,20 500,60 L480,130 Q350,100 220,130 Z', density: 82, color: '#ef4444', people: 8200, wait: '12 min', temp: '24°C', gates: 'A1-A4' },
  { id: 'east', label: 'East Wing', d: 'M500,60 Q540,60 560,100 L560,300 Q540,340 500,340 L480,280 L480,130 Z', density: 55, color: '#f59e0b', people: 5500, wait: '6 min', temp: '22°C', gates: 'B1-B3' },
  { id: 'south', label: 'South Stand', d: 'M200,340 Q350,380 500,340 L480,280 Q350,300 220,280 Z', density: 91, color: '#ef4444', people: 9100, wait: '18 min', temp: '25°C', gates: 'C1-C4' },
  { id: 'west', label: 'West Wing', d: 'M200,60 Q160,60 140,100 L140,300 Q160,340 200,340 L220,280 L220,130 Z', density: 38, color: '#10b981', people: 3800, wait: '3 min', temp: '21°C', gates: 'D1-D3' },
  { id: 'nw-vip', label: 'VIP North', d: 'M220,130 Q280,115 340,120 L335,170 Q280,160 230,170 Z', density: 72, color: '#f59e0b', people: 720, wait: '2 min', temp: '22°C', gates: 'VIP-1' },
  { id: 'ne-vip', label: 'VIP East', d: 'M360,120 Q420,115 480,130 L470,170 Q420,160 365,170 Z', density: 65, color: '#f59e0b', people: 650, wait: '4 min', temp: '22°C', gates: 'VIP-2' },
  { id: 'sw-vip', label: 'VIP South', d: 'M230,230 Q280,240 335,230 L340,280 Q280,290 220,280 Z', density: 58, color: '#10b981', people: 580, wait: '3 min', temp: '23°C', gates: 'VIP-3' },
  { id: 'se-vip', label: 'VIP East S', d: 'M365,230 Q420,240 470,230 L480,280 Q420,290 360,280 Z', density: 44, color: '#10b981', people: 440, wait: '2 min', temp: '23°C', gates: 'VIP-4' },
]

function getZoneColor(density) {
  if (density >= 80) return 'rgba(239, 68, 68, 0.55)'
  if (density >= 60) return 'rgba(245, 158, 11, 0.45)'
  return 'rgba(16, 185, 129, 0.35)'
}

function getZoneStroke(density) {
  if (density >= 80) return 'rgba(239, 68, 68, 0.7)'
  if (density >= 60) return 'rgba(245, 158, 11, 0.6)'
  return 'rgba(16, 185, 129, 0.5)'
}

function getTextPos(id) {
  const positions = {
    'north': [350, 85],
    'east': [530, 200],
    'south': [350, 320],
    'west': [170, 200],
    'nw-vip': [280, 147],
    'ne-vip': [420, 147],
    'sw-vip': [280, 258],
    'se-vip': [420, 258],
  }
  return positions[id] || [350, 200]
}

export default function VenueMap({ setActivePage }) {
  const [selectedZone, setSelectedZone] = useState(null)

  const selected = zones.find(z => z.id === selectedZone)

  return (
    <div>
      <div className="page-header animate-fadeInUp">
        <div className="page-header-left">
          <h2>Venue Map</h2>
          <p>Live crowd density and zone monitoring</p>
        </div>
        <div className="header-actions">
          <span className="live-badge">
            <span className="live-dot"></span>
            LIVE
          </span>
        </div>
      </div>

      <div className="venue-map-container animate-fadeInUp delay-1" style={{ position: 'relative' }}>
        <svg viewBox="100 0 500 400" className="venue-map-svg">
          {/* Field / pitch */}
          <rect x="245" y="155" width="210" height="90" rx="8" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.25)" strokeWidth="1.5" />
          <line x1="350" y1="155" x2="350" y2="245" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
          <circle cx="350" cy="200" r="25" fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
          <text x="350" y="203" textAnchor="middle" fontSize="10" fill="rgba(16,185,129,0.5)" fontWeight="600">PITCH</text>

          {/* Zones */}
          {zones.map(zone => {
            const [tx, ty] = getTextPos(zone.id)
            return (
              <g key={zone.id} className="zone" onClick={() => setSelectedZone(zone.id === selectedZone ? null : zone.id)}>
                <path
                  d={zone.d}
                  fill={getZoneColor(zone.density)}
                  stroke={zone.id === selectedZone ? 'rgba(59,130,246,0.9)' : getZoneStroke(zone.density)}
                  strokeWidth={zone.id === selectedZone ? 2.5 : 1.5}
                  style={{ transition: 'all 0.3s' }}
                />
                <text x={tx} y={ty - 6} className="zone-label" fontSize="10">{zone.label}</text>
                <text x={tx} y={ty + 8} className="zone-label" fontSize="9" opacity="0.7">{zone.density}%</text>
              </g>
            )
          })}

          {/* Gate indicators */}
          {[
            [350, 42, 'Gate A'], [572, 200, 'Gate B'],
            [350, 358, 'Gate C'], [128, 200, 'Gate D']
          ].map(([x, y, label], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="14" fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.4)" strokeWidth="1" />
              <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central" fontSize="6" fill="#94a3b8" fontWeight="600">{label}</text>
            </g>
          ))}
        </svg>

        {/* Zone Detail Panel */}
        {selected && (
          <div className="zone-detail-panel animate-fadeIn">
            <div className="zone-detail-header">
              <div className="zone-detail-title">{selected.label}</div>
              <button className="zone-close-btn" onClick={() => setSelectedZone(null)}>
                <X size={14} />
              </button>
            </div>
            <div className="zone-stat-row">
              <span className="zone-stat-key"><Users size={13} style={{ marginRight: 6, verticalAlign: '-2px' }} />Occupancy</span>
              <span className="zone-stat-val" style={{ color: selected.density >= 80 ? 'var(--accent-rose)' : selected.density >= 60 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
                {selected.density}%
              </span>
            </div>
            <div className="zone-stat-row">
              <span className="zone-stat-key">People Count</span>
              <span className="zone-stat-val">{selected.people.toLocaleString()}</span>
            </div>
            <div className="zone-stat-row">
              <span className="zone-stat-key"><Clock size={13} style={{ marginRight: 6, verticalAlign: '-2px' }} />Avg. Wait</span>
              <span className="zone-stat-val">{selected.wait}</span>
            </div>
            <div className="zone-stat-row">
              <span className="zone-stat-key">Temperature</span>
              <span className="zone-stat-val">{selected.temp}</span>
            </div>
            <div className="zone-stat-row">
              <span className="zone-stat-key">Entry Gates</span>
              <span className="zone-stat-val">{selected.gates}</span>
            </div>
            {selected.density >= 80 && (
              <div style={{
                marginTop: 12, padding: '8px 12px',
                background: 'rgba(244,63,94,0.1)',
                border: '1px solid rgba(244,63,94,0.2)',
                borderRadius: 8, fontSize: '0.72rem',
                color: 'var(--accent-rose)',
                display: 'flex', alignItems: 'center', gap: 6
              }}>
                <AlertTriangle size={13} />
                High congestion detected — alternate routes suggested
              </div>
            )}
            <button className="btn btn-primary btn-sm w-full" style={{ marginTop: 14, justifyContent: 'center' }} onClick={() => setActivePage('navigate')}>
              <Navigation size={14} />
              Navigate Here
              <ArrowUpRight size={13} />
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: 'rgba(16,185,129,0.5)' }} />
            Low (0-59%)
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: 'rgba(245,158,11,0.6)' }} />
            Medium (60-79%)
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: 'rgba(239,68,68,0.6)' }} />
            High (80%+)
          </div>
        </div>
      </div>
    </div>
  )
}
