# Scrum Board - Grupp 1

Scrum Board är ett slutprojekt i kursen JavaScript 2. Det är en webbapplikation för att hantera projekt och uppgifter i ett team. Applikationen ger en överblick över projekt och tillhörande uppgifter, vilket gör det enklare att organisera arbetet och följa uppgifternas status.

## Funktioner

### Projekt

- Visa en lista över tillgängliga projekt med tillhörande information.
- Visa en sammanfattning av varje projekt och dess uppgifter.
- Skapa nya projekt genom att fylla i ett formulär.

### Medlemmar

- Visa en lista över alla medlemmar.
- Lägga till nya medlemmar genom att fylla i ett formulär.
- Tilldela medlemmar till specifika uppgifter.

### Uppgifter

- Visa uppgifter i kolumner efter status på en board.
- Skapa nya uppgifter och ange relevant information.
- Tilldela en medlem till en uppgift.
- Markera uppgifter som slutförda.
- Radera uppgifter.
- Redigera deadline och prioritet för befintliga uppgifter.
- Filtrera uppgifter efter kategori och medlem.
- Sortera uppgifter efter deadline eller i bokstavsordning.

## Teknikstack

Projektet är utvecklat med följande tekniker:

- **TypeScript** – För att skriva strukturerad och typsäker JavaScript-kod. [Dokumentation](https://www.typescriptlang.org/docs/)
- **Vite** – För utvecklingsserver och byggprocess. [Dokumentation](https://vite.dev/guide/)
- **Bootstrap** – För layout och styling av gränssnittet. [Dokumentation](https://getbootstrap.com/docs/5.3/)
- **Firebase Realtime Database REST API** – För att läsa och skriva data i databasen via HTTP-anrop, utan att använda Firebase SDK. [REST API-dokumentation](https://firebase.google.com/docs/database/rest/start)

## Kom igång

**Förutsättningar:** [Node.js](https://nodejs.org/) (version 20 eller senare) och npm installerat.

1. Klona repot:
    ```bash
    git clone https://github.com/xpensivenose/be26-js2-slutprojekt-grupp1.git
    ```
2. Gå in i projektmappen:
    ```bash
    cd be26-js2-slutprojekt-grupp1
    ```
3. Installera beroenden:
    ```bash
    npm install
    ```
4. Starta utvecklingsservern:
    ```bash
    npm run dev
    ```
5. Öppna den lokala adressen som visas i terminalen i din webbläsare.

Ingen `.env`-fil eller ytterligare Firebase-konfiguration behövs. Databasens URL anges via konstanten `BASE_URL` i `src/constants.ts`.

## Projektstruktur

Projektet är uppdelat i mappar utifrån funktion och ansvarsområde för att göra koden enklare att förstå och underhålla.

```text
├── index.html                        # Översiktsvy
├── project.html                      # Projektvy
├── README.md
└── src/
    ├── main.ts                       # Startpunkt, väljer vy per sida
    ├── style.css
    ├── constants.ts                  # BASE_URL, kategorier, prioriteter, datumformat
    │
    ├── components/                   # Delade UI-komponenter
    │   ├── formError.ts
    │   └── notice.ts
    │
    ├── features/                     # Funktionalitet och rendering
    │   ├── members/
    │   │   ├── memberCard.ts
    │   │   ├── memberForm.ts
    │   │   └── memberList.ts
    │   ├── projects/
    │   │   ├── projectCard.ts
    │   │   ├── projectForm.ts
    │   │   ├── projectList.ts
    │   │   └── projectSummary.ts
    │   └── tasks/
    │       ├── addTaskForm.ts
    │       ├── assignTaskForm.ts
    │       ├── editTaskForm.ts
    │       ├── taskBoard.ts
    │       ├── taskCard.ts
    │       └── taskFilter.ts
    │
    ├── models/                       # Klasser med privata fält + getters/setters
    │   ├── Member.ts
    │   ├── Project.ts
    │   └── Task.ts
    │
    ├── services/                     # Firebase REST-anrop
    │   ├── api.ts
    │   ├── memberService.ts
    │   ├── projectService.ts
    │   └── taskService.ts
    │
    ├── types/
    │   └── types.ts                  # Delade interfaces
    │
    └── utils/                        # Hjälpfunktioner för datum, DOM och URL:er
        ├── date.ts
        ├── dom.ts
        └── urls.ts
```

Applikationen är uppdelad efter funktion och ansvarsområde. `features/` hanterar funktionaliteten och rendering för projekt, medlemmar och uppgifter. `services/` ansvarar för kommunikationen med Firebase Realtime Database via REST API, medan `models/` innehåller klasser som representerar applikationens objekt. Gemensamma komponenter, typer och hjälpfunktioner finns i separata mappar för att kunna återanvändas i olika delar av applikationen.

## Namnkonvention

Projektet följer gemensamma namngivningskonventioner för att göra koden konsekvent, lättläst och enklare att underhålla.

| Typ               | Konvention                       | Beskrivning                                                                     | Exempel               |
| ----------------- | -------------------------------- | ------------------------------------------------------------------------------- | --------------------- |
| Filer             | `camelCase`                      | Filnamn börjar med liten bokstav. Efterföljande ord markeras med stor bokstav.  | `memberService.ts`    |
| Klassfiler        | `PascalCase`                     | Filnamn börjar med stor bokstav. Efterföljande ord markeras med stor bokstav.   | `Member.ts`           |
| API-anrop         | `get`, `add`, `update`, `delete` | Används för funktioner som hämtar, lägger till, uppdaterar eller tar bort data. | `getTasksByProject()` |
| HTML-skapande     | `create`                         | Används för funktioner som skapar HTML-element.                                 | `createProjectCard()` |
| Initiering        | `setup`                          | Används för funktioner som förbereder eller konfigurerar funktionalitet.        | `setupEditTaskForm()`     |
| Händelsehantering | `handle`                         | Används för funktioner som hanterar händelser och användarinteraktioner.        | `handleAddTaskSubmit()` |
| Rendering         | `render`                         | Används för funktioner som visar eller uppdaterar innehåll i gränssnittet.      | `renderProjectList()`       |

Funktionsnamn skrivs med `camelCase` och beskriver funktionens syfte.

## Framtida förbättringar

- Förbättra användarupplevelsen för medlemsvalet i formuläret för nya projekt. Det nuvarande flervalsfältet `<select multiple>` kräver Ctrl/Cmd-klick för att välja flera medlemmar, vilket inte är självklart för alla användare.
  
## AI-användning  

AI har använts som stöd för att ta fram en grundläggande layout med Bootstrap och en grundstruktur för projektets filer.

## Gruppmedlemmar och ansvarsfördelning

- **Albin** – Projektöversikt och projekthantering, inklusive hämtning och skapande av projekt, rendering av projektkort, navigering samt filtrering och sortering av uppgifter på board.
- **Therese** – Medlemshantering, inklusive hämtning, visning, skapande och uppdatering av medlemmar samt tilldelning av medlem för enskilda uppgifter.
- **Kim** – Uppgiftshantering och Scrum Board, inklusive hantering av uppgifter, boardkolumner och uppgifternas status, slutförande och radering av uppgifter samt utveckling av gemensamma hjälpfunktioner.

## Build och deploy

Bygg projektet för produktion med följande kommando:

```bash
npm run build
```

Den färdiga produktionsversionen genereras i mappen `dist`.

Projektet driftsätts via [Netlify](https://www.netlify.com/) inför redovisningen.
