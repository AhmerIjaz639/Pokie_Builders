# NovaWorks AI Project Manager

**THE INFINITY HACK '26**

## Project Description

NovaWorks is a meeting-to-execution project management CRM for NovaWorks Technologies.
It uses AI to convert meeting transcripts into structured projects and tasks, including assignments, deadlines, and estimated hours.
The application also provides role-based dashboards for administrators, project managers, and developer agents.

## Features

- Login and logout with pre-seeded demo accounts
- Admin, Manager, and Agent roles
- Server-side role-based access control
- Team directory
- Project management
- Task management
- AI transcript-to-project/task generation
- Task deadlines and estimated hours
- Persistent saved data across restarts and refreshes

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Motion
- **Backend:** Node.js, Express.js, TypeScript, `tsx`
- **AI:** Google GenAI SDK with Gemini
- **Authentication:** HTTP-only session cookies and PBKDF2 password hashing
- **Database:** Persistent local JSON file with atomic writes

## Project Structure

```text
.
├── data/
│   └── novaworks.json       # Local persistent database
├── server/
│   ├── ai.ts                # Gemini transcript processing
│   ├── crypto.ts            # Password hashing and verification
│   ├── db.ts                # JSON database operations
│   └── seedData.ts          # Demo users and seed data
├── src/
│   ├── components/          # React UI components
│   ├── lib/api.ts           # Frontend API client
│   ├── lib/transcriptSamples.ts
│   │                          # Supplied and modified demo transcripts
│   ├── types/               # Shared TypeScript types
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Frontend entry point
├── server.ts                # Express/Vite server entry point
├── package.json             # Scripts and dependencies
└── .env.example             # Environment variable template
```

## Installation & Setup

### Prerequisites

- Node.js 20 or later
- npm
- A Google Gemini API key for AI transcript processing

### Install dependencies

From the project directory, run:

```powershell
npm install
```

### Create the environment file

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Open `.env` and add your own Gemini API key, as described below.

### Start the development server

```powershell
npm run dev
```

Open the application at <http://localhost:3000>.

### Build and start the application

```powershell
npm run build
npm start
```

### Type-check the project

```powershell
npm run lint
```

## Environment Variables

The project includes an [.env.example](./.env.example) template. Copy it to `.env` and replace the placeholder values.

```env
GEMINI_API_KEY=your-gemini-api-key
PORT=3000
NODE_ENV=development
```

- `GEMINI_API_KEY` is required for AI transcript processing.
- `PORT` is optional and defaults to `3000`.
- `NODE_ENV` controls the runtime mode; use `development` locally.
- `APP_URL` is present in the template for hosted configuration, but no hosted deployment is currently configured.

Never commit `.env` or expose a real API key. Use placeholder values in `.env.example`.

## Demo Accounts

All supplied fictional demo accounts use:

```text
Password: Demo123!
```

| Name | Email | Role |
|---|---|---|
| Admin | `admin@novaworks.example` | Administrator |
| Ayesha Khan | `ayesha@novaworks.example` | Manager |
| Bilal Ahmed | `bilal@novaworks.example` | Manager |
| Hina Malik | `hina@novaworks.example` | Manager |
| Ali Raza | `ali@novaworks.example` | Agent |
| Hamza Shah | `hamza@novaworks.example` | Agent |
| Sara Noor | `sara@novaworks.example` | Agent |
| Usman Tariq | `usman@novaworks.example` | Agent |
| Zain Abbas | `zain@novaworks.example` | Agent |
| Maryam Asif | `maryam@novaworks.example` | Agent |

The accounts are seeded automatically when the application first starts.

## How to Test the AI Flow

1. Start the server with `npm run dev` and open <http://localhost:3000>.
2. Log in as Admin:
   - Email: `admin@novaworks.example`
   - Password: `Demo123!`
3. Open **Create from Transcript**.
4. Select **1. Official Supplied Transcript**, or paste the supplied meeting transcript from the application.
5. Click **Create from Transcript** to run Gemini processing.
6. Verify that the application creates **3 projects and 12 tasks**.
7. Open the projects and inspect their task assignments, deadlines, and estimated hours.
8. Switch between the Manager and Agent demo accounts to verify access restrictions.
9. Refresh the browser and confirm that the saved data remains available.

The application also includes a **Modified Transcript** preset for testing that updated transcript values are processed dynamically.

## Role-Based Access

- **Admin:** Can view all projects and tasks, view the team directory, and create projects/tasks from transcripts.
- **Manager:** Can view only assigned projects and the tasks belonging to those projects.
- **Agent:** Can view only assigned tasks and the related project information.

Authorization is enforced by the backend, not only by hiding frontend controls.

## Expected Demo Result

The official supplied transcript should produce:

- **3 projects**
- **12 tasks**
- **UrbanCart Website:** 4 tasks
- **QuickServe Mobile App:** 4 tasks
- **HelpDeskPro AI Assistant:** 4 tasks

The saved database file is [data/novaworks.json](./data/novaworks.json).

## Deployment

No live deployment is currently configured. This submission runs as a local demo at:

<http://localhost:3000>

The project uses a local JSON database stored in `data/novaworks.json`; no hosted database provider is configured.

## Demo Video

Demo video link: **TODO — add link before submission**

## Known Limitations

The following features are intentionally outside the challenge scope:

- User signup and registration
- Forgot password and password reset
- Cost calculation and invoicing
- Progress monitoring and timesheets
- Real-time notifications
- Production-scale multi-user database infrastructure

## Team

The project currently contains a verified seeded team directory with the following members:

- Admin
- Ayesha Khan
- Bilal Ahmed
- Hina Malik
- Ali Raza
- Hamza Shah
- Sara Noor
- Usman Tariq
- Zain Abbas
- Maryam Asif

**Team member credits:** TODO — add the submitting team members' names before final submission.
