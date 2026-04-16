const SCENARIO_META = {
  normal: {
    id: 'normal',
    label: 'Normal Operations',
    shortLabel: 'Normal',
    queueWaitMultiplier: 1,
    queuePeopleMultiplier: 1,
    routeTimeDelta: 0,
    routeCrowdShift: 0,
    densityDelta: 0,
    attendanceMultiplier: 1,
    waitMultiplier: 1,
    satisfactionDelta: 0,
    description: 'Baseline live venue conditions.',
  },
  halftime: {
    id: 'halftime',
    label: 'Half-Time Rush',
    shortLabel: 'Half-Time',
    queueWaitMultiplier: 1.35,
    queuePeopleMultiplier: 1.25,
    routeTimeDelta: 2,
    routeCrowdShift: 1,
    densityDelta: 10,
    attendanceMultiplier: 1.05,
    waitMultiplier: 1.4,
    satisfactionDelta: -6,
    description: 'Food and restroom demand spikes during interval windows.',
  },
  egress: {
    id: 'egress',
    label: 'Post-Match Egress',
    shortLabel: 'Egress',
    queueWaitMultiplier: 1.12,
    queuePeopleMultiplier: 1.1,
    routeTimeDelta: 1,
    routeCrowdShift: 1,
    densityDelta: 6,
    attendanceMultiplier: 0.94,
    waitMultiplier: 1.2,
    satisfactionDelta: -3,
    description: 'Crowd movement shifts toward exits and transport corridors.',
  },
}

const CROWD_LEVELS = ['low', 'medium', 'high']

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function parseMinutes(value) {
  const parsed = Number.parseInt(String(value), 10)
  return Number.isFinite(parsed) ? parsed : 0
}

function parseDistance(value) {
  const parsed = Number.parseInt(String(value), 10)
  return Number.isFinite(parsed) ? parsed : 0
}

function normalizeCrowd(level) {
  return String(level || 'medium').trim().toLowerCase()
}

function shiftCrowdLevel(level, shift) {
  const index = CROWD_LEVELS.indexOf(normalizeCrowd(level))
  const baseIndex = index === -1 ? 1 : index
  return CROWD_LEVELS[clamp(baseIndex + shift, 0, CROWD_LEVELS.length - 1)]
}

function crowdToColor(level) {
  const map = {
    low: 'emerald',
    medium: 'amber',
    high: 'rose',
  }
  return map[level] || 'amber'
}

function queueCategory(queueName) {
  const name = String(queueName || '').toLowerCase()
  if (name.includes('restroom')) return 'restroom'
  if (name.includes('food') || name.includes('pizza') || name.includes('beer') || name.includes('coffee') || name.includes('ice cream') || name.includes('hot dog')) {
    return 'food'
  }
  if (name.includes('vip')) return 'vip'
  return 'general'
}

export function getScenarioMeta(mode) {
  return SCENARIO_META[mode] || SCENARIO_META.normal
}

export function listScenarios() {
  return Object.values(SCENARIO_META)
}

export function applyScenarioToQueue(queue, mode) {
  const scenario = getScenarioMeta(mode)
  const category = queueCategory(queue.name)

  let waitMultiplier = scenario.queueWaitMultiplier
  let peopleMultiplier = scenario.queuePeopleMultiplier

  if (scenario.id === 'halftime' && (category === 'food' || category === 'restroom')) {
    waitMultiplier += 0.25
    peopleMultiplier += 0.2
  }

  if (scenario.id === 'egress' && category === 'food') {
    waitMultiplier -= 0.2
    peopleMultiplier -= 0.2
  }

  if (scenario.id === 'egress' && category === 'restroom') {
    waitMultiplier += 0.12
  }

  const wait = clamp(Math.round(queue.wait * waitMultiplier), 1, 45)
  const people = clamp(Math.round(queue.people * peopleMultiplier), 1, 999)

  return {
    ...queue,
    wait,
    people,
  }
}

export function applyScenarioToRoutes(routes, mode, destination) {
  const scenario = getScenarioMeta(mode)

  return routes.map((route) => {
    const baseMinutes = parseMinutes(route.time)
    const baseDistance = parseDistance(route.distance)

    let minuteDelta = scenario.routeTimeDelta
    let crowdShift = scenario.routeCrowdShift

    if (scenario.id === 'halftime' && (destination === 'food' || destination === 'restroom')) {
      minuteDelta += 1
      crowdShift += 1
    }

    if (scenario.id === 'egress' && destination === 'exit') {
      if (String(route.name).toLowerCase().includes('least congested') || normalizeCrowd(route.crowd) === 'low') {
        minuteDelta -= 1
        crowdShift -= 1
      } else {
        minuteDelta += 1
      }
    }

    const nextCrowd = shiftCrowdLevel(route.crowd, crowdShift)
    const nextMinutes = clamp(baseMinutes + minuteDelta, 1, 30)
    const nextDistance = clamp(Math.round(baseDistance * (scenario.id === 'egress' ? 1.02 : 1)), 20, 3000)

    return {
      ...route,
      crowd: nextCrowd.charAt(0).toUpperCase() + nextCrowd.slice(1),
      crowdColor: crowdToColor(nextCrowd),
      time: `${nextMinutes} min`,
      distance: `${nextDistance}m`,
    }
  })
}

export function applyScenarioToDensity(density, mode) {
  const scenario = getScenarioMeta(mode)
  return clamp(Math.round(density + scenario.densityDelta), 20, 99)
}

export function applyScenarioToDashboardStats(baseStats, mode) {
  const scenario = getScenarioMeta(mode)
  return {
    crowd: Math.round(baseStats.crowd * scenario.attendanceMultiplier),
    wait: Math.max(1, Math.round(baseStats.wait * scenario.waitMultiplier)),
    capacity: clamp(Math.round(baseStats.capacity + scenario.densityDelta * 0.4), 40, 100),
    satisfaction: clamp(Math.round(baseStats.satisfaction + scenario.satisfactionDelta), 55, 99),
  }
}
