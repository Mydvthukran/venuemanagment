import { useState } from 'react'
import { CalendarClock, Play, Pause, Clock, Trophy, Users, Zap, Music } from 'lucide-react'

const timelineEvents = [
  {
    time: '13:00',
    title: 'Gates Open',
    desc: 'All entry gates operational. Early bird fans can enter.',
    dot: 'emerald',
    icon: '🚪',
    passed: true
  },
  {
    time: '13:30',
    title: 'Fan Zone Opens',
    desc: 'Pre-game activities, food stalls and merchandise open in the fan zone.',
    dot: 'emerald',
    icon: '🎪',
    passed: true
  },
  {
    time: '14:15',
    title: 'Team Warm-ups',
    desc: 'Both teams take the field for warm-up sessions.',
    dot: 'emerald',
    icon: '⚡',
    passed: true
  },
  {
    time: '14:45',
    title: 'Pre-Game Show',
    desc: 'Live musical performance by featured artist at the center stage.',
    dot: 'emerald',
    icon: '🎵',
    passed: true
  },
  {
    time: '15:00',
    title: 'Kick-off — First Half',
    desc: 'The match begins! Thunder vs Phoenix — Championship Final.',
    dot: 'emerald',
    icon: '⚽',
    passed: true
  },
  {
    time: '15:22',
    title: 'GOAL! — Thunder',
    desc: 'James Rodriguez scores from a free kick (1-0).',
    dot: 'blue',
    icon: '🎯',
    passed: true
  },
  {
    time: '15:38',
    title: 'GOAL! — Phoenix',
    desc: 'Equalizer by Marcus Sterling from close range (1-1).',
    dot: 'amber',
    icon: '🎯',
    passed: true
  },
  {
    time: '15:45',
    title: 'Half-Time',
    desc: '15-minute break. Food courts and restrooms expect peak traffic.',
    dot: 'emerald',
    icon: '⏸️',
    passed: true
  },
  {
    time: '16:00',
    title: 'Second Half Begins',
    desc: 'Play resumes. Both teams make tactical substitutions.',
    dot: 'emerald',
    icon: '▶️',
    passed: true
  },
  {
    time: '16:12',
    title: 'GOAL! — Thunder',
    desc: 'Header by Chen Wei from a corner kick (2-1).',
    dot: 'blue',
    icon: '🎯',
    passed: true
  },
  {
    time: '16:22',
    title: 'Now — 67th Minute',
    desc: 'Thunder leading 2-1. Intense midfield battle.',
    dot: 'live',
    icon: '🔴',
    passed: false,
    current: true
  },
  {
    time: '16:30',
    title: 'Water Break (Expected)',
    desc: 'Scheduled cooling break due to temperature.',
    dot: 'blue',
    icon: '💧',
    passed: false
  },
  {
    time: '16:45',
    title: 'Final Whistle (Expected)',
    desc: 'End of regulation time. Extra-time if scores level.',
    dot: 'blue',
    icon: '🏁',
    passed: false
  },
  {
    time: '17:00',
    title: 'Trophy Ceremony',
    desc: 'Award presentation at the main podium.',
    dot: 'blue',
    icon: '🏆',
    passed: false
  },
  {
    time: '17:15',
    title: 'Staggered Exit',
    desc: 'Exit will begin zone-by-zone. Follow navigation for optimal exit route.',
    dot: 'blue',
    icon: '🚶',
    passed: false
  },
]

const matchStats = [
  { label: 'Possession', home: '58%', away: '42%' },
  { label: 'Shots', home: '12', away: '8' },
  { label: 'Shots on Target', home: '5', away: '3' },
  { label: 'Corners', home: '6', away: '4' },
  { label: 'Fouls', home: '9', away: '11' },
]

export default function EventTimeline() {
  const [showAll, setShowAll] = useState(false)

  const visibleEvents = showAll ? timelineEvents : timelineEvents.filter(e => {
    const idx = timelineEvents.findIndex(ev => ev.current)
    const evIdx = timelineEvents.indexOf(e)
    return evIdx >= Math.max(0, idx - 3) && evIdx <= idx + 4
  })

  return (
    <div>
      <div className="page-header animate-fadeInUp">
        <div className="page-header-left">
          <h2>Event Timeline</h2>
          <p>Live match progress, key events, and upcoming schedule</p>
        </div>
        <span className="live-badge">
          <span className="live-dot"></span>
          LIVE — 67'
        </span>
      </div>

      <div className="grid-2 animate-fadeInUp delay-1">
        {/* Timeline */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <CalendarClock size={16} style={{ marginRight: 6, verticalAlign: '-2px' }} />
              Match Timeline
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show Less' : 'Show All'}
            </button>
          </div>

          <div className="timeline">
            {visibleEvents.map((event, i) => (
              <div className="timeline-item" key={i}>
                <div className={`timeline-dot ${event.dot}`} />
                <div className="timeline-time">
                  {event.icon} {event.time}
                  {event.current && (
                    <span className="live-badge" style={{ marginLeft: 8, fontSize: '0.6rem', padding: '1px 6px' }}>
                      <span className="live-dot" style={{ width: 4, height: 4 }}></span>
                      NOW
                    </span>
                  )}
                </div>
                <div className="timeline-title" style={{
                  opacity: event.passed && !event.current ? 0.7 : 1
                }}>{event.title}</div>
                <div className="timeline-desc" style={{
                  opacity: event.passed && !event.current ? 0.5 : 0.8
                }}>{event.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Match Stats */}
        <div>
          {/* Scoreboard */}
          <div className="card" style={{ marginBottom: 20, textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 16 }}>
              Championship Final • 67th Minute
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: 6 }}>🔵</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>Thunder</div>
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.8rem',
                fontWeight: 900,
                letterSpacing: 6,
                background: 'var(--gradient-blue)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                2 — 1
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: 6 }}>🔴</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>Phoenix</div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                ⚽ Rodriguez 22' &nbsp; Wei 57' &nbsp;&nbsp;|&nbsp;&nbsp; ⚽ Sterling 38'
              </div>
            </div>
          </div>

          {/* Stats Table */}
          <div className="card">
            <div className="card-title mb-3">Match Statistics</div>
            {matchStats.map((stat, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < matchStats.length - 1 ? '1px solid var(--border-default)' : 'none',
              }}>
                <div style={{ width: 50, textAlign: 'right', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  {stat.home}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex', gap: 4, margin: '0 12px',
                    height: 6, borderRadius: 3, overflow: 'hidden'
                  }}>
                    <div style={{
                      flex: parseFloat(stat.home),
                      background: 'var(--accent-blue)',
                      borderRadius: 3
                    }} />
                    <div style={{
                      flex: parseFloat(stat.away),
                      background: 'var(--accent-rose)',
                      borderRadius: 3
                    }} />
                  </div>
                  <div style={{
                    textAlign: 'center',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    marginTop: 4
                  }}>{stat.label}</div>
                </div>
                <div style={{ width: 50, textAlign: 'left', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  {stat.away}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
