# Scrum Board - Grupp 1

Scrum Board är ett slutprojekt i kursen JavaScript 2 och är en webbapplikation för att hantera projekt och uppgifter i ett team. Applikationen ger en överblick över projekt och deras uppgifter, vilket gör det enklare att organisera arbetet och följa uppgifternas status.

## Funktioner

### Projekt

- Visa en lista över tillgängliga projekt med tillhörande information.
- Se en sammanfattning av varje projekt och dess uppgifter.
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

- **TypeScript** – För att skriva strukturerad och typsäker JavaScript-kod. [Dokumentation](https://www.typescriptlang.org/docs/)
- **Vite** – För utvecklingsserver och byggprocess. [Dokumentation](https://vite.dev/guide/)
- **Bootstrap** – För layout och styling av gränssnittet. [Dokumentation](https://getbootstrap.com/docs/)
- **Firebase Realtime Database REST API** – För att läsa och skriva data i databasen via HTTP-anrop, utan att använda Firebase SDK. [REST API-dokumentation](https://firebase.google.com/docs/database/rest/start)

## Kom igång lokalt

**Förutsättningar:** [Node.js](https://nodejs.org/) (version 20 eller senare) och npm installerat.

1. Klona repot:
    ```bash
    git clone git@github.com:xpensivenose/be26-js2-slutprojekt-grupp1.git
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
5. Öppna `http://localhost:5173` i webbläsaren.

Ingen `.env`-fil eller egen Firebase-konfiguration behövs — databasens URL finns redan satt i `src/constants.ts`.

## Dokumentation

- [Firebase Realtime Database REST API](https://firebase.google.com/docs/database/rest/start)
- [Bootstrap 5](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [Netlify](https://docs.netlify.com/)

## Projektstruktur

Projektet är uppdelat i mappar utifrån funktion och ansvarsområde för att göra koden enklare att förstå och underhålla.

```
.
├── index.html               # Översiktssida (data-page="index")
├── project.html              # Projektvy (data-page="project")
├── README.md
└── src/
    ├── main.ts                       # Routar mellan sidorna via document.body.dataset.page
    ├── style.css
    ├── constants.ts                  # BASE_URL, kategorier, prioriteter, datumformat
    │
    ├── components/                   # Delade UI-komponenter
    │   ├── formError.ts              # Visar/döljer felmeddelanden i formulär
    │   └── notice.ts                 # Visar tillfälliga notiser (success/error)
    │
    ├── features/
    │   ├── members/
    │   │   ├── memberCard.ts         # createMemberCard
    │   │   ├── memberForm.ts         # setupMemberForm, handleMemberSubmit
    │   │   └── memberList.ts         # renderMemberList, addMemberToList
    │   ├── projects/
    │   │   ├── projectCard.ts        # createProjectCard
    │   │   ├── projectForm.ts        # setupProjectForm
    │   │   ├── projectList.ts        # renderProjectList, addProjectToList
    │   │   └── projectSummary.ts     # renderProjectSummary, createProjectSummary
    │   └── tasks/
    │       ├── addTaskForm.ts        # setupAddTaskForm
    │       ├── assignTaskForm.ts     # setupAssignForm, handleAssignTask
    │       ├── editTaskForm.ts       # setupEditTaskForm, handleEditTask
    │       ├── taskBoard.ts          # setupTaskBoard, renderTaskBoard
    │       ├── taskCard.ts           # createTaskCard
    │       └── taskFilter.ts         # filterTasks, sortTasks
    │
    ├── models/                       # Klasser med privata fält + getters/setters
    │   ├── Member.ts
    │   ├── Project.ts
    │   └── Task.ts
    │
    ├── services/                     # Firebase REST-anrop
    │   ├── api.ts                    # Delad request()-hjälpfunktion
    │   ├── memberService.ts
    │   ├── projectService.ts
    │   └── taskService.ts
    │
    ├── types/
    │   └── types.ts                  # Delade interfaces (MemberData, ProjectData, TaskData, ...)
    │
    └── utils/
        ├── date.ts                   # formatDate
        ├── dom.ts                    # createSelectOption, clearElements
        └── urls.ts                   # getProjectId
```

Applikationen är uppdelad efter funktion och ansvarsområde. `features/` hanterar funktionaliteten och rendering för projekt, medlemmar och uppgifter. `services/` ansvarar för kommunikationen med Firebase Realtime Database via REST API, medan `models/` innehåller klasser som representerar applikationens objekt. Gemensamma komponenter, typer och hjälpfunktioner finns i separata mappar för att kunna återanvändas i olika delar av applikationen.

## Namnkonvention

Projektet följer gemensamma namngivningskonventioner för att göra koden konsekvent, lättläst och enklare att underhålla.

| Typ               | Konvention                       | Beskrivning                                                                     | Exempel               |
| ----------------- | -------------------------------- | ------------------------------------------------------------------------------- | --------------------- |
| Filer             | `camelCase`                      | Filnamn börjar med liten bokstav. Varje nytt ord börjar med stor bokstav.       | `memberService.ts`    |
| Klassfiler        | `PascalCase`                     | Filnamn börjar med stor bokstav och varje nytt ord börjar med stor bokstav.     | `Member.ts`           |
| API-anrop         | `get`, `add`, `update`, `delete` | Används för funktioner som hämtar, lägger till, uppdaterar eller tar bort data. | `getTasksByProject()` |
| HTML-skapande     | `create`                         | Används för funktioner som skapar HTML-element eller formulär.                  | `createProjectForm()` |
| Initiering        | `setup`                          | Används för funktioner som förbereder eller konfigurerar funktionalitet.        | `setupTaskForm()`     |
| Händelsehantering | `handle`                         | Används för funktioner som hanterar händelser och användarinteraktioner.        | `handleSubmit()`      |
| Rendering         | `render`                         | Används för funktioner som visar eller uppdaterar innehåll i gränssnittet.      | `renderTasks()`       |

Funktionsnamn skrivs med `camelCase` och beskriver funktionens syfte.

## Framtida förbättringar

- Förbättra UX för flervalsfältet för medlemmar i "Nytt projekt"-formuläret (nuvarande `<select multiple>` kräver Ctrl/Cmd-klick, vilket inte är uppenbart för alla användare)

## AI-användning

AI har använts i projektet för att ta fram en grundläggande layout med Bootstrap. Samt att ta fram en grund för filstrukturen.

## Branch-struktur och ansvarsfördelning

- **Albin** – Projektöversikt och projekthantering, inklusive hämtning och skapande av projekt, rendering av projektkort, navigering samt filtrering och sortering av uppgifter på board.
- **Therese** – Medlemshantering, inklusive hämtning, visning, skapande och uppdatering av medlemmar samt koppling mellan medlemmar och uppgifter.
- **Kim** – Uppgiftshantering och Scrum Board, inklusive hantering av uppgifter, boardkolumner och uppgifternas status, slutförande och radering av uppgifter samt utveckling av gemensamma hjälpfunktioner.

## Bygga projektet

För att bygga applikationen för produktion, kör följande kommando:

```bash
npm run build
```
