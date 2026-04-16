const ALLOWED_EVENTS = new Set([
  'assistant_message_sent',
  'assistant_reply_generated',
  'page_view',
  'dashboard_vr_opened',
  'dashboard_vr_closed',
  'dashboard_network_pinged',
  'navigation_destination_selected',
  'navigation_strategy_changed',
  'navigation_started',
  'ar_navigation_opened',
  'ar_navigation_closed',
  'queues_refreshed',
  'virtual_queue_joined',
  'food_item_added',
  'food_order_placed',
  'notifications_marked_read',
  'scenario_mode_changed',
  'scenario_report_downloaded',
  'impact_commander_toggled',
  'impact_queue_drilldown',
  'impact_view_changed',
  'map_zone_selected',
  'map_simulation_toggled',
  'map_navigate_to_zone',
])

const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g
const BLOCKLIST = [
  /javascript\s*:/gi,
  /data\s*:\s*text\/html/gi,
  /on[a-z]+\s*=/gi,
  /<\/?\s*script\b/gi,
]

function sanitizeString(value, maxLength = 120) {
  let output = String(value)

  BLOCKLIST.forEach((pattern) => {
    output = output.replace(pattern, '')
  })

  return output
    .replace(CONTROL_CHARS, ' ')
    .replace(/[<>`]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, maxLength)
}

function sanitizeValue(value) {
  if (typeof value === 'string') {
    return sanitizeString(value)
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'boolean') {
    return value
  }

  if (Array.isArray(value)) {
    return value.slice(0, 6).map((entry) => sanitizeValue(entry)).filter((entry) => entry !== null)
  }

  if (value && typeof value === 'object') {
    const clean = {}
    const entries = Object.entries(value).slice(0, 10)

    for (const [key, entryValue] of entries) {
      const safeKey = sanitizeString(key, 40)
      if (!safeKey) {
        continue
      }

      const safeValue = sanitizeValue(entryValue)
      if (safeValue !== null && safeValue !== '') {
        clean[safeKey] = safeValue
      }
    }

    return clean
  }

  return null
}

export function sanitizeEventName(name) {
  if (typeof name !== 'string') {
    return null
  }

  const safeName = sanitizeString(name, 60).toLowerCase().replace(/\s+/g, '_')
  if (!ALLOWED_EVENTS.has(safeName)) {
    return null
  }

  return safeName
}

export function sanitizeEventParams(params) {
  if (!params || typeof params !== 'object') {
    return {}
  }

  const safeParams = sanitizeValue(params)
  if (!safeParams || Array.isArray(safeParams) || typeof safeParams !== 'object') {
    return {}
  }

  return safeParams
}

export function shouldEnableTelemetry(context = {}) {
  const nav = context.navigator ?? (typeof navigator !== 'undefined' ? navigator : undefined)

  if (context.isBrowser === false) {
    return false
  }

  if (!nav) {
    return true
  }

  const dnt = String(nav.doNotTrack || nav.msDoNotTrack || '').toLowerCase()
  const gpc = nav.globalPrivacyControl === true

  if (dnt === '1' || dnt === 'yes' || gpc) {
    return false
  }

  return true
}
