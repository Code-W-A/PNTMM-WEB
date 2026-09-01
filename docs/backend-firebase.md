# Backend Firebase și panou de administrare — PNȚMM Cluj

Documente operaționale:

- [Ghidul panoului de administrare](./ghid-administrare.md)
- [Matricea de acoperire a Anexei 1](./matrice-contractuala.md)

Documentul descrie ce a fost implementat, cum se pornește proiectul și ce
rămâne de configurat manual în Firebase Console. Interfața publică nu a fost
redesenată: paginile existente au fost conectate la date reale.

## Principiul arhitectural

**Toate scrierile trec prin API routes server-side, cu Firebase Admin SDK.
Clientul nu scrie niciodată direct în Firestore sau în Cloud Storage.**

Consecința practică: regulile de securitate pot fi strict restrictive. Browserul
citește doar conținutul publicat, iar SDK-ul client Firebase este folosit exclusiv
pentru autentificarea administratorului. Admin SDK rulează server-side și ocolește
regulile, deci autorizarea este responsabilitatea fiecărui endpoint.

Aceeași suprafață server deservește aplicația Expo din
`../expo-mobile-app`. API-urile mobile folosesc `Authorization: Bearer <idToken>`;
panoul admin continuă să folosească sesiunea HttpOnly.

## Colecții Firestore

| Colecție | Conținut | Citire publică |
| --- | --- | --- |
| `news` | Articole, câmp `status`: `draft` sau `published` | Doar `status == "published"` |
| `events` | Evenimente, cu `registrationEnabled` | Doar `status == "published"` |
| `eventRegistrations` | Înscrieri la evenimente | Nu |
| `reports` | Sesizări, cu cel mult o fotografie | Nu |
| `proposals` | Propuneri | Nu |
| `contactMessages` | Mesaje din formularul de contact | Nu |
| `interestSubmissions` | Formularul „Implică-te” | Nu |
| `deletionRequests` | Cereri de ștergere a contului | Nu |
| `users` | Profiluri de utilizator pentru aplicațiile mobile | Nu |
| `pushTokens` | Tokenuri FCM sau Expo per dispozitiv, cu provider, installationId, UID opțional și stare | Nu |
| `notifications` | Istoricul notificărilor trimise | Nu |
| `adminActions` | Log tehnic minimal al operațiunilor de administrare | Nu |

Fișierele: [firestore.rules](../firestore.rules), [storage.rules](../storage.rules),
[firestore.indexes.json](../firestore.indexes.json).

Indexuri compuse declarate: `news(status, publishedAt)`, `events(status, startDate)`,
`reports(status, createdAt)`, `proposals(status, createdAt)`,
`eventRegistrations(eventId, createdAt)`.

## Endpoint-uri

### Publice — `app/api/forms/*`

`contact`, `interest`, `report`, `proposal`, `deletion-request`,
`event-registration`. Toate primesc `POST`, validează cu aceleași scheme zod
folosite de formularele din interfață ([lib/validation/forms.ts](../lib/validation/forms.ts))
și scriu prin Admin SDK. `report` primește `multipart/form-data` pentru fotografie.

`POST /api/push-tokens` înregistrează un token FCM sau Expo. Tokenul poate fi
asociat contului prin ID token, iar `installationId` dezactivează tokenurile
vechi ale aceleiași instalări. Preferința generală oprită în profil împiedică
reactivarea accidentală.

### Aplicația mobilă — `app/api/mobile/*`

- `GET /api/mobile/bootstrap` — identitate, contact, social și linkuri juridice;
- `GET /api/mobile/news`, `GET /api/mobile/news/[slug]`;
- `GET /api/mobile/events`, `GET /api/mobile/events/[slug]`;
- `GET|PATCH /api/mobile/profile` — protejat prin `requireUser`;
- `GET /api/mobile/event-registrations/[eventId]` — starea înscrierii contului.

`requireUser` verifică ID tokenul Firebase cu revocation check și este separat
de `requireAdmin`: un utilizator mobil autentificat nu dobândește acces la
panoul administrativ. Formularele existente rămân publice pentru website, dar
păstrează `uid` atunci când primesc un Bearer token valid. Înscrierile mobile
folosesc un ID determinist derivat din eveniment și UID, deci sunt idempotente.

### Autentificare

`POST /api/auth/session` schimbă un ID token pe un cookie de sesiune HttpOnly.
`DELETE` face logout și revocă tokenurile de refresh.

### Administrare — `app/api/admin/*`

`news`, `news/[id]`, `events`, `events/[id]`, `users`, `users/[uid]`,
`submissions/[entity]/[id]`, `notifications`, `export/[dataset]`.

Fiecare endpoint trece prin garda `requireAdmin` înainte de orice operațiune.
Garda acceptă cookie de sesiune sau header `Authorization: Bearer`, verifică
revocarea tokenului și cere claim-ul de administrator. Răspunde `401` sau `403`,
fără detalii interne.

## Panoul de administrare

Rutele publice au fost mutate în grupul `app/(site)`, iar panoul este la `/admin`.
URL-urile publice nu s-au schimbat. Panoul este marcat `noindex` și blocat în
[app/robots.ts](../app/robots.ts).

Secțiuni: dashboard cu numărători, Știri și Evenimente cu CRUD complet și slug
unic validat server-side, participanți per eveniment, Sesizări și Propuneri cu
detaliu și schimbare de status, Utilizatori cu dezactivare aplicată în Firebase
Auth prin `updateUser({ disabled })`, Formulare website și Notificări.

Textele paginilor Acasă, Despre noi, Contact, Implică-te și ale paginilor
juridice sunt statice, versionate în cod. Nu există colecție Firestore, rută API
sau modul CMS pentru acestea; este o excepție de produs confirmată față de
formularea inițială din Anexa 1.

Fotografia unei sesizări se vede doar printr-un URL semnat generat la cerere, cu
expirare scurtă. Bucket-ul nu este public.

## Variabile de mediu

Numele complete sunt în [.env.example](../.env.example). Rezumat:

- `NEXT_PUBLIC_SITE_URL` — domeniul oficial, fără slash final.
- `NEXT_PUBLIC_FIREBASE_*` — configurația SDK-ului client. Nu sunt secrete.
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`,
  `FIREBASE_STORAGE_BUCKET` — **secrete**, exclusiv server-side. Nu se prefixează
  niciodată cu `NEXT_PUBLIC_`.
- `NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY` și `APPCHECK_MODE` — App Check.
  Aplicația Expo folosește momentan API-ul server-side fără un token nativ App
  Check; păstrați `monitor` până când atestarea nativă este configurată și
  validată pe ambele platforme.
- `EXPO_ACCESS_TOKEN` — secret server-side opțional pentru proiectele EAS cu
  Expo Push security activat.
- `NEXT_PUBLIC_FORMS_ENABLED` — activează trimiterea formularelor din interfață.
- `REAL_DATA_COLLECTION_ENABLED` — poarta pentru date reale.

Separarea dev/prod se face prin **proiecte Firebase distincte**, selectate din
environment. Nu există ramificări în cod după mediu.

Pe Vercel, secretele se adaugă în Project Settings > Environment Variables,
separat pentru Preview și Production.

## Poarta pentru date reale

`REAL_DATA_COLLECTION_ENABLED=true` este configurația implicită: trimiterile sunt
tratate ca date reale, fără marcaj de test și fără avertisment în interfață.

Pe `false`, formularele funcționează și persistă la fel, dar documentele primesc
`dataMode: "test"` și interfața anunță că fluxul este în testare. Recomandarea este
să rămână `false` doar în mediul de development, ca datele de probă să nu se
amestece cu cele reale. Poarta nu este expusă ca opțiune în panou: se schimbă doar
din environment.

## Rularea locală

```bash
npm install
cp .env.example .env.local   # completați valorile proiectului de development
npm run dev
```

Fără credențiale Admin SDK, aplicația pornește și afișează datele mock, iar
formularele semnalează că backendul nu este configurat. Nimic nu se blochează.
Pentru development, puneți `REAL_DATA_COLLECTION_ENABLED=false` în `.env.local`.

Aplicația mobilă pornește separat:

```bash
cd ../expo-mobile-app
cp .env.example .env
npm install
npm run start
```

Variabilele `EXPO_PUBLIC_FIREBASE_*` sunt configurație publică, iar
`EXPO_PUBLIC_EAS_PROJECT_ID` este UUID-ul proiectului EAS. Niciun service account
sau `EXPO_ACCESS_TOKEN` nu intră în bundle-ul mobil. Pentru notificări pe
Android este necesar un development build sau un build instalabil, nu Expo Go.

Primul administrator se creează în Console (Authentication > Users), apoi:

```bash
npm run admin:grant -- persoana@exemplu.ro
npm run admin:grant -- persoana@exemplu.ro --revoke
```

Scriptul acceptă email sau UID, revocă tokenurile de refresh ca noile drepturi să
intre imediat în vigoare și citește credențialele din environment, niciodată din cod.

### Emulatori

```bash
npm run emulators
```

Emulatorul Firestore are nevoie de JDK 21 sau mai nou. Dacă `java` nu este în
`PATH`, exportați `JAVA_HOME` înainte de comandă.

## Teste

```bash
npm run lint
npm run typecheck
npm run build
npm test            # teste unitare Next.js, inclusiv auth/profil/ID idempotent
npm run test:rules  # 43 de teste de reguli, necesită emulatorul pornit
npm run test:e2e    # 114 teste Playwright, inclusiv fluxurile API mobile
```

Testele de reguli acoperă scenariile din specificație: conținutul publicat este
vizibil, ciornele nu, iar sesizările, propunerile, mesajele de contact,
formularele de interes, participanții și profilurile de utilizator nu pot fi
citite din client — nici măcar de un cont autentificat cu claim de administrator,
pentru că drepturile se verifică server-side.

Regulile Cloud Storage au propriul fișier de teste. Modelul este mai strict:
bucket-ul nu are niciun folder public, iar fotografia unei sesizări nu poate fi
citită, încărcată, suprascrisă, ștearsă sau listată din client, indiferent de
autentificare. Fișierul de test se seamănă cu regulile dezactivate, ca refuzurile
să fie dovedit cauzate de reguli, nu de un obiect inexistent.

### Teste E2E

`npm run test:e2e` pornește emulatorii pe proiectul `demo-pntmm-e2e`, golește
Firestore și Auth, seamănă datele din `scripts/e2e-seed.mjs`, face un build de
producție în `.next-e2e` și rulează Playwright pe portul 3100. Buildul real și
`.next` nu sunt atinse, iar prefixul `demo-` plus verificarea din
`assertEmulatorEnv` garantează că suita nu poate scrie în `pntmm-cluj-web`.

Suita folosește același emulator Firestore ca testele de reguli, iar
`firebase.json` are `singleProjectMode: true`, deci **cele două nu se rulează
simultan**. Testele de reguli au nevoie de `npm run emulators` pornit separat;
`npm run test:e2e` își pornește și își oprește singur emulatorii.

Câteva argumente utile: `npm run test:e2e -- e2e/specs/news-crud.spec.ts` pentru
un singur fișier, `npm run test:e2e:ui` pentru modul interactiv și
`npm run e2e:seed` pentru resemănat fără rebuild, cu emulatorii deja porniți.

## Starea proiectului Firebase

Cont: **`webdynamicx@gmail.com`**  
Proiect: **`pntmm-cluj-web`** — <https://console.firebase.google.com/project/pntmm-cluj-web/overview>

(Proiectul vechi `pntmm-cluj` din contul `nrgsistemedeacces@gmail.com` nu mai este
folosit de aplicație. Poate fi șters din acel cont dacă nu mai e necesar.)

Configurat și verificat:

- Baza Firestore în **`eur3`** (multi-regiune Europa). Regiunea este definitivă.
- Regulile din `firestore.rules` publicate în proiect.
- Indexurile din `firestore.indexes.json` publicate (pot fi `CREATING` câteva
  minute după deploy, apoi `READY`).
- Aplicația web înregistrată, cu configurația SDK completată în `.env.local`.
- Cheie de service account generată și scrisă în `.env.local`. Fișierul JSON
  temporar a fost șters după extragere.
- `npm run backend:check` confirmă conexiunea Admin SDK.

Neconfigurat încă, pentru că depinde de planul Blaze sau de Console:

- Authentication nu este inițializat, deci nu se poate face login în `/admin`.
- Cloud Storage nu are bucket, deci fotografiile sesizărilor nu funcționează.
- App Check nu are cheie reCAPTCHA.

## Ce rămâne obligatoriu manual în Console

Aceste configurări nu pot fi făcute din repository:

1. **Planul Blaze**, necesar pentru Cloud Storage și pentru Identity Platform.
2. **Inițializarea Authentication**: Console > Authentication > Get started, apoi
   activarea furnizorului Email/parolă. API-ul refuză să creeze configurația
   înainte de acest pas.
3. **Crearea bucket-ului Storage** în regiune europeană, apoi
   `firebase deploy --only storage` pentru publicarea regulilor.
4. **Contul de administrator**: Authentication > Users > Add user, apoi
   `npm run admin:grant -- adresa@exemplu.ro`.
5. **Backup zilnic Firestore** cu retenție de 14 zile: Firestore > Backups >
   Create schedule, frecvență zilnică.
6. **Soft delete pe Cloud Storage**, 14 zile: bucket > Protection > Soft delete policy.
7. **MFA pentru conturile de administrator**: Authentication > Settings >
   Multi-factor authentication.
8. **App Check** cu reCAPTCHA v3 pentru web, în modul monitorizare la început.
   Enforcement-ul se activează după ce metricile arată trafic legitim.
9. **Domeniile autorizate** pentru Authentication, inclusiv domeniul de producție.
10. **Secretele în Vercel**: aceleași variabile ca în `.env.local`, cu
    `REAL_DATA_COLLECTION_ENABLED=true` pe Production.

Niciunul dintre acești pași nu este simulat în cod și niciunul nu este raportat
ca activ.

## Limite cunoscute

Recepția efectivă a notificărilor nu poate fi validată până la configurarea
proiectului EAS, a aplicațiilor native Firebase și a credențialelor APNs/FCM.
Codul separă destinatarii Expo de FCM, trimite în loturi și păstrează
receipt-urile Expo. La următoarea trimitere manuală, receipt-urile disponibile
sunt reconciliate, iar tokenurile `DeviceNotRegistered` sunt dezactivate.

## Excluderi respectate

Fără plăți, donații, cotizații, chat, comentarii, forum, feed social, CRM,
marketing automation, analytics predictive, SSO extern, sincronizare de calendar
sau publicare automată a sesizărilor și propunerilor. Fără câmpuri pentru CNP,
acte de identitate, date medicale sau biometrice. Fără texte juridice, persoane
sau conținut PNȚMM inventate: unde textul lipsește, interfața afișează explicit
că urmează să fie completat din panou.
