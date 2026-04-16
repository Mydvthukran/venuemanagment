import { useState } from 'react'
import { ArrowRight, Ticket, Lock, Mail, ShieldCheck, User } from 'lucide-react'
export default function Login({ onLogin }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [ticketId, setTicketId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call for login
    setTimeout(() => {
      setLoading(false)
      onLogin({ fullName: fullName || 'Custom User' })
    }, 1500)
  }

  return (
    <div className="login-wrapper animate-fadeIn">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">V</div>
          <h1>VenueFlow</h1>
          <p>Sign in to your smart venue experience</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="search-input-wrapper" style={{ maxWidth: '100%' }}>
              <User size={16} className="search-icon" />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: 40 }}
                placeholder="e.g. Alex Jensen"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="search-input-wrapper" style={{ maxWidth: '100%' }}>
              <Mail size={16} className="search-icon" />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: 40 }}
                placeholder="fan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ticket ID / Booking Ref</label>
            <div className="search-input-wrapper" style={{ maxWidth: '100%' }}>
              <Ticket size={16} className="search-icon" />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: 40 }}
                placeholder="e.g. SEC14-A29-88"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ justifyContent: 'center', marginTop: 12, padding: '14px' }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'livePulse 1s linear infinite' }} />
                Authenticating...
              </span>
            ) : (
              <>
                Access Command Center
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.8rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 500 }}>
          <ShieldCheck size={14} />
          Blockchain Identity Verification Active
        </div>
      </div>
    </div>
  )
}
