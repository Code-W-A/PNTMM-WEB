/**
 * Resetează emulatorii și scrie setul de date pe care se sprijină testele E2E.
 *
 * Rulează întotdeauna înainte de `next build`, ca paginile publice preRandate
 * să conțină deja conținutul semănat.
 */
import { initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { FieldValue, getFirestore } from "firebase-admin/firestore"

import e2eConfig from "./e2e-env.cjs"

const {
  AUTH_HOST,
  E2E_PROJECT_ID,
  E2E_USERS,
  FIRESTORE_HOST,
  assertEmulatorEnv,
  e2eEnv,
} = e2eConfig

// Când scriptul este rulat direct, mediul E2E trebuie aplicat înainte de orice
// inițializare Firebase.
for (const [key, value] of Object.entries(e2eEnv())) {
  process.env[key] = value
}

assertEmulatorEnv()

export const SEED = {
  publishedNews: {
    slug: "seed-stire-publicata",
    title: "Ședință publică a filialei Cluj",
    category: "Comunicate",
  },
  draftNews: {
    slug: "seed-stire-ciorna",
    title: "Ciornă care nu trebuie să apară public",
    category: "Comunicate",
  },
  upcomingEvent: {
    slug: "seed-eveniment-viitor",
    title: "Întâlnire cu cetățenii din Mănăștur",
    location: "Cluj-Napoca",
  },
  pastEvent: {
    slug: "seed-eveniment-trecut",
    title: "Dezbatere despre transportul public",
    location: "Cluj-Napoca",
  },
  newReport: {
    subject: "Groapă pe strada Observatorului",
    name: "Ioana Popescu",
    email: "ioana.popescu@exemplu.test",
  },
  closedReport: {
    subject: "Iluminat public reparat în Zorilor",
    name: "Mihai Ardelean",
    email: "mihai.ardelean@exemplu.test",
  },
  newProposal: {
    title: "Piste de biciclete pe malul Someșului",
    name: "Andrei Muntean",
    email: "andrei.muntean@exemplu.test",
  },
  contactMessage: {
    subject: "Solicitare de informații despre filială",
    name: "Elena Rusu",
    email: "elena.rusu@exemplu.test",
  },
  interestSubmission: {
    firstName: "Radu",
    lastName: "Chindriș",
    email: "radu.chindris@exemplu.test",
    locality: "Florești",
  },
  deletionRequest: {
    email: "de-sters@exemplu.test",
  },
  registrations: [
    { name: "Participant Unu", email: "participant.unu@exemplu.test" },
    { name: "Participant Doi", email: "participant.doi@exemplu.test" },
  ],
}

function daysFromNow(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}

/** Emulatorii nu cer service account, doar un projectId. */
function adminApp() {
  return initializeApp(
    {
      projectId: E2E_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    },
    `e2e-seed-${Date.now()}`,
  )
}

async function resetEmulators() {
  const firestoreReset = fetch(
    `http://${FIRESTORE_HOST}/emulator/v1/projects/${E2E_PROJECT_ID}/databases/(default)/documents`,
    { method: "DELETE" },
  )

  const authReset = fetch(
    `http://${AUTH_HOST}/emulator/v1/projects/${E2E_PROJECT_ID}/accounts`,
    { method: "DELETE" },
  )

  const [firestore, auth] = await Promise.all([firestoreReset, authReset])

  if (!firestore.ok) {
    throw new Error(`Resetarea Firestore a eșuat: ${firestore.status}`)
  }

  if (!auth.ok) {
    throw new Error(`Resetarea Auth a eșuat: ${auth.status}`)
  }
}

async function seedUsers(auth, db) {
  const created = {}

  for (const [key, user] of Object.entries(E2E_USERS)) {
    const record = await auth.createUser({
      email: user.email,
      password: user.password,
      displayName: user.displayName,
      emailVerified: true,
      disabled: Boolean(user.disabled),
    })

    if (user.admin) {
      await auth.setCustomUserClaims(record.uid, { role: "admin" })
    }

    await db
      .collection("users")
      .doc(record.uid)
      .set({
        uid: record.uid,
        email: user.email,
        displayName: user.displayName,
        status: user.disabled ? "disabled" : "active",
        notificationPreferences: { general: true },
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      })

    created[key] = { ...user, uid: record.uid }
  }

  return created
}

async function seedContent(db) {
  const now = FieldValue.serverTimestamp()

  await db
    .collection("news")
    .doc("seed-news-published")
    .set({
      slug: SEED.publishedNews.slug,
      title: SEED.publishedNews.title,
      excerpt:
        "Filiala Cluj a PNȚMM organizează o ședință publică deschisă tuturor locuitorilor interesați.",
      content:
        "Ședința publică are loc la sediul filialei și este deschisă tuturor locuitorilor. " +
        "Ordinea de zi cuprinde raportul de activitate și discuții libere cu participanții.",
      category: SEED.publishedNews.category,
      publishedAt: daysFromNow(-3),
      status: "published",
      createdAt: now,
      updatedAt: now,
    })

  await db
    .collection("news")
    .doc("seed-news-draft")
    .set({
      slug: SEED.draftNews.slug,
      title: SEED.draftNews.title,
      excerpt:
        "Material aflat în lucru, folosit pentru a verifica izolarea ciornelor față de paginile publice.",
      content:
        "Acest text nu trebuie să fie vizibil pe website atât timp cât articolul rămâne ciornă. " +
        "Testele verifică exact acest lucru.",
      category: SEED.draftNews.category,
      publishedAt: daysFromNow(2),
      status: "draft",
      createdAt: now,
      updatedAt: now,
    })

  await db
    .collection("events")
    .doc("seed-event-upcoming")
    .set({
      slug: SEED.upcomingEvent.slug,
      title: SEED.upcomingEvent.title,
      description:
        "Discuție deschisă despre problemele cartierului, cu înscriere prealabilă pentru participanți.",
      startDate: daysFromNow(14),
      location: SEED.upcomingEvent.location,
      address: "Strada Primăverii 10",
      registrationEnabled: true,
      status: "published",
      createdAt: now,
      updatedAt: now,
    })

  await db
    .collection("events")
    .doc("seed-event-past")
    .set({
      slug: SEED.pastEvent.slug,
      title: SEED.pastEvent.title,
      description:
        "Dezbatere încheiată despre transportul public din municipiu și legăturile cu localitățile vecine.",
      startDate: daysFromNow(-30),
      location: SEED.pastEvent.location,
      registrationEnabled: false,
      status: "published",
      createdAt: now,
      updatedAt: now,
    })

  for (const [index, registration] of SEED.registrations.entries()) {
    await db
      .collection("eventRegistrations")
      .doc(`seed-registration-${index + 1}`)
      .set({
        eventId: "seed-event-upcoming",
        eventSlug: SEED.upcomingEvent.slug,
        name: registration.name,
        email: registration.email,
        phone: "0740000000",
        dataMode: "test",
        createdAt: now,
      })
  }
}

async function seedSubmissions(db) {
  const now = FieldValue.serverTimestamp()

  await db
    .collection("reports")
    .doc("seed-report-new")
    .set({
      name: SEED.newReport.name,
      email: SEED.newReport.email,
      subject: SEED.newReport.subject,
      description:
        "Carosabilul este deteriorat pe o porțiune de aproximativ zece metri și pune în pericol bicicliștii.",
      status: "new",
      dataMode: "test",
      createdAt: now,
      updatedAt: now,
    })

  await db
    .collection("reports")
    .doc("seed-report-closed")
    .set({
      name: SEED.closedReport.name,
      email: SEED.closedReport.email,
      subject: SEED.closedReport.subject,
      description:
        "Problema semnalată anterior a fost remediată de operatorul de iluminat public.",
      status: "closed",
      dataMode: "test",
      createdAt: now,
      updatedAt: now,
    })

  await db
    .collection("proposals")
    .doc("seed-proposal-new")
    .set({
      name: SEED.newProposal.name,
      email: SEED.newProposal.email,
      title: SEED.newProposal.title,
      description:
        "Propun extinderea rețelei de piste pentru biciclete pe ambele maluri, cu marcaje și iluminat adecvat.",
      status: "new",
      dataMode: "test",
      createdAt: now,
      updatedAt: now,
    })

  await db
    .collection("contactMessages")
    .doc("seed-contact")
    .set({
      name: SEED.contactMessage.name,
      email: SEED.contactMessage.email,
      subject: SEED.contactMessage.subject,
      message:
        "Aș dori să aflu programul de audiențe și modalitatea de a participa la ședințele publice.",
      dataMode: "test",
      createdAt: now,
    })

  await db
    .collection("interestSubmissions")
    .doc("seed-interest")
    .set({
      firstName: SEED.interestSubmission.firstName,
      lastName: SEED.interestSubmission.lastName,
      email: SEED.interestSubmission.email,
      phone: "0741111111",
      locality: SEED.interestSubmission.locality,
      message:
        "Doresc să mă implic în activitățile de voluntariat organizate de filiala Cluj.",
      dataMode: "test",
      createdAt: now,
    })

  await db
    .collection("deletionRequests")
    .doc("seed-deletion")
    .set({
      email: SEED.deletionRequest.email,
      message: "Solicit ștergerea contului și a datelor asociate.",
      status: "new",
      dataMode: "test",
      createdAt: now,
      updatedAt: now,
    })

  // Fără `pushTokens`: nu există emulator FCM, iar trimiterea de notificări
  // ocolește complet apelul către Firebase când nu există destinatari.
}

export async function seed() {
  assertEmulatorEnv()

  await resetEmulators()

  const app = adminApp()
  const db = getFirestore(app)
  db.settings({ ignoreUndefinedProperties: true })
  const auth = getAuth(app)

  const users = await seedUsers(auth, db)
  await seedContent(db)
  await seedSubmissions(db)

  return users
}

const isDirectRun = process.argv[1]?.endsWith("e2e-seed.mjs")

if (isDirectRun) {
  seed()
    .then((users) => {
      console.log(
        `Seed complet pe ${E2E_PROJECT_ID}: ${Object.keys(users).length} utilizatori și date în 9 colecții.`,
      )
      process.exit(0)
    })
    .catch((error) => {
      console.error("Seed eșuat:", error)
      process.exit(1)
    })
}
