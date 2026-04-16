import { describe, expect, it } from 'vitest'
import {
  getQueueRecommendation,
  predictQueueWait,
  rankQueues,
  rankRoutes,
} from './venueIntelligence'

describe('venue intelligence', () => {
  it('predicts queue wait by trend direction', () => {
    expect(predictQueueWait(8, 'up')).toBe(10)
    expect(predictQueueWait(8, 'down')).toBe(6)
    expect(predictQueueWait(0, 'stable')).toBe(1)
  })

  it('recommends the healthiest queue option', () => {
    const queues = [
      { id: 1, name: 'Busy', wait: 14, people: 80, capacity: 90, trend: 'up' },
      { id: 2, name: 'Fast', wait: 6, people: 20, capacity: 60, trend: 'down' },
    ]

    const recommended = getQueueRecommendation(queues)
    expect(recommended.name).toBe('Fast')
  })

  it('ranks routes according to selected strategy', () => {
    const routes = [
      { id: 1, name: 'Route A', time: '6 min', distance: '400m', crowd: 'Medium', steps: 200 },
      { id: 2, name: 'Route B', time: '4 min', distance: '320m', crowd: 'High', steps: 170 },
      { id: 3, name: 'Route C', time: '5 min', distance: '350m', crowd: 'Low', steps: 120 },
    ]

    const fastest = rankRoutes(routes, 'fastest')
    expect(fastest[0].name).toBe('Route C')

    const leastCrowded = rankRoutes(routes, 'leastCrowded')
    expect(leastCrowded[0].name).toBe('Route C')
  })

  it('ranked queues include computed fields', () => {
    const ranked = rankQueues([
      { id: 1, name: 'Sample', wait: 9, people: 40, capacity: 80, trend: 'stable' },
    ])

    expect(ranked[0]).toHaveProperty('predictedWait')
    expect(ranked[0]).toHaveProperty('capacityLoad')
    expect(ranked[0]).toHaveProperty('score')
  })
})
