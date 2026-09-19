import { db } from '../config/firebase.js'

const run = async () => {
  console.log('--- INSPECCIONANDO GOOGLE CLOUD FIRESTORE (parkingflow-ferch) ---')
  const collections = await db.listCollections()
  console.log('Colecciones disponibles:', collections.map(c => c.id))

  for (const col of collections) {
    const snap = await col.get()
    console.log(`\nColección '${col.id}' (${snap.size} documentos en total):`)
    snap.forEach(doc => {
      console.log(`  - [${doc.id}]:`, JSON.stringify(doc.data()))
    })
  }
}

run().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
