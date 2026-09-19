import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { env } from './env.js'

export const isFirebaseConfigured = Boolean(
  env.FIREBASE_PROJECT_ID &&
  env.FIREBASE_CLIENT_EMAIL &&
  env.FIREBASE_PRIVATE_KEY &&
  !env.FIREBASE_PRIVATE_KEY.includes('mock') &&
  env.FIREBASE_PRIVATE_KEY.length > 500
)

if (isFirebaseConfigured && getApps().length === 0) {
  try {
    initializeApp({
      credential: cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    })
  } catch {
    initializeApp({
      projectId: env.FIREBASE_PROJECT_ID,
    })
  }
} else if (getApps().length === 0) {
  initializeApp({
    projectId: env.FIREBASE_PROJECT_ID || 'parking-flow-dev',
  })
}

export const db = getFirestore()

