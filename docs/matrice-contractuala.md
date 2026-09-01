# Matrice Anexa 1 — implementare și verificare

Matricea urmărește cerințele din
`Contract_Ecosistem_Digital_Luca_Romulus_03.08.2026 (2).docx`. Statutul
Stările de verificare sunt:

- **Verificat automat** — există teste locale care trec;
- **Verificat prin compilare/configurație** — codul, bundle-ul sau configurația
  generată au fost validate fără lansarea pe telefon;
- **Necesită dispozitiv real** — recepția depinde de iOS/Android, APNs/FCM ori
  credențiale externe.

## A. Aplicații mobile iOS și Android

| Cerință | Statut verificare | Dovadă principală |
| --- | --- | --- |
| Conturi: înregistrare, login, resetare și profil | Verificat automat | Jest: vizitator/autentificat, persistență, erori, cont dezactivat, profil și logout; API mobil acoperit de Vitest/Playwright |
| Știri și anunțuri | Verificat automat | Liste, detalii, loading/empty/error/retry și `GET /api/mobile/news*` |
| Calendar evenimente și participare | Verificat automat | Viitoare/trecute, detaliu, profil precompletat, participare idempotentă și export cu UID |
| Notificări generale | Verificat automat + necesită dispozitiv real | Activare/sync/dezactivare/logout prin mock-uri; recepția APNs/FCM rămâne pe telefon |
| Sesizare privată cu maximum o fotografie | Verificat automat + necesită dispozitiv real | Permisiuni mock, JPG/PNG/WebP, compresie, 5 MB, `FormData` și Storage privat; camera reală rămâne pe telefon |
| Propuneri și inițiative private | Verificat automat | Formular autentificat, validare, UID și acces exclusiv în admin |
| Contact rapid | Verificat automat | Date, canale și formular fără cont, cu succes și eroare |
| Confidențialitate și control | Verificat automat | Preferințe push, cerere de ștergere și linkuri juridice |

Verificare mobilă: 14 suite / 92 teste Jest, coverage 90,76% lines, 22
aserțiuni de configurație, prebuild temporar și exporturi Metro iOS/Android.
Detalii în `../../expo-mobile-app/docs/raport-verificare-locala-2026-08-18.md`.

## B. Panou web de administrare

| Cerință | Statut verificare | Dovadă principală |
| --- | --- | --- |
| Autentificare și acces controlat | Verificat automat | Sesiune HttpOnly, `requireAdmin`, 401/403 și verificare claim |
| Listare, căutare și stare utilizatori | Verificat automat | Listă Firebase Auth, filtre, dezactivare/reactivare și revocarea sesiunii |
| CRUD știri | Verificat automat | Modul admin, API protejat, slug unic și ciornă/publicat |
| CRUD evenimente și participanți | Verificat automat | Modul admin, listă, participare idempotentă și export |
| Notificări generale | Verificat automat + necesită dispozitiv real | Confirmare, Expo/FCM și token expirat; livrarea efectivă rămâne externă |
| Sesizări/propuneri și status simplu | Verificat automat | Liste, detalii și status `nou/în lucru/închis` |
| Actualizarea conținutului general al website-ului | Excepție confirmată | Textele rămân statice; nu există CMS sau colecție Firestore dedicată |
| Export CSV | Verificat automat | Utilizatori, participanți, sesizări și propuneri, inclusiv UID |

## C. Website responsive

| Pagină/flux | Statut verificare |
| --- | --- |
| Acasă: mesaj, proiecte, evenimente și informații | Verificat automat |
| Despre proiect/organizație | Verificat automat; conținut static |
| Arhivă și detaliu știri | Verificat automat |
| Calendar, detaliu și înscriere la evenimente | Verificat automat |
| Implică-te / formular de interes | Verificat automat |
| Sesizări și propuneri private | Verificat automat |
| Contact, formular și rețele sociale | Verificat automat |
| Confidențialitate, termeni și ștergere cont | Verificat automat; textele juridice rămân draft până la aprobarea operatorului |

## D–E. Livrabile și recepție

| Element | Statut |
| --- | --- |
| Sursă și configurație Expo iOS/Android | Verificat prin bundle/prebuild/configurație, fără secrete |
| Website, admin, API, model Firebase și reguli | Verificat automat și prin build local |
| Documentație administrativă | Inclusă în `docs/ghid-administrare.md` |
| Builduri semnate și instalare pe dispozitive | Necesită dispozitiv real și credențiale EAS/Apple/Google |
| Recepția unei notificări pe telefon | Necesită dispozitiv real, APNs/FCM și development/production build |
| Transmiterea pachetelor și metadatelor | Necesită acces extern; structura tehnică este pregătită în proiectul Expo |
| Sesiunea de instruire de maximum 90 minute | Operațională, se programează la predare |

## F. Excluderi

Nu sunt implementate plăți, donații, cotizații, reclame, abonamente, targetare
sensibilă, chat, comentarii, forum, rețea socială, publicarea automată a
sesizărilor, CRM extern, sincronizare calendar, tabletă/iPad, smartwatch,
desktop sau PWA.
