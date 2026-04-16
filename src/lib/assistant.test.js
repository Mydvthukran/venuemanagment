import { describe, expect, it } from 'vitest'
import { getAssistantResponse, inferIntent, sanitizeUserInput } from './assistant'

describe('assistant helpers', () => {
  it('sanitizes potentially unsafe input', () => {
    const value = sanitizeUserInput('  <script>alert(1)</script>  ')
    expect(value).toBe('scriptalert(1)/script')
  })

  it('infers parking intent from text', () => {
    expect(inferIntent('Where is parking?')).toBe('parking')
  })

  it('returns language-specific response and intent', () => {
    const result = getAssistantResponse('Necesito comida', 'ES')
    expect(result.intent).toBe('food')
    expect(result.text.toLowerCase()).toContain('comidas')
  })
})
