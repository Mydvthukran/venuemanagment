const CROWD_PENALTY = {
  low: 4,
  medium: 13,
  high: 24,
}

const TREND_DELTA = {
  up: 2,
  down: -2,
  stable: 0,
}

function parseNumber(value) {
  const parsed = Number.parseInt(String(value), 10)
  return Number.isFinite(parsed) ? parsed : 0
}

function normalizeCrowd(crowd) {
  return String(crowd || '').trim().toLowerCase()
}

export function predictQueueWait(wait, trend) {
  const base = Math.max(1, parseNumber(wait))
  const delta = TREND_DELTA[String(trend || '').toLowerCase()] ?? 0
  return Math.max(1, base + delta)
}

export function rankQueues(inputQueues) {
  return inputQueues
    .map((queue) => {
      const predictedWait = predictQueueWait(queue.wait, queue.trend)
      const capacityLoad = Math.min((queue.people / queue.capacity) * 100, 100)
      const loadPenalty = Math.round(capacityLoad * 0.18)
      const trendPenalty = queue.trend === 'up' ? 7 : queue.trend === 'down' ? -3 : 0
      const score = predictedWait * 4 + loadPenalty + trendPenalty

      return {
        ...queue,
        predictedWait,
        capacityLoad,
        score,
      }
    })
    .sort((a, b) => a.score - b.score)
}

export function getQueueRecommendation(inputQueues) {
  const ranked = rankQueues(inputQueues)
  return ranked[0] || null
}

function buildRouteReason(route, strategy) {
  if (strategy === 'fastest') {
    return `Fastest ETA at ${route.time}`
  }

  if (strategy === 'leastCrowded') {
    return `${route.crowd} traffic corridor with steadier flow`
  }

  if (strategy === 'leastWalking') {
    return `Shortest walking effort at ${route.steps} steps`
  }

  return 'Best overall balance across ETA, crowd, and walking load'
}

function scoreRoute(route, strategy) {
  const eta = parseNumber(route.time)
  const distance = parseNumber(route.distance)
  const steps = parseNumber(route.steps)
  const crowdPenalty = CROWD_PENALTY[normalizeCrowd(route.crowd)] ?? 10

  if (strategy === 'fastest') {
    return eta * 8 + crowdPenalty + Math.round(distance * 0.02)
  }

  if (strategy === 'leastCrowded') {
    return crowdPenalty * 6 + eta * 3 + Math.round(distance * 0.01)
  }

  if (strategy === 'leastWalking') {
    return Math.round(steps * 0.09) + eta * 3 + crowdPenalty * 2
  }

  return eta * 5 + crowdPenalty * 3 + Math.round(steps * 0.05) + Math.round(distance * 0.01)
}

export function rankRoutes(inputRoutes, strategy = 'balanced') {
  return inputRoutes
    .map((route) => ({
      ...route,
      recommendationScore: scoreRoute(route, strategy),
      reason: buildRouteReason(route, strategy),
    }))
    .sort((a, b) => a.recommendationScore - b.recommendationScore)
    .map((route, index) => ({
      ...route,
      recommended: index === 0,
    }))
}
