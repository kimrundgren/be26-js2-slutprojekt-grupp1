# [be26-js2-slutprojekt-grupp1](https://github.com/xpensivenose/be26-js2-slutprojekt-grupp1)

En webbapp för att hantera projekt enligt scrum. Man kan skapa projekt och medlemmar, lägga till uppgifter i ett projekt, tilldela dem till medlemmar och slutföra dem på ett scrumboard.

Slutprojekt i JavaScript 2 av Albin, Kim och Therese (grupp 1).

Repo: https://github.com/xpensivenose/be26-js2-slutprojekt-grupp1

## Funktioner

**Projekt**

- Skapa projekt med namn, beskrivning, deadline och medlemmar
- Projektlistan visar hur många pågående uppgifter varje projekt har
- Klicka på ett projekt för att öppna dess scrumboard
- Projektsammanfattning med projektets medlemmar, deras kategori och antal pågående uppgifter

**Medlemmar**

- Skapa medlemmar med namn och kategori (Frontend, Backend eller UX)
- Medlemslistan visar vilka projekt varje medlem är med i och antal pågående uppgifter

**Uppgifter**

- Skapa uppgifter med titel, beskrivning, kategori, prioritet och deadline
- Tilldela en uppgift till en medlem. Bara medlemmar i projektet med samma kategori som uppgiften kan väljas
- Ändra prioritet och deadline
- Slutföra och radera uppgifter
- Filtrera på kategori och medlem
- Sortera på deadline eller titel

**Hur en uppgift går igenom boarden**

1. En ny uppgift hamnar i första kolumnen och kan tilldelas eller ändras.
2. När den tilldelas en medlem flyttas den till den pågående kolumnen och kan slutföras eller ändras.
3. När den slutförs flyttas den till den sista kolumnen, får ett slutdatum och kan raderas.

## Teknik

- TypeScript
- Vite
- Bootstrap 5
- Firebase Realtime Database (REST API)
- ESLint, Prettier, Husky och lint-staged

## Komma igång

Du behöver Node.js installerat.

```bash
git clone https://github.com/xpensivenose/be26-js2-slutprojekt-grupp1.git
cd be26-js2-slutprojekt-grupp1
npm install
npm run dev
```

Öppna sedan adressen som visas i terminalen, oftast `http://localhost:5173`.

## Kommandon

| Kommando          | Beskrivning                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Startar utvecklingsservern           |
| `npm run build`   | Typkontrollerar och bygger projektet |
| `npm run preview` | Visar det byggda projektet lokalt    |
| `npm run check`   | Typkontroll och lint                 |
| `npm run format`  | Formaterar koden med Prettier        |

## Projektstruktur

```
src/
  components/   Notiser och formulärfel
  features/
    projects/   Projektlista, projektkort, projektformulär och sammanfattning
    tasks/      Scrumboard, uppgiftskort, formulär och filtrering
    members/    Medlemslista, medlemskort och medlemsformulär
  models/       Klasserna Project, Task och Member
  services/     Anrop mot Firebase
  types/        Typer och interface
  utils/        Hjälpfunktioner för datum, DOM och URL
  constants.ts  Firebase-URL, kategorier, prioriteter och datumformat
  main.ts       Startpunkt för båda sidorna
index.html      Startsida med projekt och medlemmar
project.html    Scrumboard för ett projekt (project.html?id=...)
```

## Data

Datan sparas i Firebase Realtime Database och hämtas med `fetch` mot REST API:t. Det finns tre samlingar: `projects`, `members` och `tasks`.

- Ett projekt sparar vilka medlemmar som är med (`memberIds`).
- En medlem sparar vilka projekt den är med i (`projectIds`).
- En uppgift sparar vilket projekt den hör till (`projectId`) och vilken medlem den är tilldelad (`memberId`).

## Deploy

Projektet publiceras på Netlify.

- Build command: `npm run build`
- Publish directory: `dist`

## Länkar

- [Vite](https://vite.dev/guide/)
- [Bootstrap](https://getbootstrap.com/docs/5.3/)
- [Firebase Realtime Database REST API](https://firebase.google.com/docs/database/rest/start)
- [Netlify](https://docs.netlify.com/)

## Arbetssätt

Vi jobbar i feature-branches som slås ihop med `dev` via pull requests. `main` innehåller den färdiga versionen.

## Ansvarsområden

- **Albin:** projekt (lista, kort, formulär, sammanfattning) samt filtrering och sortering
- **Kim:** uppgifter och scrumboard (uppgiftskort, formulär för att lägga till och ändra, slutföra och radera)
- **Therese:** medlemmar (lista, kort, formulär) samt tilldelning av uppgifter
