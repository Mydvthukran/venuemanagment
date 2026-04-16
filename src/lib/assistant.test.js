import { describe, expect, it } from 'vitest'
import { getAssistantResponse, inferIntent, sanitizeUserInput } from './assistant'

describe('assistant helpers', () => {
  it('returns empty string for non-string input', () => {
    expect(sanitizeUserInput(null)).toBe('')
    expect(sanitizeUserInput(undefined)).toBe('')
  })

  it('sanitizes potentially unsafe input', () => {
    const value = sanitizeUserInput('  <script>alert(1)</script>  ')
    expect(value).toBe('alert(1)')
  })

  it('removes common injection patterns and control chars', () => {
    const value = sanitizeUserInput('\u0000javascript: open gate onerror=evil()')
    expect(value).toBe('open gate evil()')
  })

  it('infers parking intent from text', () => {
    expect(inferIntent('Where is parking?')).toBe('parking')
  })

  it('returns language-specific response and intent', () => {
    const result = getAssistantResponse('Necesito comida', 'ES')
    expect(result.intent).toBe('food')
    expect(result.text.toLowerCase()).toContain('comidas')
  })

  it('returns default intent for unmatched messages', () => {
    const result = getAssistantResponse('zzzz random signal', 'EN')
    expect(result.intent).toBe('default')
    expect(result.text.toLowerCase()).toContain('demo ai')
  })
})
