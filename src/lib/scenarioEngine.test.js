import { describe, expect, it } from 'vitest'
import {
  applyScenarioToDashboardStats,
  applyScenarioToDensity,
  applyScenarioToQueue,
  applyScenarioToRoutes,
  getScenarioMeta,
  listScenarios,
} from './scenarioEngine'

describe('scenario engine', () => {
  it('returns known scenario metadata', () => {
    const meta = getScenarioMeta('halftime')
    expect(meta.shortLabel).toBe('Half-Time')
  })

  it('lists all scenarios', () => {
    expect(listScenarios()).toHaveLength(3)
  })

  it('increases food queue pressure in halftime', () => {
    const queue = { id: 1, name: 'Main Food Court', wait: 10, people: 30 }
    const adjusted = applyScenarioToQueue(queue, 'halftime')
    expect(adjusted.wait).toBeGreaterThan(queue.wait)
    expect(adjusted.people).toBeGreaterThan(queue.people)
  })

  it('adjusts routes for egress toward exit destination', () => {
    const routes = [
      { id: 1, name: 'Gate D (Least Congested)', time: '7 min', distance: '520m', crowd: 'Low', crowdColor: 'emerald' },
      { id: 2, name: 'Gate A (Nearest)', time: '5 min', distance: '350m', crowd: 'High', crowdColor: 'rose' },
    ]

    const adjusted = applyScenarioToRoutes(routes, 'egress', 'exit')
    expect(adjusted[0].time).toBe('7 min')
    expect(adjusted[1].crowd).toBe('High')
  })

  it('applies density and dashboard deltas', () => {
    expect(applyScenarioToDensity(60, 'halftime')).toBeGreaterThan(60)

    const stats = applyScenarioToDashboardStats({ crowd: 43000, wait: 8, capacity: 95, satisfaction: 92 }, 'egress')
    expect(stats.crowd).toBeLessThan(43000)
    expect(stats.wait).toBeGreaterThanOrEqual(8)
  })
})
