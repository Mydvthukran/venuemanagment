import { sanitizeEventName, sanitizeEventParams, shouldEnableTelemetry } from '../lib/telemetry'

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
let firebaseModulesPromise

function getFirebaseModules() {
  if (!firebaseModulesPromise) {
    firebaseModulesPromise = Promise.all([
      import('firebase/app'),
      import('firebase/analytics'),
    ])
  }

  return firebaseModulesPromise
}

async function createAnalytics() {
  if (!hasConfig || typeof window === 'undefined' || !shouldEnableTelemetry()) {
    return Promise.resolve(null)
  }

  if (!analyticsPromise) {
    analyticsPromise = getFirebaseModules().then(async ([appSdk, analyticsSdk]) => {
      const app = appSdk.initializeApp(config)
      const supported = await analyticsSdk.isSupported()
      if (!supported) {
        return null
      }
      return analyticsSdk.getAnalytics(app)
    })
  }

  return analyticsPromise
}

export async function trackVenueEvent(name, params = {}) {
  const safeName = sanitizeEventName(name)
  if (!safeName) {
    return
  }

  const safeParams = sanitizeEventParams(params)

  try {
    const analytics = await createAnalytics()
    if (!analytics) {
      return
    }

    const [, analyticsSdk] = await getFirebaseModules()
    analyticsSdk.logEvent(analytics, safeName, safeParams)
  } catch {
    // Non-blocking telemetry failure.
  }
}
