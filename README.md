# TripSummarizer 🌎✈️

TripSummarizer is an AI-powered travel log synthesizer and recommendation web application. Users can record detailed logs of their past trips, rate specific locations/activities, and express likes, hates, and narratives. The core engine analyzes this accumulated personal history using local AI models to understand their unique travel preferences and generate personalized recommendations for their next adventure.

---

## 🏗️ Architecture & Project Structure

The project is divided into a client-side frontend and a server-side backend:

- **/Web**: Frontend application built with React, Vite, Tailwind CSS 4, and TypeScript.
- **/Server**: Backend application built with Node.js, Express, TypeScript, and Supabase client integration.

```
TripSummarizer/
├── docker-compose.yml           # Production Docker setup
├── docker-compose.override.yml  # Development overrides
├── GEMINI.md                    # Core project documentation
├── Server/                      # Express Backend
│   ├── src/                     # Source files (Config, Controllers, Db, Routes, Services, Types)
│   ├── tests/                   # Service and type validations (Vitest)
│   ├── drizzle.config.ts        # Drizzle ORM configuration
│   ├── package.json
│   └── tsconfig.json
└── Web/                         # React Frontend
    ├── src/                     # Components, pages, hooks, APIs
    ├── public/                  # Static assets
    ├── package.json
    └── tsconfig.json
```

---

## 🛠️ Tech Stack

### Frontend (`/Web`)

- **Framework**: [React](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching/Caching**: [TanStack React Query v5](https://tanstack.com/query/latest)
- **Routing**: [React Router v7](https://reactrouter.com/)

### Backend (`/Server`)

- **Runtime**: [Node.js](https://nodejs.org/) (v26.1.0+)
- **Server**: [Express](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) with `tsx` (TypeScript Execute) for hot reloading
- **ORM / Migrations**: [Drizzle ORM](https://orm.drizzle.team/) & Drizzle Kit

### Database & AI

- **Database**: [Supabase (PostgreSQL)](https://supabase.com/) with Row Level Security (RLS) policies & Drizzle ORM
- **AI Integration**: [TanStack AI](https://tanstack.com/) with [Ollama](https://ollama.com/) (running `qwen3:8B` locally) or Gemini API.

---

## 🚀 Setup & Installation

### Step 1: Environment Setup

Before running the application (either via Docker or locally), you must configure the environment variables for both the frontend and the backend.

#### 1. Server Environment (`/Server`):

Copy the example environment file:

```bash
cp Server/.env.example Server/.env
```

Open `Server/.env` and update the values:

- `PORT`: Server port (default: `3001`).
- `BASE_FRONTEND_URL`: URL of the frontend (default: `http://localhost:5173`).
- `DB_PASSWORD`: Your Supabase database password.
- `SUPABASE_URL`: Your Supabase API endpoint.
- `SUPABASE_ANON_KEY`: Your Supabase anonymous client key.
- `GEMINI_API_KEY`: API Key for Gemini models (if using Gemini).
- `AI_PROVIDER`: The LLM engine to use (`ollama` or `gemini`).
- `OLLAMA_HOST`: The API host for local Ollama instance (default: `http://127.0.0.1:11434`).

#### 2. Web Environment (`/Web`):

Copy the example environment file:

```bash
cp Web/.env.example Web/.env
```

Open `Web/.env` and update:

- `VITE_API_URL`: URL pointing to the backend server (default: `http://localhost:3001`).

---

### Option A: Running with Docker (Recommended)

Docker Compose is configured with multi-stage builds and automatically merges the base configuration and development overrides when present.

#### Development Mode (With Hot Reloading)

By default, Docker Compose loads the base file and merges `docker-compose.override.yml`:

```bash
docker compose up --build
```

- **Web App**: Accessible at `http://localhost:5173`
- **Server API**: Accessible at `http://localhost:3001`

#### Production Mode

To run the production environment (ignoring the development overrides):

```bash
docker compose -f docker-compose.yml up --build
```

- **Web App**: Accessible at `http://localhost:80`
- **Server API**: Accessible at `http://localhost:3001`

---

### Option B: Local Installation (Manual Setup)

Ensure you have completed **Step 1: Environment Setup** above.

#### 1. Run the Server

```bash
cd Server
npm install
npm run dev

# Database Management (Drizzle ORM)
npm run db:generate # Generate SQL migrations from schema
npm run db:migrate  # Apply migrations to database
npm run db:studio   # Launch Drizzle Studio visual inspector
```

#### 2. Run the Frontend

```bash
cd Web
npm install
npm run dev
```

---

## 🔒 Security & Database Strategy

- **Stateless Authorization**: Client authorization uses request-scoped JWT authentication via the `Authorization` header.
- **Supabase client**: The backend instantiates a request-scoped Supabase client under the user's specific token (`getSupabaseClient(token)`), ensuring strict Row Level Security (RLS) validation matching the logged-in user ID.
- **Client Storage**: User tokens are stored in `localStorage` under `Token` with a 45-minute timeout. On expiration, the auth hook uses the refresh token to renew the session.

---

## 🧪 Testing & Validation

Backend validation and services are fully covered by Vitest tests.

### Running Backend Tests

From the `/Server` directory:

- Run tests in watch mode: `npm run test`
- Run tests once: `npm test -- --run`

### Code Quality Validation

Both directories contain validation scripts checking TypeScript compilation and ESLint:

- **Server**: `npm run validate` (Runs ESLint and builds TS files)
- **Web**: `npm run validate` (Runs ESLint, `tsc --noEmit`, and builds production bundles)

---

## 📄 Documentation

For full implementation steps, development roadmap checkpoints, and detailed architectural notes, please see the [AGENTS.md](./AGENTS.md) file.

## License

Please infer to the LICENSE.md file as this project is forbiden to be taken for a commercial use.
