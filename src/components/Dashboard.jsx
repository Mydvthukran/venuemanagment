import { useState, useEffect } from 'react'
import {
  Users, Clock, TrendingUp, TrendingDown, Zap,
  MapPin, ArrowUpRight, Wifi, ThermometerSun,
  ShieldCheck, UtensilsCrossed, Navigation, Cpu, Glasses, X, ArrowUp
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'

// Simulated crowd flow data
const crowdFlowData = [
  { time: '14:00', crowd: 12000, capacity: 55 },
  { time: '14:30', crowd: 18500, capacity: 65 },
  { time: '15:00', crowd: 28400, capacity: 78 },
  { time: '15:30', crowd: 35200, capacity: 85 },
  { time: '16:00', crowd: 41800, capacity: 92 },
  { time: '16:30', crowd: 43200, capacity: 95 },
  { time: '17:00', crowd: 42100, capacity: 93 },
  { time: '17:30', crowd: 38500, capacity: 88 },
]

const zoneData = [
  { zone: 'North', density: 82 },
  { zone: 'East', density: 65 },
  { zone: 'South', density: 91 },
  { zone: 'West', density: 48 },
  { zone: 'VIP', density: 72 },
  { zone: 'Food', density: 88 },
]

const quickActions = [
  { icon: UtensilsCrossed, label: 'Order Food', color: 'var(--accent-amber)' },
  { icon: Navigation, label: 'Navigate', color: 'var(--accent-cyan)' },
  { icon: MapPin, label: 'Find Seat', color: 'var(--accent-purple)' },
  { icon: ShieldCheck, label: 'Emergency', color: 'var(--accent-rose)' },
]

const recentAlerts = [
  { text: 'Gate B congestion cleared — flow normalized', time: '2m ago', type: 'emerald' },
  { text: 'Food court Zone C wait time > 15min', time: '5m ago', type: 'amber' },
  { text: 'Half-time break in 8 minutes', time: '8m ago', type: 'blue' },
  { text: 'Parking Lot D reaching capacity', time: '12m ago', type: 'rose' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: '0.78rem',
      }}>
        <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, fontWeight: 600 }}>
            {p.name}: {p.value.toLocaleString()}{p.name === 'Capacity' ? '%' : ''}
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard({ setActivePage, showToast }) {
  const [isARMode, setIsARMode] = useState(false)
  const [animatedStats, setAnimatedStats] = useState({ crowd: 0, wait: 0, capacity: 0, satisfaction: 0 })

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({ crowd: 43200, wait: 8, capacity: 95, satisfaction: 92 })
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div>
      {isARMode && (
        <div className="ar-overlay">
          <div className="ar-viewfinder"></div>
          
          <div className="ar-hud-header">
            <div className="ar-badge">
              <span className="live-dot" style={{ background: 'var(--accent-emerald)' }}></span> VR SIMULATION ACTIVE
            </div>
            <button className="ar-close-btn" onClick={() => setIsARMode(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="ar-direction-core">
            <div className="ar-arrow">
              <ArrowUp size={64} color="white" />
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, textShadow: '0 4px 20px rgba(59,130,246,0.6)' }}>
                STADIUM<span style={{ fontSize: '1.5rem', color: 'var(--accent-cyan)' }}>_CORE</span>
              </div>
              <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', letterSpacing: 1, textTransform: 'uppercase' }}>
                Scanning for Edge Beacons...
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 40, background: 'rgba(0,0,0,0.6)', padding: '16px 24px', borderRadius: '40px', border: '1px solid var(--accent-blue)', display: 'flex', gap: 16, alignItems: 'center', maxWidth: '90%' }}>
            <Cpu size={24} color="var(--accent-cyan)" />
            <div>
              <div style={{ fontWeight: 700 }}>Neural Processing Active</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>Edge Latency: 4.2ms</div>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="page-header animate-fadeInUp">
        <div className="page-header-left">
          <h2>Command Center</h2>
          <p>Real-time venue analytics and crowd intelligence</p>
        </div>
        <div className="header-actions">
          <span className="live-badge" style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', borderRadius: 4 }}>
            <Cpu size={12} /> Edge Node 01: 4ms
          </span>
          <span className="live-badge" style={{ fontSize: '0.75rem' }}>
            <span className="live-dot"></span>
            LIVE DATA
          </span>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => showToast('Network connection established: Stadium_VIP_5G', Wifi)}
          >
            <Wifi size={14} />
            Connected
          </button>
        </div>
      </div>

      {/* GIANT VR SIMULATION BUTTON */}
      <div 
        className="card animate-fadeInUp" 
        style={{ 
          marginBottom: 24, 
          background: 'var(--gradient-blue)', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: 16, 
          padding: '28px 20px', 
          boxShadow: '0 8px 30px rgba(225,29,72,0.4)', 
          border: '1px solid rgba(255,255,255,0.2)' 
        }}
        onClick={() => setIsARMode(true)}
      >
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: '50%' }}>
          <Glasses size={32} color="white" />
        </div>
        <div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: 1 }}>LAUNCH VR SIMULATOR</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>Experience the venue through Augmented Reality mode</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid animate-fadeInUp delay-1">
        <div className="stat-card blue">
          <div className="stat-card-top">
            <div className="stat-icon blue"><Users size={20} /></div>
            <div className="stat-trend up"><TrendingUp size={12} /> +2.4%</div>
          </div>
          <div className="stat-value">{animatedStats.crowd.toLocaleString()}</div>
          <div className="stat-label">Current Attendance</div>
        </div>

        <div className="stat-card amber">
          <div className="stat-card-top">
            <div className="stat-icon amber"><Clock size={20} /></div>
            <div className="stat-trend down"><TrendingDown size={12} /> −1.2m</div>
          </div>
          <div className="stat-value">{animatedStats.wait}<span style={{ fontSize: '1rem', fontWeight: 500 }}> min</span></div>
          <div className="stat-label">Avg. Wait Time</div>
        </div>

        <div className="stat-card emerald">
          <div className="stat-card-top">
            <div className="stat-icon emerald"><Zap size={20} /></div>
            <div className="stat-trend up"><TrendingUp size={12} /> +5%</div>
          </div>
          <div className="stat-value">{animatedStats.capacity}<span style={{ fontSize: '1rem', fontWeight: 500 }}>%</span></div>
          <div className="stat-label">Venue Capacity</div>
        </div>

        <div className="stat-card purple">
          <div className="stat-card-top">
            <div className="stat-icon purple"><ThermometerSun size={20} /></div>
            <div className="stat-trend up"><TrendingUp size={12} /> +3%</div>
          </div>
          <div className="stat-value">{animatedStats.satisfaction}<span style={{ fontSize: '1rem', fontWeight: 500 }}>%</span></div>
          <div className="stat-label">Fan Satisfaction</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-2 animate-fadeInUp delay-2">
        {/* Crowd Flow Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Crowd Flow Analytics</div>
              <div className="card-subtitle">Attendance over time</div>
            </div>
            <div className="pill-tabs">
              <button className="pill-tab active" onClick={() => showToast('Showing data for: Today', Clock)}>Today</button>
              <button className="pill-tab" onClick={() => showToast('Weekly analytics not available yet.', Clock)}>Week</button>
            </div>
          </div>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <AreaChart data={crowdFlowData}>
                <defs>
                  <linearGradient id="crowdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e11d48" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.3)" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="crowd" name="Crowd" stroke="#e11d48" strokeWidth={2.5} fill="url(#crowdGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone Density */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Zone Density</div>
              <div className="card-subtitle">Current crowd distribution</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={zoneData} layout="vertical" barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.3)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="zone" tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} width={50} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="density"
                  name="Density"
                  radius={[0, 6, 6, 0]}
                  fill="#fbbf24"
                  background={{ fill: 'rgba(51,65,85,0.15)', radius: [0, 6, 6, 0] }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid-2 animate-fadeInUp delay-3">
        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Quick Actions</div>
          </div>
          <div className="quick-action-grid">
            <button style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem', fontWeight: 500, fontFamily: 'var(--font-body)'
              }} className="quick-action-btn" onClick={() => setActivePage('food')}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `var(--accent-amber)18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-amber)' }}>
                  <UtensilsCrossed size={17} />
                </div>
                Order Food
                <ArrowUpRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
            </button>
            <button style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem', fontWeight: 500, fontFamily: 'var(--font-body)'
              }} className="quick-action-btn" onClick={() => setActivePage('navigate')}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `var(--accent-cyan)18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                  <Navigation size={17} />
                </div>
                Navigate
                <ArrowUpRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
            </button>
            <button style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem', fontWeight: 500, fontFamily: 'var(--font-body)'
              }} className="quick-action-btn" onClick={() => setActivePage('map')}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `var(--accent-purple)18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
                  <MapPin size={17} />
                </div>
                Find Seat
                <ArrowUpRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
            </button>
            <button style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem', fontWeight: 500, fontFamily: 'var(--font-body)'
              }} className="quick-action-btn" onClick={() => showToast('Security team automatically dispatched to Section 14.', ShieldCheck)}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `var(--accent-rose)18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-rose)' }}>
                  <ShieldCheck size={17} />
                </div>
                Emergency
                <ArrowUpRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
            </button>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Live Alerts</div>
            <span className="badge badge-rose">4 new</span>
          </div>
          <div className="notification-list">
            {recentAlerts.map((alert, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '10px 0',
                borderBottom: i < recentAlerts.length - 1 ? '1px solid var(--border-default)' : 'none'
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: `var(--accent-${alert.type})`,
                  marginTop: 6, flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500 }}>{alert.text}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{alert.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
