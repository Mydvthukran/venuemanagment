import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const hasConfig = Boolean(config.apiKey && config.projectId && config.appId)
let analyticsPromise

function createAnalytics() {
  if (!hasConfig || typeof window === 'undefined') {
    return Promise.resolve(null)
  }

  if (!analyticsPromise) {
    const app = initializeApp(config)
    analyticsPromise = isSupported().then((supported) => {
      if (!supported) {
        return null
      }
      return getAnalytics(app)
    })
  }

  return analyticsPromise
}

export async function trackVenueEvent(name, params = {}) {
  try {
    const analytics = await createAnalytics()
    if (!analytics) {
      return
    }
    logEvent(analytics, name, params)
  } catch {
    // Non-blocking telemetry failure.
  }
}
