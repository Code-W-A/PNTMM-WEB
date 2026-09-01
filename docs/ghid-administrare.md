# Ghid scurt de administrare — PNȚMM Cluj

Acest ghid acoperă operațiunile uzuale incluse în MVP. Panoul este disponibil
la `/admin` și poate fi folosit numai de conturi Firebase cu drept de
administrator. Fiecare administrator folosește un cont individual; parolele nu
se partajează și nu sunt vizibile în panou.

## Autentificare și navigare

1. Deschideți `/admin/login` și autentificați-vă cu emailul și parola contului
   administrativ.
2. Folosiți meniul lateral pentru Panou, Știri, Evenimente, Sesizări,
   Propuneri, Formulare website, Notificări și Utilizatori.
3. La terminarea lucrului folosiți „Ieșire din cont”. Nu lăsați sesiunea
   deschisă pe un dispozitiv partajat.

Textele paginilor Acasă, Despre noi, Contact, Implică-te și paginile juridice
sunt statice și se modifică printr-o versiune nouă a codului. Panoul nu conține
un editor general al website-ului. Știrile și evenimentele se administrează
separat din modulele lor.

## Știri și anunțuri

- „Știre nouă” deschide formularul de creare. Titlul, slug-ul, rezumatul,
  conținutul, categoria și data publicării sunt obligatorii conform validării.
- `Ciornă` păstrează articolul numai în panou; `Publicat` îl face vizibil pe
  website și în aplicația mobilă.
- Din pagina de detaliu puteți edita sau șterge articolul. Ștergerea cere
  confirmare și nu poate fi anulată din panou.

## Evenimente și participanți

- Evenimentul include titlu, descriere, dată, locație și opțiunea de activare a
  înscrierilor.
- Numai evenimentele `Publicat` sunt vizibile public. Oprirea înscrierilor
  păstrează evenimentul vizibil, dar închide formularul de participare.
- „Participanți” afișează înscrierile și sursa lor. Exportul CSV include UID-ul
  pentru înscrierile provenite din aplicația mobilă.

## Utilizatori

- Lista poate fi căutată după nume, email sau UID și filtrată după stare.
- „Dezactivează” oprește autentificarea și revocă sesiunile contului. Acțiunea
  nu șterge datele existente și poate fi anulată prin „Reactivează”.
- Parolele utilizatorilor nu sunt și nu pot fi afișate.

## Sesizări, propuneri și formulare

- Sesizările și propunerile sunt private. Statusul poate fi `Nou`, `În lucru`
  sau `Închis`.
- Fotografia unei sesizări se deschide printr-un link temporar; nu copiați sau
  distribuiți linkul.
- „Formulare website” conține mesajele de contact, formularele de interes și
  cererile de ștergere. Cererea de ștergere inițiază un proces administrativ;
  contul nu este șters automat.

## Notificări

1. Introduceți titlul și mesajul.
2. Verificați textul în dialogul de confirmare.
3. Confirmați trimiterea. Notificarea ajunge numai la dispozitive eligibile și
   nu poate fi retrasă după expediere.

Nu introduceți segmentare sensibilă, date personale sau mesaje destinate unui
singur utilizator. Istoricul afișează starea și numărul de livrări acceptate de
serviciile push.

## Exporturi și incidente

- Exporturile CSV sunt disponibile pentru utilizatori, participanți,
  sesizări și propuneri. Fișierele conțin date personale și trebuie păstrate
  numai cât este necesar.
- Pentru un cont compromis, dezactivați-l și anunțați imediat persoana tehnică
  desemnată. Nu transmiteți chei Firebase, parole sau fișiere exportate prin
  canale publice.
