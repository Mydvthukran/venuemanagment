const EN_RESPONSES = {
  default: "I'm sorry, I'm just a demo AI. Try asking about food, restrooms, or parking.",
  food: 'The nearest food court is in Concourse A. You can also order directly to your seat using the Food & Drinks tab!',
  restroom: 'The closest restroom is 40m away in Block D. It currently has a low wait time of 1 minute.',
  parking: "For the quickest exit, use Gate D. It's the least congested right now.",
  greeting: 'Hello there! How can I improve your event experience today?',
  queue: 'I monitor all wait times. The Merchandise store currently has an 18-minute wait, the longest in the venue.',
}

const ES_RESPONSES = {
  default: 'Lo siento, solo soy una IA de demostracion. Intente preguntar sobre comida, banos o estacionamiento.',
  food: 'El patio de comidas mas cercano esta en el Concourse A. Tambien puedes pedir directamente a tu asiento.',
  restroom: 'El bano mas cercano esta a 40 metros en el Bloque D. Actualmente tiene un tiempo de espera de 1 minuto.',
  parking: 'Para una salida mas rapida, usa la Puerta D. Es la menos congestionada en este momento.',
  greeting: 'Hola. Como puedo mejorar tu experiencia en el evento hoy?',
  queue: 'Monitoreo todos los tiempos de espera. La tienda tiene actualmente una espera de 18 minutos.',
}

const INTENT_RULES = [
  { intent: 'food', terms: ['food', 'hungry', 'eat', 'comida'] },
  { intent: 'restroom', terms: ['restroom', 'bathroom', 'toilet', 'bano'] },
  { intent: 'parking', terms: ['exit', 'leave', 'parking', 'salida'] },
  { intent: 'greeting', terms: ['hi', 'hello', 'hola'] },
  { intent: 'queue', terms: ['wait', 'queue', 'linea'] },
]

const INPUT_MAX_LENGTH = 240
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g
const BLOCKLIST_PATTERNS = [
  /<\/?\s*script\b/gi,
  /javascript\s*:/gi,
  /data\s*:\s*text\/html/gi,
  /on[a-z]+\s*=/gi,
]

export function sanitizeUserInput(value) {
  if (typeof value !== 'string') {
    return ''
  }

  let normalized = value.normalize('NFKC').replace(CONTROL_CHARS, ' ').trim()

  BLOCKLIST_PATTERNS.forEach((pattern) => {
    normalized = normalized.replace(pattern, '')
  })

  return normalized
    .replace(/[<>`]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, INPUT_MAX_LENGTH)
}

export function inferIntent(input) {
  const normalized = sanitizeUserInput(input).toLowerCase()

  for (const rule of INTENT_RULES) {
    if (rule.terms.some((term) => normalized.includes(term))) {
      return rule.intent
    }
  }

  return 'default'
}

export function getAssistantResponse(input, lang = 'EN') {
  const intent = inferIntent(input)
  const dictionary = lang === 'ES' ? ES_RESPONSES : EN_RESPONSES

  return {
    intent,
    text: dictionary[intent] || dictionary.default,
  }
}
