# NovaWorks AI Project Manager

**Meeting-to-Execution Project Management System**  
Built for **THE INFINITY HACK '26** by **NovaWorks Technologies, Lahore, Pakistan**.

NovaWorks converts client meeting transcripts into structured projects and tasks. The administrator submits a transcript, Gemini extracts the final approved requirements, and the application assigns projects and tasks to the existing team while enforcing dates, estimated hours, and role-based access.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment configuration](#environment-configuration)
- [Run in development](#run-in-development)
- [Build and run production output](#build-and-run-production-output)
- [Demo accounts](#demo-accounts)
- [Recommended demonstration](#recommended-demonstration)
- [Project structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Known limitations](#known-limitations)

## Features

- Secure login with pre-seeded demo accounts.
- Role-based access control enforced in both the frontend and backend.
- Admin-only transcript-to-project/task creation using Gemini.
- Structured extraction of approved scope, assignments, deadlines, and estimated hours.
- Persistent JSON database stored in `data/novaworks.json`.
- Atomic all-or-nothing writes: invalid transcript results do not partially save.
- Manager view restricted to assigned projects.
- Developer view restricted to assigned tasks.
- Read-only team directory.
- Duplicate-submit protection and loading states.
- Persistent sessions and project data across browser refreshes.

### Roles

| Role | Access |
|---|---|
| Administrator (`ADMIN`) | All projects, team directory, and transcript creation |
| Project Manager (`MANAGER`) | Only projects assigned to that manager |
| Developer Agent (`AGENT`) | Only tasks assigned to that developer |

## Technology

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React
- **Backend:** Express.js with Vite middleware
- **Database:** Persistent JSON file with atomic transactions
- **Authentication:** HTTP-only session cookie and PBKDF2 password hashing
- **AI:** Google GenAI SDK with Gemini
- **Runtime:** Node.js

## Requirements

Install the following before starting:

- Node.js 20 or later
- npm 10 or later
- A Google Gemini API key for transcript conversion

Check your installed versions:

```powershell
node --version
npm --version
```

## Installation

Open PowerShell or a terminal in the project folder:

```powershell
cd "C:\Users\ARHAM IJAZ\Desktop\novaworks-ai-project-manager"
npm install
```

## Environment configuration

Create a local `.env` file from the supplied template:

### Windows PowerShell

```powershell
Copy-Item .env.example .env
notepad .env
```

### macOS/Linux

```bash
cp .env.example .env
nano .env
```

Set the values below in `.env`:

```env
GEMINI_API_KEY=your-gemini-api-key
PORT=3000
NODE_ENV=development
```

Replace `your-gemini-api-key` with a valid key from Google AI Studio. Never commit `.env` or publish the API key. The committed `.env.example` must contain only placeholder values.

## Run in development

Start the full application server:

```powershell
npm run dev
```

When the server starts, open:

<http://localhost:3000>

The development command runs the Express server and serves the Vite React application. Keep the terminal open while using the application. Press `Ctrl+C` to stop it.

## Build and run production output

Create the frontend production build:

```powershell
npm run build
```

Start the application server:

```powershell
npm start
```

Then open <http://localhost:3000>.

To run the TypeScript type check:

```powershell
npm run lint
```

## Demo accounts

All demo accounts use this password:

```text
Demo123!
```

| Reference | Name | Email | Role |
|---|---|---|---|
| ADMIN | Admin | `admin@novaworks.example` | Administrator |
| PM01 | Ayesha Khan | `ayesha@novaworks.example` | Manager |
| PM02 | Bilal Ahmed | `bilal@novaworks.example` | Manager |
| PM03 | Hina Malik | `hina@novaworks.example` | Manager |
| DEV01 | Ali Raza | `ali@novaworks.example` | Agent |
| DEV02 | Hamza Shah | `hamza@novaworks.example` | Agent |
| DEV03 | Sara Noor | `sara@novaworks.example` | Agent |
| DEV04 | Usman Tariq | `usman@novaworks.example` | Agent |
| DEV05 | Zain Abbas | `zain@novaworks.example` | Agent |
| DEV06 | Maryam Asif | `maryam@novaworks.example` | Agent |

No registration or password reset is required. Accounts are seeded automatically when the server starts. The Admin navigation also includes a demo/seed action if the data needs to be restored.

## Recommended demonstration

### 1. Sign in as Admin

1. Open <http://localhost:3000>.
2. Sign in with `admin@novaworks.example`.
3. Enter the password `Demo123!`.

### 2. Review the team directory

Open **Team Directory** and confirm that the ten seeded employees are displayed with their roles and specializations.

### 3. Convert the official transcript

1. Open **Create from Transcript**.
2. Select **1. Official Supplied Transcript**.
3. Click **Create from Transcript**.
4. Confirm that the AI creates three projects and their associated tasks:
   - UrbanCart Website
   - QuickServe Mobile App
   - HelpDeskPro AI Assistant

The application validates deadlines, positive estimated hours, employee assignments, and project/task relationships before saving.

### 4. Inspect project details

Open **UrbanCart Website** and verify:

- Four tasks are present.
- Ali Raza owns the three frontend/integration tasks.
- Hamza Shah owns the backend task.
- The project deadline is 20 October.
- The integration task deadline is 19 October.

### 5. Verify manager access control

Use the user switcher to test each manager:

- **Ayesha Khan:** sees only UrbanCart Website.
- **Bilal Ahmed:** sees only QuickServe Mobile App.
- **Hina Malik:** sees only HelpDeskPro AI Assistant.

A manager must not be able to access another manager's projects through the UI or API.

### 6. Verify developer access control

Switch to the following developer accounts and open **My Tasks**:

- **Ali Raza:** sees only his UrbanCart tasks.
- **Hamza Shah:** sees his assigned tasks across UrbanCart and QuickServe.

### 7. Verify persistence

Refresh the browser and confirm that the session, projects, and tasks remain available. The records are persisted in `data/novaworks.json`.

### 8. Verify live transcript changes

1. Switch back to Admin.
2. Clear the current projects using the available reset action.
3. Select **2. Modified Transcript**.
4. Submit it with **Create from Transcript**.
5. Verify that the modified QuickServe integration task reflects the changed estimate and deadline, such as 12 hours and `2026-10-23`.

This confirms that transcript data is processed dynamically rather than loaded from hardcoded project results.

## Project structure

```text
.
├── data/
│   └── novaworks.json       # Persistent local database
├── server/
│   ├── ai.ts                # Gemini integration
│   ├── crypto.ts            # Password/session cryptography
│   ├── db.ts                # JSON database operations
│   └── seedData.ts          # Demo users and seed data
├── src/
│   ├── components/          # React UI components
│   ├── lib/api.ts           # Frontend API client
│   ├── types/               # Shared TypeScript types
│   ├── App.tsx              # Application shell
│   └── main.tsx             # Frontend entry point
├── server.ts                # Express/Vite server entry point
├── package.json              # Scripts and dependencies
└── .env.example              # Environment variable template
```

## Troubleshooting

### `npm` or `node` is not recognized

Install Node.js 20 or later, restart PowerShell, and run `node --version` again.

### Port 3000 is already in use

Change the port in `.env`:

```env
PORT=3001
```

Then restart the server and open <http://localhost:3001>.

### Transcript conversion fails

Check that:

1. `.env` exists in the project root.
2. `GEMINI_API_KEY` contains a valid key.
3. The server was restarted after changing `.env`.
4. The machine has an active internet connection.

### The application has stale demo data

Use the Admin reset/seed controls in the navigation, or stop the server and make a backup before manually resetting `data/novaworks.json`. Do not delete the file unless you intend to recreate the local database.

## Known limitations

- Real-time WebSocket notifications are not included.
- Timesheets, invoicing, payroll, and advanced financial reporting are outside this MVP.
- The JSON database is intended for local demonstration and is not a production multi-user database.

## Security note

Keep API keys and local `.env` files private. Do not commit secrets, production credentials, or personal data to the repository.
