import { applyScenarioToQueue, getScenarioMeta } from './scenarioEngine'

const BASE_QUEUE_SNAPSHOT = [
  { id: 1, name: 'Main Food Court', wait: 14, people: 86, capacity: 75 },
  { id: 2, name: 'Craft Beer Stand', wait: 8, people: 42, capacity: 55 },
  { id: 3, name: 'Restrooms North', wait: 6, people: 28, capacity: 40 },
  { id: 4, name: 'Merchandise Store', wait: 18, people: 64, capacity: 85 },
  { id: 5, name: 'Restrooms South', wait: 11, people: 52, capacity: 65 },
  { id: 6, name: 'Pizza Station', wait: 5, people: 18, capacity: 30 },
  { id: 7, name: 'VIP Lounge Bar', wait: 3, people: 12, capacity: 15 },
]

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function getStatusFromScore(score) {
  if (score >= 80) return 'Stable'
  if (score >= 65) return 'Watch'
  return 'Critical'
}

export function buildOpsSnapshot(mode = 'normal') {
  const scenario = getScenarioMeta(mode)
  const queues = BASE_QUEUE_SNAPSHOT.map((queue) => applyScenarioToQueue(queue, mode))

  const avgWait = Math.round(queues.reduce((sum, queue) => sum + queue.wait, 0) / queues.length)
  const highRiskQueues = queues.filter((queue) => queue.wait >= 15)
  const highLoadQueues = queues.filter((queue) => queue.people / queue.capacity >= 0.9)
  const worstQueue = [...queues].sort((a, b) => b.wait - a.wait)[0]

  const baseScore = 100
  const avgWaitPenalty = avgWait * 2
  const riskPenalty = highRiskQueues.length * 7
  const loadPenalty = highLoadQueues.length * 5
  const score = clamp(Math.round(baseScore - avgWaitPenalty - riskPenalty - loadPenalty), 38, 99)

  return {
    scenario: scenario.label,
    mode: scenario.id,
    score,
    status: getStatusFromScore(score),
    avgWait,
    highRiskCount: highRiskQueues.length,
    highLoadCount: highLoadQueues.length,
    worstQueue,
  }
}

export function buildActionPlan(mode = 'normal') {
  const scenario = getScenarioMeta(mode)
  const snapshot = buildOpsSnapshot(mode)
  const actions = []

  if (snapshot.avgWait >= 12) {
    actions.push('Deploy two additional queue marshals to food and restroom corridors.')
  }

  if (snapshot.highRiskCount >= 2) {
    actions.push(`Open overflow support for ${snapshot.worstQueue.name} and reroute nearby traffic.`)
  }

  if (snapshot.highLoadCount > 0) {
    actions.push('Trigger dynamic signage to redirect fans to lower-density alternatives.')
  }

  if (scenario.id === 'halftime') {
    actions.push('Pre-stage mobile food runners and restroom attendants for interval surge.')
  }

  if (scenario.id === 'egress') {
    actions.push('Prioritize Gate D and stagger egress messaging by seating section.')
  }

  if (actions.length < 3) {
    actions.push('Maintain baseline staffing and monitor congestion model every 5 minutes.')
  }

  return actions.slice(0, 5)
}

export function buildScenarioReport(mode = 'normal') {
  const snapshot = buildOpsSnapshot(mode)
  const actions = buildActionPlan(mode)

  return {
    generatedAt: new Date().toISOString(),
    scenario: snapshot.scenario,
    mode: snapshot.mode,
    operationalScore: snapshot.score,
    status: snapshot.status,
    metrics: {
      averageWaitMinutes: snapshot.avgWait,
      highRiskQueues: snapshot.highRiskCount,
      highLoadQueues: snapshot.highLoadCount,
      worstQueue: snapshot.worstQueue?.name,
      worstQueueWait: snapshot.worstQueue?.wait,
    },
    actionPlan: actions,
    summary: `Scenario ${snapshot.scenario} evaluated as ${snapshot.status} with operational score ${snapshot.score}/100.`,
  }
}
