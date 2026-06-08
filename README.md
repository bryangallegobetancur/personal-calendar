# Personal Calendar

A web application for managing appointments and reminders with calendar sync (Google Calendar, Outlook) and WhatsApp reminders. Built with React, Vite, Supabase, and Tailwind CSS.

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Row Level Security)
- **Integrations:** Google Calendar API, Microsoft Graph API, Twilio WhatsApp API
- **Deploy:** Vercel / Netlify ready

## Features

- Email/password authentication via Supabase Auth
- Monthly, weekly, and list calendar views
- Full CRUD for events/appointments
- Sync events with Google Calendar (OAuth 2.0)
- Sync events with Microsoft Outlook Calendar (OAuth 2.0)
- WhatsApp reminders via Twilio API
- Row Level Security — each user sees only their own data
- Consent flow for all integrations
- Responsive mobile-friendly design

## Prerequisites

- Node.js 18+
- A Supabase project (free tier works)
- Google Cloud project with OAuth 2.0 credentials
- Azure AD app registration (for Outlook)
- Twilio account with WhatsApp sandbox or approved number

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd personal-calendar
npm install
```

### 2. Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `supabase/migrations/001_schema.sql`
3. Enable the "Allow email/password sign-ups" option in Authentication > Settings
4. Copy your project URL and anon key from Settings > API

### 3. Environment variables

Copy `.env.example` to `.env` and fill in all values:

```bash
cp .env.example .env
```

#### Google OAuth setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select existing
3. Go to APIs & Services > OAuth consent screen
   - Choose "External" user type
   - Add the scope: `https://www.googleapis.com/auth/calendar`
   - Add your email as a test user
4. Go to APIs & Services > Credentials
   - Create OAuth 2.0 Client ID (Web application)
   - Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
   - Copy Client ID and Client Secret
5. Enable the Google Calendar API for your project

#### Microsoft (Outlook) OAuth setup

1. Go to [Azure Portal > App registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps)
2. Create a new app registration
3. Under Authentication:
   - Add platform: Web
   - Redirect URI: `http://localhost:3000/auth/microsoft/callback`
   - Check "Access tokens" and "ID tokens"
4. Under API permissions:
   - Add permission > Microsoft Graph > Delegated
   - Add `Calendars.ReadWrite` and `offline_access`
5. Copy the Application (client) ID and client secret

#### Twilio (WhatsApp) setup

1. Create a [Twilio](https://www.twilio.com) account
2. Go to Messaging > Try it out > Send a WhatsApp message
3. Follow the sandbox setup to connect your WhatsApp number
4. Copy Account SID, Auth Token, and WhatsApp number

### 4. Run development server

```bash
npm run dev
```

Opend `http://localhost:3000` in your browser.

### 5. Build for production

```bash
npm run build
```

## Supabase Edge Functions (WhatsApp reminders)

Deploy the reminder function to Supabase:

```bash
# Install Supabase CLI
npm install -g supabase

# Login and link
supabase login
supabase link --project-ref <your-project-ref>

# Deploy the function
supabase functions deploy send-reminders
```

Then set up a cron job (e.g., pg_cron or an external service like Cron-job.org) to call `https://<project-ref>.supabase.co/functions/v1/send-reminders` every 15 minutes.

## Deploy to Vercel

1. Push your code to a Git repository
2. Import the project in [Vercel](https://vercel.com)
3. Set all environment variables from `.env` in Vercel's dashboard
4. Deploy — Vercel auto-detects Vite

## Deploy to Netlify

1. Push your code to a Git repository
2. Import the project in [Netlify](https://netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add redirect rule in `public/_redirects`: `/* /index.html 200`
6. Set all environment variables in Netlify's dashboard
7. Deploy

## Project Structure

```
personal-calendar/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── supabase/
│   ├── migrations/001_schema.sql
│   └── functions/send-reminders/index.ts
├── public/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── lib/supabase.js
    ├── store/authStore.js
    ├── hooks/
    │   ├── useEvents.js
    │   └── useIntegrations.js
    ├── components/
    │   ├── ui/ (Modal, Button, Input, Checkbox)
    │   ├── auth/ (LoginForm, RegisterForm)
    │   ├── calendar/ (MonthView, WeekView, EventCard)
    │   ├── events/ (EventForm, EventList)
    │   ├── integrations/ (GoogleCalendarConnect, OutlookConnect, WhatsAppConnect, ConsentModal)
    │   └── layout/ (Navbar, ProtectedRoute)
    └── pages/
        ├── LoginPage.jsx
        ├── DashboardPage.jsx
        ├── EventDetailPage.jsx
        └── SettingsPage.jsx
```

## License

MIT
