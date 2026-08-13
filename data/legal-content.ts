/**
 * Documentele juridice ale site-ului public.
 *
 * Textele sunt redactate pe fluxurile reale de date ale aplicației: colecțiile
 * Firestore din `lib/firebase/collections.ts`, câmpurile din `types/firestore.ts`
 * și fotografia sesizării din `lib/storage/report-photo.ts`. Orice modificare a
 * formularelor sau a colecțiilor trebuie reflectată și aici.
 *
 * Ambele documente sunt marcate ca proiect până la aprobarea juridică. Scoaterea
 * `draftNotice` este pasul prin care documentul devine versiune publicată.
 */

export interface LegalSection {
  title: string
  paragraphs: string[]
  /** Enumerare afișată sub paragrafe, pentru liste de date sau de drepturi. */
  items?: string[]
}

export interface LegalDocumentContent {
  updatedAt: string
  /** Prezent cât timp documentul nu a fost aprobat; absent după aprobare. */
  draftNotice?: string
  intro: string[]
  sections: LegalSection[]
}

const OPERATOR =
  "Partidul Național Țărănesc Maniu-Mihalache (PNȚMM), CIF 36798702, " +
  "cu sediul central în Calea Victoriei nr. 155, Bl. D1, Tronson VI (Sc. VI), " +
  "Et. II, București"

const DRAFT_NOTICE =
  "Document în lucru. Textul este redactat pe baza prelucrărilor efective de " +
  "date ale acestui website și așteaptă verificarea și aprobarea " +
  "reprezentanților organizației înainte de a fi considerat versiune finală."

export const privacyPolicy: LegalDocumentContent = {
  updatedAt: "13 august 2026",
  draftNotice: DRAFT_NOTICE,
  intro: [
    `Această politică explică ce date cu caracter personal colectăm prin ` +
      `intermediul acestui website, în ce scop le folosim, cine le poate ` +
      `accesa și ce drepturi aveți asupra lor.`,
    `Operatorul datelor este ${OPERATOR}, prin organizația județeană Cluj.`,
  ],
  sections: [
    {
      title: "1. Cine prelucrează datele",
      paragraphs: [
        `Operatorul este ${OPERATOR}. Website-ul este administrat de ` +
          `organizația județeană Cluj a partidului.`,
        "Pentru orice solicitare privind datele dumneavoastră ne puteți scrie " +
          "la contact@pntmm.ro sau ne puteți suna la +40 727 374 129, de luni " +
          "până vineri, între 09:00 și 16:00.",
      ],
    },
    {
      title: "2. Ce date colectăm și prin ce formulare",
      paragraphs: [
        "Colectăm exclusiv datele pe care ni le transmiteți dumneavoastră prin " +
          "formularele website-ului. Nu cumpărăm liste de contacte și nu " +
          "preluăm date din alte surse.",
      ],
      items: [
        "Formularul de contact: nume, adresă de email, subiect și mesaj.",
        "Formularul de propuneri: nume, adresă de email, titlul propunerii și descrierea acesteia.",
        "Formularul de sesizări: nume, adresă de email, subiect, descriere și, opțional, o fotografie atașată.",
        "Formularul de implicare: nume, prenume, adresă de email, opțional număr de telefon și localitate, precum și mesajul dumneavoastră.",
        "Înscrierea la evenimente: nume, adresă de email și, opțional, număr de telefon.",
        "Cererea de ștergere a contului: adresa de email și, opțional, un mesaj explicativ.",
      ],
    },
    {
      title: "3. Scopurile și temeiul juridic al prelucrării",
      paragraphs: [
        "Folosim datele numai pentru a răspunde solicitării pentru care ni " +
          "le-ați trimis: pentru a vă răspunde la mesaj, pentru a analiza o " +
          "sesizare sau o propunere, pentru a vă înscrie la un eveniment sau " +
          "pentru a da curs cererii de ștergere.",
        "Temeiul juridic este consimțământul dumneavoastră, exprimat prin " +
          "bifarea acordului la trimiterea formularului, potrivit art. 6 " +
          "alin. (1) lit. (a) din Regulamentul (UE) 2016/679.",
        "Formularul de implicare poate dezvălui opinii politice, categorie " +
          "specială de date. În acest caz prelucrarea se face exclusiv pe baza " +
          "consimțământului explicit, potrivit art. 9 alin. (2) lit. (a) din " +
          "Regulament, și numai în scopul contactării dumneavoastră privind " +
          "activitatea organizației.",
        "Nu folosim datele pentru profilare, pentru decizii automate și nu le " +
          "vindem către terți.",
      ],
    },
    {
      title: "4. Cine are acces la date",
      paragraphs: [
        "Mesajele și formularele nu sunt publice. Ele pot fi citite numai din " +
          "panoul de administrare, de persoanele autorizate ale organizației, " +
          "care se autentifică cu cont individual.",
        "Regulile de securitate ale bazei de date resping orice încercare de " +
          "citire directă din browser, inclusiv pentru conturile de " +
          "administrare: accesul se face doar prin server, după verificarea " +
          "drepturilor.",
      ],
    },
    {
      title: "5. Fotografiile atașate sesizărilor",
      paragraphs: [
        "Fotografia pe care o atașați unei sesizări este stocată privat. Nu " +
          "există niciun folder public și nu se generează un link permanent.",
        "Pentru analiza sesizării, persoana autorizată vede imaginea printr-un " +
          "link temporar, generat la cerere și cu valabilitate scurtă. " +
          "Recomandăm să nu includeți în fotografii persoane identificabile " +
          "sau documente cu date personale care nu sunt necesare sesizării.",
      ],
    },
    {
      title: "6. Furnizorii care ne ajută să funcționăm",
      paragraphs: [
        "Pentru găzduirea website-ului și stocarea datelor folosim furnizori " +
          "care acționează ca persoane împuternicite și prelucrează datele " +
          "numai potrivit instrucțiunilor noastre.",
        "Baza de date este configurată în regiunea europeană a furnizorului. " +
          "Acolo unde un furnizor poate prelucra date în afara Spațiului " +
          "Economic European, transferul se face pe baza clauzelor " +
          "contractuale standard aprobate de Comisia Europeană.",
      ],
      items: [
        "Google Ireland Limited, prin serviciile Firebase: baza de date, stocarea fișierelor, autentificarea și notificările.",
        "Vercel Inc., pentru găzduirea și livrarea website-ului.",
      ],
    },
    {
      title: "7. Cât timp păstrăm datele",
      paragraphs: [
        "Păstrăm datele doar atât cât este necesar pentru scopul în care ne-au " +
          "fost transmise, după care le ștergem. Termenele propuse sunt " +
          "următoarele și pot fi ajustate la aprobarea documentului.",
        "Dacă vă retrageți consimțământul mai devreme, ștergem datele fără să " +
          "așteptăm împlinirea acestor termene, cu excepția situațiilor în " +
          "care legea ne obligă să le păstrăm.",
      ],
      items: [
        "Mesajele de contact: 12 luni de la primire.",
        "Sesizările și propunerile: 24 de luni de la închiderea lor.",
        "Înscrierile la evenimente: 12 luni de la data evenimentului.",
        "Formularele de implicare: până la retragerea consimțământului sau cel mult 24 de luni de la ultimul contact.",
        "Cererile de ștergere: 36 de luni, ca dovadă a soluționării cererii.",
      ],
    },
    {
      title: "8. Drepturile dumneavoastră",
      paragraphs: [
        "Potrivit Regulamentului general privind protecția datelor, aveți " +
          "următoarele drepturi, pe care le puteți exercita gratuit, scriindu-ne " +
          "la contact@pntmm.ro.",
        "Pentru ștergerea unui cont și a datelor asociate puteți folosi direct " +
          "formularul dedicat din pagina de ștergere a contului. Vă vom " +
          "contacta pe adresa indicată pentru a confirma identitatea înainte de " +
          "a procesa cererea.",
        "Dacă apreciați că v-am încălcat drepturile, vă puteți adresa " +
          "Autorității Naționale de Supraveghere a Prelucrării Datelor cu " +
          "Caracter Personal, B-dul G-ral. Gheorghe Magheru nr. 28-30, " +
          "Sector 1, București, sau instanței de judecată competente.",
      ],
      items: [
        "Dreptul de acces la datele pe care le deținem despre dumneavoastră.",
        "Dreptul de rectificare a datelor inexacte sau incomplete.",
        "Dreptul la ștergerea datelor.",
        "Dreptul la restricționarea prelucrării.",
        "Dreptul de a vă opune prelucrării.",
        "Dreptul la portabilitatea datelor.",
        "Dreptul de a vă retrage oricând consimțământul, fără ca acest lucru să afecteze legalitatea prelucrării de dinainte de retragere.",
      ],
    },
    {
      title: "9. Cookie-uri",
      paragraphs: [
        "Paginile publice ale acestui website nu folosesc cookie-uri de " +
          "analiză, de publicitate sau de urmărire a comportamentului.",
        "Un singur cookie strict necesar este folosit în panoul de " +
          "administrare, pentru a menține sesiunea persoanelor autentificate. " +
          "El nu este setat pentru vizitatorii site-ului public.",
      ],
    },
    {
      title: "10. Securitatea datelor",
      paragraphs: [
        "Traficul website-ului este criptat. Datele trimise prin formulare sunt " +
          "validate atât în browser, cât și pe server, iar scrierea în baza de " +
          "date se face exclusiv prin server.",
        "Accesul la panoul de administrare este permis numai conturilor cărora " +
          "li s-a acordat explicit acest drept, iar drepturile sunt verificate " +
          "la fiecare cerere.",
      ],
    },
    {
      title: "11. Modificări ale acestei politici",
      paragraphs: [
        "Putem actualiza această politică atunci când se schimbă modul în care " +
          "prelucrăm datele. Versiunea în vigoare este întotdeauna cea publicată " +
          "pe această pagină, iar data ultimei actualizări este afișată la " +
          "începutul documentului.",
      ],
    },
  ],
}

export const termsAndConditions: LegalDocumentContent = {
  updatedAt: "13 august 2026",
  draftNotice: DRAFT_NOTICE,
  intro: [
    "Acești termeni stabilesc condițiile în care puteți folosi website-ul " +
      "organizației. Prin navigarea pe site și prin trimiterea unui formular " +
      "confirmați că îi acceptați.",
  ],
  sections: [
    {
      title: "1. Cine administrează website-ul",
      paragraphs: [
        `Website-ul este administrat de organizația județeană Cluj a ` +
          `partidului ${OPERATOR}.`,
        "Ne puteți contacta la contact@pntmm.ro sau la +40 727 374 129.",
      ],
    },
    {
      title: "2. Scopul website-ului",
      paragraphs: [
        "Website-ul are rol de informare publică și de dialog cu cetățenii. " +
          "Prin intermediul lui puteți afla despre activitatea organizației, " +
          "vă puteți înscrie la evenimente și ne puteți transmite mesaje, " +
          "sesizări sau propuneri.",
        "Website-ul nu procesează plăți, nu vinde produse sau servicii și nu " +
          "colectează donații.",
      ],
    },
    {
      title: "3. Folosirea formularelor",
      paragraphs: [
        "Vă rugăm să transmiteți informații reale și să folosiți un limbaj " +
          "civilizat. Ne rezervăm dreptul de a nu da curs mesajelor cu conținut " +
          "ilegal, ofensator, discriminatoriu sau evident nereal.",
        "Nu transmiteți prin formulare parole, date bancare, coduri numerice " +
          "personale sau alte date sensibile care nu sunt necesare solicitării " +
          "dumneavoastră.",
        "Nu transmiteți date personale ale altor persoane fără acordul lor.",
        "Trimiterea unui mesaj nu creează o obligație de răspuns într-un " +
          "anumit termen și nu reprezintă o procedură administrativă sau " +
          "judiciară.",
      ],
    },
    {
      title: "4. Conținutul pe care îl transmiteți",
      paragraphs: [
        "Rămâneți titularul conținutului pe care ni-l trimiteți. Prin " +
          "trimitere ne acordați dreptul de a-l analiza și de a-l folosi intern " +
          "în scopul pentru care l-ați transmis.",
        "Nu publicăm mesajele, sesizările sau propunerile dumneavoastră și nu " +
          "vă folosim numele public fără acordul dumneavoastră prealabil.",
      ],
    },
    {
      title: "5. Drepturile asupra conținutului website-ului",
      paragraphs: [
        "Textele, imaginile, însemnele și structura acestui website aparțin " +
          "organizației sau sunt folosite cu drept de utilizare.",
        "Preluarea materialelor de presă este permisă cu indicarea sursei. " +
          "Pentru orice altă utilizare, inclusiv comercială, este necesar " +
          "acordul nostru scris.",
      ],
    },
    {
      title: "6. Disponibilitatea website-ului",
      paragraphs: [
        "Depunem eforturi rezonabile pentru ca website-ul să fie disponibil " +
          "permanent și pentru ca informațiile publicate să fie corecte și " +
          "actuale.",
        "Nu putem garanta însă funcționarea neîntreruptă: pot apărea " +
          "întreruperi pentru mentenanță sau din cauze care nu depind de noi.",
      ],
    },
    {
      title: "7. Linkuri către alte website-uri",
      paragraphs: [
        "Unele pagini pot conține linkuri către website-uri administrate de " +
          "terți. Nu controlăm conținutul acestora și nu ne asumăm " +
          "răspunderea pentru el.",
      ],
    },
    {
      title: "8. Limitarea răspunderii",
      paragraphs: [
        "Nu răspundem pentru eventualele prejudicii rezultate din utilizarea " +
          "sau din imposibilitatea utilizării website-ului, în limitele permise " +
          "de lege.",
      ],
    },
    {
      title: "9. Protecția datelor",
      paragraphs: [
        "Modul în care prelucrăm datele transmise prin formulare este descris " +
          "în politica de confidențialitate, care completează acești termeni.",
      ],
    },
    {
      title: "10. Modificarea termenilor",
      paragraphs: [
        "Putem actualiza acești termeni. Versiunea aplicabilă este cea " +
          "publicată pe această pagină la momentul vizitei dumneavoastră.",
      ],
    },
    {
      title: "11. Legea aplicabilă",
      paragraphs: [
        "Acestor termeni li se aplică legea română. Eventualele litigii se " +
          "soluționează pe cale amiabilă sau, dacă acest lucru nu este posibil, " +
          "de instanțele competente din România.",
      ],
    },
  ],
}
