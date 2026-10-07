<div align="center">

#  NovaWorks AI Project Manager

### From meeting transcript to a fully planned project, in one click.

** Built for THE INFINITY HACK '26 · Team Pokie Builders**

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)

[ Overview](#-overview) · [ Features](#-features) · [ Quick Start](#-quick-start) · [ Demo Accounts](#-demo-accounts) · [ Try the AI Flow](#-try-the-ai-flow-in-2-minutes) · [🎬 Demo Video](#-demo-video)

</div>

---

## ✨ Overview

Meetings produce decisions. Then everyone forgets who was supposed to do what.

**NovaWorks** is a meeting-to-execution project management CRM built for **NovaWorks Technologies**. Paste in a meeting transcript, and AI turns it into structured **projects** and **tasks**, complete with **assignees, deadlines, and estimated hours**.

Everyone gets a dashboard that matches their role: **Admins** see everything, **Managers** see their projects, and **Agents** see their own tasks.

```mermaid
flowchart LR
    A[" Meeting Transcript"] --> B[" Gemini AI"]
    B --> C[" Projects"]
    C --> D[" Tasks<br/>assignee · deadline · hours"]
    D --> E[" Role-based Dashboards"]
```

---

##  Features

| | Feature | What it does |
|---|---|---|
|  | **AI Transcript → Projects & Tasks** | Gemini reads a meeting transcript and generates projects and tasks automatically |
|  | **Deadlines & Estimated Hours** | Every task comes with a due date and a time estimate |
|  | **Secure Login** | Pre-seeded demo accounts, HTTP-only session cookies, PBKDF2 password hashing |
|  | **Role-Based Access Control** | Admin, Manager, and Agent roles, enforced on the **server**, not just hidden in the UI |
|  | **Team Directory** | See everyone on the team in one place |
|  | **Project & Task Management** | Browse projects and drill into their tasks |
|  | **Persistent Data** | Your data survives refreshes and restarts (local JSON database with atomic writes) |

---

##  Who Sees What?

| Role | Projects | Tasks | Team Directory | Create from Transcript |
|---|:---:|:---:|:---:|:---:|
|  **Admin** | All | All | ✅ | ✅ |
|  **Manager** | Only assigned | Tasks in those projects | ❌ | ❌ |
|  **Agent** | Related project info | Only assigned tasks | ❌ | ❌ |

>  Access rules are enforced by the backend, so they can't be bypassed from the browser.

---

##  Tech Stack

| Layer | Technology |
|---|---|
|  **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Motion |
|  **Backend** | Node.js, Express.js, TypeScript, `tsx` |
|  **AI** | Google GenAI SDK with Gemini |
|  **Auth** | HTTP-only session cookies + PBKDF2 password hashing |
|  **Database** | Persistent local JSON file with atomic writes |

---

##  Quick Start

###  Prerequisites

- **Node.js 20+** and **npm**
- A **Google Gemini API key** (needed for the AI transcript feature)

###  Install dependencies

```bash
npm install
```

###  Set up your environment file

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**macOS / Linux:**
```bash
cp .env.example .env
```

Then open `.env` and paste in your own Gemini API key.

###  Run the app

```bash
npm run dev
```

Open **http://localhost:3000** 🎉

<details>
<summary><b> Other useful commands</b></summary>

```bash
npm run build   # Build for production
npm start       # Start the production build
npm run lint    # Type-check the project
```

</details>

###  Environment Variables

```env
GEMINI_API_KEY=your-gemini-api-key
PORT=3000
NODE_ENV=development
```

| Variable | Required | Description |
|---|:---:|---|
| `GEMINI_API_KEY` |  | Powers the AI transcript processing |
| `PORT` |  | Server port (defaults to `3000`) |
| `NODE_ENV` |  | Use `development` locally |
| `APP_URL` |  | Reserved for hosted setups (no hosted deployment is configured yet) |

>  **Never commit your `.env` file or share a real API key.**

---

##  Demo Accounts

All demo accounts are fictional and share one password:

```
Password: Demo123!
```

| Name | Email | Role |
|---|---|---|
| Admin | `admin@novaworks.example` |  Administrator |
| Ayesha Khan | `ayesha@novaworks.example` |  Manager |
| Bilal Ahmed | `bilal@novaworks.example` |  Manager |
| Hina Malik | `hina@novaworks.example` |  Manager |
| Ali Raza | `ali@novaworks.example` |  Agent |
| Hamza Shah | `hamza@novaworks.example` |  Agent |
| Sara Noor | `sara@novaworks.example` |  Agent |
| Usman Tariq | `usman@novaworks.example` |  Agent |
| Zain Abbas | `zain@novaworks.example` |  Agent |
| Maryam Asif | `maryam@novaworks.example` |  Agent |

Accounts are created automatically the first time the app starts.

---

##  Try the AI Flow in 2 Minutes

1. Run `npm run dev` and open **http://localhost:3000**
2. Log in as **Admin** (`admin@novaworks.example` / `Demo123!`)
3. Open **Create from Transcript**
4. Choose **1. Official Supplied Transcript** (or paste your own)
5. Click **Create from Transcript** and let Gemini work ✨
6. Open the new projects and inspect assignments, deadlines, and estimated hours
7. Log in as a **Manager** and an **Agent** to see how access changes
8. Refresh the page and confirm everything is still saved 💾

> 💡 There's also a **Modified Transcript** preset, which proves the AI reacts to changed input rather than returning canned results.

###  Expected Result

The official transcript should produce **3 projects** and **12 tasks**:

| Project | Tasks |
|---|:---:|
|  UrbanCart Website | 4 |
|  QuickServe Mobile App | 4 |
|  HelpDeskPro AI Assistant | 4 |

---

## 🗂️ Project Structure

```
.
├── data/
│   └── novaworks.json        # Local persistent database
├── server/
│   ├── ai.ts                 # Gemini transcript processing
│   ├── crypto.ts             # Password hashing & verification
│   ├── db.ts                 # JSON database operations
│   └── seedData.ts           # Demo users & seed data
├── src/
│   ├── components/           # React UI components
│   ├── lib/
│   │   ├── api.ts            # Frontend API client
│   │   └── transcriptSamples.ts   # Official & modified demo transcripts
│   ├── types/                # Shared TypeScript types
│   ├── App.tsx               # Main application component
│   └── main.tsx              # Frontend entry point
├── server.ts                 # Express + Vite server entry point
├── package.json              # Scripts & dependencies
└── .env.example              # Environment variable template
```

---

##  Known Limitations

These are intentionally outside the challenge scope:

- Sign up / registration
- Forgot password & password reset
- Cost calculation & invoicing
- Progress monitoring & timesheets
- Real-time notifications
- Production-scale, multi-user database infrastructure

---

##  Deployment

No live deployment is configured. This submission runs as a local demo at **http://localhost:3000** and stores data in `data/novaworks.json`. No hosted database is used.

---

##  Demo Video

> https://drive.google.com/drive/folders/1CtcwIEHagLc1E7pFcn6JdfqNiB8SiCuz

---

## 🤝 Team

**Team Pokie Builders**

> Taha Nadeem (Team Leader)
> Waqar Imran
> Ahad Ata
> Ahmer Ijaz 

<div align="center">

---

Made with  ❤️ for **THE INFINITY HACK '26**

⭐ If you like this project, give it a star!

</div>
