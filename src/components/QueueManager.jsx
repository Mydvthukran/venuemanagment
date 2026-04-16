import { useMemo, useState } from 'react'
import { Clock, Users, TrendingDown, RefreshCw, Search, Smartphone, Sparkles } from 'lucide-react'
import { getQueueRecommendation, rankQueues } from '../lib/venueIntelligence'
import { trackVenueEvent } from '../services/firebase'
import { applyScenarioToQueue, getScenarioMeta } from '../lib/scenarioEngine'

const queues = [
  { id: 1, name: 'Main Food Court', location: 'Zone A — Level 1', icon: '🍔', wait: 14, people: 86, capacity: 75, trend: 'up', color: 'amber' },
  { id: 2, name: 'Craft Beer Stand', location: 'Zone B — Level 1', icon: '🍺', wait: 8, people: 42, capacity: 55, trend: 'down', color: 'emerald' },
  { id: 3, name: 'Restrooms North', location: 'Zone A — Level 2', icon: '🚻', wait: 6, people: 28, capacity: 40, trend: 'down', color: 'emerald' },
  { id: 4, name: 'Merchandise Store', location: 'Zone C — Level 1', icon: '👕', wait: 18, people: 64, capacity: 85, trend: 'up', color: 'rose' },
  { id: 5, name: 'Restrooms South', location: 'Zone C — Level 2', icon: '🚻', wait: 11, people: 52, capacity: 65, trend: 'up', color: 'amber' },
  { id: 6, name: 'Pizza Station', location: 'Zone B — Level 1', icon: '🍕', wait: 5, people: 18, capacity: 30, trend: 'down', color: 'emerald' },
  { id: 7, name: 'VIP Lounge Bar', location: 'VIP Area — Level 3', icon: '🥂', wait: 3, people: 12, capacity: 15, trend: 'stable', color: 'emerald' },
  { id: 8, name: 'Ice Cream Cart', location: 'Zone D — Level 1', icon: '🍦', wait: 4, people: 15, capacity: 20, trend: 'down', color: 'emerald' },
  { id: 9, name: 'Hot Dog Stand', location: 'Zone A — Level 1', icon: '🌭', wait: 10, people: 38, capacity: 60, trend: 'up', color: 'amber' },
  { id: 10, name: 'Coffee Kiosk', location: 'Zone D — Level 2', icon: '☕', wait: 7, people: 24, capacity: 35, trend: 'down', color: 'emerald' },
]

function getWaitClass(wait) {
  if (wait <= 5) return 'low'
  if (wait <= 12) return 'medium'
  return 'high'
}

function getCapacityPct(people, capacity) {
  return Math.min((people / capacity) * 100, 100)
}

export default function QueueManager({ showToast, simulationMode = 'normal' }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const scenario = getScenarioMeta(simulationMode)

  const scenarioQueues = useMemo(
    () => queues.map((queue) => applyScenarioToQueue(queue, simulationMode)),
    [simulationMode],
  )

  const filtered = useMemo(
    () =>
      scenarioQueues
        .filter((q) => {
      if (filter === 'low') return q.wait <= 5
      if (filter === 'busy') return q.wait > 12
      return true
        })
        .filter((q) => q.name.toLowerCase().includes(search.toLowerCase())),
    [scenarioQueues, filter, search],
  )

  const rankedQueues = useMemo(() => rankQueues(filtered), [filtered])
  const recommendation = useMemo(() => getQueueRecommendation(filtered), [filtered])

  const avgWait = Math.round(scenarioQueues.reduce((a, q) => a + q.wait, 0) / scenarioQueues.length)
  const totalInQueue = scenarioQueues.reduce((a, q) => a + q.people, 0)

  return (
    <div>
      <div className="page-header animate-fadeInUp">
        <div className="page-header-left">
          <h2>Queue Status</h2>
          <p>Real-time wait times across all venues and facilities ({scenario.shortLabel})</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              showToast('Queue times refreshed from sensors.', Clock)
              trackVenueEvent('queues_refreshed', { filter, queryLength: search.length })
            }}
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {recommendation && (
        <div className="delivery-banner animate-fadeInUp delay-1" style={{ marginBottom: 18 }}>
          <div className="delivery-banner-icon" style={{ background: 'var(--gradient-emerald)' }}>
            <Sparkles size={22} />
          </div>
          <div className="delivery-banner-text">
            <h3>Smart Recommendation: {recommendation.name}</h3>
            <p>
              Predicted wait in 10 minutes: {recommendation.predictedWait} min, occupancy load {Math.round(recommendation.capacityLoad)}%.
            </p>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="stats-grid animate-fadeInUp delay-1">
        <div className="stat-card amber">
          <div className="stat-card-top">
            <div className="stat-icon amber"><Clock size={20} /></div>
            <div className="stat-trend down"><TrendingDown size={12} /> −0.5m</div>
          </div>
          <div className="stat-value">{avgWait}<span style={{ fontSize: '1rem', fontWeight: 500 }}> min</span></div>
          <div className="stat-label">Average Wait Time</div>
        </div>

        <div className="stat-card blue">
          <div className="stat-card-top">
            <div className="stat-icon blue"><Users size={20} /></div>
          </div>
          <div className="stat-value">{totalInQueue}</div>
          <div className="stat-label">Total People in Queues</div>
        </div>

        <div className="stat-card emerald">
          <div className="stat-card-top">
            <div className="stat-icon emerald"><Clock size={20} /></div>
          </div>
          <div className="stat-value">{scenarioQueues.filter(q => q.wait <= 5).length}</div>
          <div className="stat-label">Short Wait Locations</div>
        </div>

        <div className="stat-card rose">
          <div className="stat-card-top">
            <div className="stat-icon rose"><Clock size={20} /></div>
          </div>
          <div className="stat-value">{scenarioQueues.filter(q => q.wait > 12).length}</div>
          <div className="stat-label">Congested Points</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-4 animate-fadeInUp delay-2" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div className="pill-tabs">
          {['all', 'low', 'busy'].map(f => (
            <button
              key={f}
              className={`pill-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All Queues' : f === 'low' ? '⚡ Short Wait' : '🔥 Busy'}
            </button>
          ))}
        </div>
        <div className="search-input-wrapper">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search locations..."
            aria-label="Search queue locations"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Queue List */}
      <div className="queue-list animate-fadeInUp delay-3">
        {rankedQueues.map((q) => {
          const waitClass = getWaitClass(q.wait)
          const pct = getCapacityPct(q.people, q.capacity)
          return (
            <div className="queue-item" key={q.id}>
              <div className="queue-icon" style={{
                background: `var(--accent-${q.color})18`,
                fontSize: '1.5rem'
              }}>
                {q.icon}
              </div>
              <div className="queue-info" style={{ flex: 1 }}>
                <div className="queue-name">{q.name}</div>
                <div className="queue-location">{q.location}</div>
                <div className="queue-bar-container">
                  <div
                    className={`queue-bar ${waitClass}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <Users size={13} />
                {q.people}
              </div>
              <div className="queue-wait" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <div className={`queue-wait-time wait-${waitClass}`}>{q.wait}m</div>
                <div className="queue-wait-label">wait</div>
                <div className="queue-wait-label" style={{ textTransform: 'none' }}>
                  {q.predictedWait}m in 10m
                </div>
                {q.wait > 5 && (
                  <button 
                    className="btn btn-primary btn-sm" 
                    style={{ padding: '2px 8px', fontSize: '0.65rem', transform: 'scale(0.9)', transformOrigin: 'right center' }}
                    onClick={() => {
                      showToast(`Joined virtual queue for ${q.name}. ETA: ${q.wait}m.`, Smartphone)
                      trackVenueEvent('virtual_queue_joined', {
                        queue_name: q.name,
                        wait: q.wait,
                        predicted_wait: q.predictedWait,
                      })
                    }}
                  >
                    <Smartphone size={10} /> Join
                  </button>
                )}
              </div>
            </div>
          )
        })}
        {rankedQueues.length === 0 && (
          <div style={{
            textAlign: 'center', padding: 40,
            color: 'var(--text-muted)', fontSize: '0.9rem'
          }}>
            No queues match your search
          </div>
        )}
      </div>
    </div>
  )
}
