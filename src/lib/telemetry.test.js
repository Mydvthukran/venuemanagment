import { describe, expect, it } from 'vitest'
import { sanitizeEventName, sanitizeEventParams, shouldEnableTelemetry } from './telemetry'

describe('telemetry hardening', () => {
  it('accepts known event names and rejects unknown ones', () => {
    expect(sanitizeEventName('food_order_placed')).toBe('food_order_placed')
    expect(sanitizeEventName('unknown_event')).toBeNull()
    expect(sanitizeEventName(42)).toBeNull()
  })

  it('sanitizes event payload strings and nested content', () => {
    const params = sanitizeEventParams({
      item: '<script>alert(1)</script>',
      source: 'javascript:evil()',
      details: {
        lane: 'A1',
        note: 'onerror=alert(1)',
      },
      count: 2,
      enabled: true,
    })

    expect(params.item).toBe('alert(1)')
    expect(params.source).toBe('evil()')
    expect(params.details.note).toBe('alert(1)')
    expect(params.count).toBe(2)
    expect(params.enabled).toBe(true)
  })

  it('drops invalid non-object payloads', () => {
    expect(sanitizeEventParams('foo')).toEqual({})
    expect(sanitizeEventParams(null)).toEqual({})
    expect(sanitizeEventParams(['a', 'b'])).toEqual({})
  })

  it('handles key sanitization and browser context flags', () => {
    const params = sanitizeEventParams({
      '<>': 'should-drop-key',
      okay: ['safe', null, 2],
    })

    expect(params).toHaveProperty('okay')
    expect(params).not.toHaveProperty('<>')
    expect(shouldEnableTelemetry({ isBrowser: false })).toBe(false)
    expect(shouldEnableTelemetry({})).toBe(true)
  })

  it('respects privacy preferences', () => {
    expect(shouldEnableTelemetry({ navigator: { doNotTrack: '1' } })).toBe(false)
    expect(shouldEnableTelemetry({ navigator: { globalPrivacyControl: true } })).toBe(false)
    expect(shouldEnableTelemetry({ navigator: { doNotTrack: '0' } })).toBe(true)
  })
})
