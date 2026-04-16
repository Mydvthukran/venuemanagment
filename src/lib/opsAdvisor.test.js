import { describe, expect, it } from 'vitest'
import { buildActionPlan, buildOpsSnapshot, buildScenarioReport } from './opsAdvisor'

describe('ops advisor', () => {
  it('returns a bounded score and status', () => {
    const snapshot = buildOpsSnapshot('normal')
    expect(snapshot.score).toBeGreaterThanOrEqual(38)
    expect(snapshot.score).toBeLessThanOrEqual(99)
    expect(['Stable', 'Watch', 'Critical']).toContain(snapshot.status)
  })

  it('applies harsher conditions in halftime compared to normal', () => {
    const normal = buildOpsSnapshot('normal')
    const halftime = buildOpsSnapshot('halftime')
    expect(halftime.avgWait).toBeGreaterThan(normal.avgWait)
    expect(halftime.score).toBeLessThan(normal.score)
  })

  it('includes mode-specific actions', () => {
    const egressActions = buildActionPlan('egress').join(' ').toLowerCase()
    expect(egressActions).toContain('gate d')
  })

  it('includes surge actions for halftime and fallback for normal', () => {
    const halftimeActions = buildActionPlan('halftime').join(' ').toLowerCase()
    const normalActions = buildActionPlan('normal').join(' ').toLowerCase()

    expect(halftimeActions).toContain('queue marshals')
    expect(halftimeActions).toContain('pre-stage')
    expect(normalActions).toContain('monitor congestion model')
  })

  it('builds a complete report payload', () => {
    const report = buildScenarioReport('normal')
    expect(report).toHaveProperty('generatedAt')
    expect(report).toHaveProperty('operationalScore')
    expect(Array.isArray(report.actionPlan)).toBe(true)
    expect(report.actionPlan.length).toBeGreaterThan(0)
  })
})
