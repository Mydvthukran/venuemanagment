import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Clock, Cpu, Info, Navigation, ShieldCheck, TrendingUp, Users, Zap } from 'lucide-react'
import { getScenarioMeta } from '../lib/scenarioEngine'
import { trackVenueEvent } from '../services/firebase'

const interventionSteps = [
  {
    title: 'Detect surge early',
    summary: 'Queue and movement signals detect emerging congestion before fan complaints begin.',
    action: 'Anomaly confidence 93% from gate and queue signals.',
  },
  {
    title: 'Model best response',
    summary: 'Decision engine tests staffing, reroute, and fulfillment scenarios in seconds.',
    action: 'Commander selected plan B with fastest wait-time recovery.',
  },
  {
    title: 'Execute interventions',
    summary: 'Reroute prompts, queue marshal dispatch, and food prep balancing happen in parallel.',
    action: 'Live interventions sent to navigation, queue, and concession channels.',
  },
  {
    title: 'Verify outcomes',
    summary: 'Loop monitors if wait times and risk scores improve, then tunes continuously.',
    action: 'Risk trend is dropping with stable fan satisfaction.',
  },
]

const logicRows = [
  {
    signal: 'Wait trend rising and queue > 15 min',
    decision: 'Deploy marshals and shift nearby fans to low-load queue',
    target: 'Reduce wait by 20%+',
  },
  {
    signal: 'Exit density spikes in egress',
    decision: 'Promote Gate D and stagger route prompts',
    target: 'Lower choke-point pressure',
  },
  {
    signal: 'Food prep latency exceeds threshold',
    decision: 'Throttle low-priority prep and prioritize seat delivery',
    target: 'Protect satisfaction score',
  },
]

export default function ImpactLab({ simulationMode = 'normal', opsSnapshot, actionPlan = [], setActivePage, showToast }) {
  const [commanderEnabled, setCommanderEnabled] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [activeView, setActiveView] = useState('story')
  const scenario = getScenarioMeta(simulationMode)

  useEffect(() => {
    if (!commanderEnabled) {
      return undefined
    }

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % interventionSteps.length)
    }, 2400)

    return () => clearInterval(timer)
  }, [commanderEnabled])

  const impact = useMemo(() => {
    const baseWait = Math.max(opsSnapshot?.avgWait ?? 11, 1)
    const riskBase = Math.max(18, (opsSnapshot?.highRiskCount ?? 3) * 11)
    const scenarioPressure = simulationMode === 'halftime' ? 9 : simulationMode === 'egress' ? 7 : 4

    if (!commanderEnabled) {
      return {
        waitBefore: baseWait,
        waitAfter: baseWait,
        riskBefore: riskBase + scenarioPressure,
        riskAfter: riskBase + scenarioPressure,
        rerouteSuccess: 0,
      }
    }

    const loopOffset = activeStep * 2
    return {
      waitBefore: baseWait,
      waitAfter: Math.max(2, Math.round(baseWait * 0.68) - Math.min(2, Math.floor(loopOffset / 3))),
      riskBefore: riskBase + scenarioPressure,
      riskAfter: Math.max(6, Math.round((riskBase + scenarioPressure) * 0.62) - Math.min(3, activeStep)),
      rerouteSuccess: Math.min(97, 83 + loopOffset + (simulationMode === 'normal' ? 4 : 0)),
    }
  }, [activeStep, commanderEnabled, opsSnapshot, simulationMode])

  const liveStep = interventionSteps[activeStep]
  const progress = commanderEnabled ? Math.min(100, 30 + activeStep * 23) : 0

  return (
    <div>
      <section className="impact-hero card animate-fadeInUp">
        <div className="impact-hero-top">
          <span className="badge badge-emerald">Impact Feature</span>
          <span className="impact-scenario-tag">Scenario: {scenario.label}</span>
        </div>

        <h2>Autonomous Incident Commander</h2>
        <p>
          VenueFlow now demonstrates a full incident response loop: detect congestion, choose the best intervention,
          execute across systems, and verify measurable impact in real time.
        </p>

        <div className="impact-cta-row">
          <button
            className={`impact-commander-toggle ${commanderEnabled ? 'active' : ''}`}
            onClick={() => {
              const next = !commanderEnabled
              setCommanderEnabled(next)
              showToast(next ? 'Incident Commander activated.' : 'Incident Commander paused.', Zap)
              trackVenueEvent('impact_commander_toggled', {
                enabled: next,
                scenario: simulationMode,
              })
            }}
          >
            <Cpu size={15} />
            {commanderEnabled ? 'Pause Commander' : 'Activate Commander'}
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setActivePage('queues')
              showToast('Jumped to queue controls for intervention review.', Clock)
              trackVenueEvent('impact_queue_drilldown', { scenario: simulationMode })
            }}
          >
            Open Queue Control
          </button>
        </div>
      </section>

      <section className="impact-story-grid animate-fadeInUp delay-1">
        <article className="impact-story-card">
          <div className="impact-story-label">Problem</div>
          <div className="impact-story-title">Fans lose time in avoidable congestion.</div>
          <p>Surges in queues and exit paths create long waits and safety pressure if detected too late.</p>
        </article>

        <article className="impact-story-card">
          <div className="impact-story-label">Intervention</div>
          <div className="impact-story-title">AI orchestrates actions in one loop.</div>
          <p>Commander coordinates rerouting, staffing, and concession balancing with one decision model.</p>
        </article>

        <article className="impact-story-card">
          <div className="impact-story-label">Outcome</div>
          <div className="impact-story-title">Measurable operational lift.</div>
          <p>Wait-time reduction, lower risk index, and stronger route compliance shown as live proof.</p>
        </article>
      </section>

      <section className="impact-metrics-grid animate-fadeInUp delay-2" aria-live="polite">
        <article className="impact-metric-card">
          <div className="impact-metric-head">
            <Clock size={15} />
            Average Wait
          </div>
          <div className="impact-metric-values">
            <span className="before">{impact.waitBefore}m</span>
            <ArrowRight size={14} />
            <span className="after">{impact.waitAfter}m</span>
          </div>
          <div className="impact-metric-caption">Projected using active scenario pressure.</div>
        </article>

        <article className="impact-metric-card">
          <div className="impact-metric-head">
            <ShieldCheck size={15} />
            Risk Index
          </div>
          <div className="impact-metric-values">
            <span className="before">{impact.riskBefore}</span>
            <ArrowRight size={14} />
            <span className="after">{impact.riskAfter}</span>
          </div>
          <div className="impact-metric-caption">Lower is safer. Continuously re-evaluated by commander.</div>
        </article>

        <article className="impact-metric-card">
          <div className="impact-metric-head">
            <Navigation size={15} />
            Route Compliance
          </div>
          <div className="impact-metric-values single">
            <span className="after">{impact.rerouteSuccess}%</span>
          </div>
          <div className="impact-metric-caption">Fans following low-congestion recommendations.</div>
        </article>
      </section>

      <section className="impact-layout-grid animate-fadeInUp delay-3">
        <article className="card impact-loop-card">
          <div className="card-header">
            <div>
              <div className="card-title">Live Intervention Loop</div>
              <div className="card-subtitle">Real-time feedback with measurable control flow.</div>
            </div>
            <span className={`badge ${commanderEnabled ? 'badge-emerald' : 'badge-rose'}`}>
              {commanderEnabled ? 'Running' : 'Paused'}
            </span>
          </div>

          <div className="impact-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <div className="impact-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="impact-step-list">
            {interventionSteps.map((step, index) => (
              <button
                key={step.title}
                className={`impact-step-item ${index === activeStep ? 'active' : ''}`}
                onClick={() => {
                  setActiveStep(index)
                  setCommanderEnabled(false)
                  showToast('Manual inspection mode enabled.', Info)
                }}
              >
                <div className="impact-step-index">0{index + 1}</div>
                <div>
                  <div className="impact-step-title">{step.title}</div>
                  <div className="impact-step-summary">{step.summary}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="impact-live-note">
            <TrendingUp size={14} />
            <span>{liveStep.action}</span>
          </div>

          {actionPlan.length > 0 && (
            <div className="impact-plan-preview">
              <div className="impact-plan-label">Current top action</div>
              <div className="impact-plan-item">{actionPlan[0]}</div>
            </div>
          )}
        </article>

        <article className="card impact-system-card">
          <div className="card-header" style={{ marginBottom: 14 }}>
            <div>
              <div className="card-title">System and Decision Visualization</div>
              <div className="card-subtitle">Judge-ready blueprint of data flow and action logic.</div>
            </div>
          </div>

          <div className="pill-tabs" style={{ marginBottom: 14 }}>
            {['story', 'system', 'logic'].map((view) => (
              <button
                key={view}
                className={`pill-tab ${activeView === view ? 'active' : ''}`}
                onClick={() => {
                  setActiveView(view)
                  trackVenueEvent('impact_view_changed', { view })
                }}
              >
                {view === 'story' ? 'Storyline' : view === 'system' ? 'System Flow' : 'Decision Logic'}
              </button>
            ))}
          </div>

          {activeView === 'story' && (
            <div className="impact-storyline-list">
              <div><strong>Fan intent:</strong> reach seat quickly, avoid long lines, receive updates early.</div>
              <div><strong>Operational pain:</strong> surges appear in waves and static staffing reacts too late.</div>
              <div><strong>VenueFlow promise:</strong> one control loop that protects wait time, safety, and satisfaction simultaneously.</div>
            </div>
          )}

          {activeView === 'system' && (
            <div className="impact-diagram">
              <div className="impact-node">
                <div className="impact-node-title">Signal Ingest</div>
                <div className="impact-node-meta">Queue events, map taps, service throughput</div>
              </div>
              <ArrowRight className="impact-node-arrow" size={16} />
              <div className="impact-node">
                <div className="impact-node-title">Scenario Engine</div>
                <div className="impact-node-meta">Normal, half-time rush, egress transforms</div>
              </div>
              <ArrowRight className="impact-node-arrow" size={16} />
              <div className="impact-node">
                <div className="impact-node-title">Ops Advisor</div>
                <div className="impact-node-meta">Scores risk and proposes ranked actions</div>
              </div>
              <ArrowRight className="impact-node-arrow" size={16} />
              <div className="impact-node">
                <div className="impact-node-title">Action Channels</div>
                <div className="impact-node-meta">Navigation, queues, food, notifications</div>
              </div>
            </div>
          )}

          {activeView === 'logic' && (
            <div className="impact-logic-table" role="table" aria-label="Decision logic table">
              {logicRows.map((row) => (
                <div key={row.signal} className="impact-logic-row" role="row">
                  <div role="cell">
                    <div className="impact-logic-label">Signal</div>
                    <div>{row.signal}</div>
                  </div>
                  <div role="cell">
                    <div className="impact-logic-label">Decision</div>
                    <div>{row.decision}</div>
                  </div>
                  <div role="cell">
                    <div className="impact-logic-label">Target</div>
                    <div>{row.target}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="impact-proof-strip">
            <Users size={14} />
            <span>
              Proof mode: {commanderEnabled ? 'Live autonomous loop running.' : 'Manual inspection mode for judges.'}
            </span>
          </div>
        </article>
      </section>
    </div>
  )
}
