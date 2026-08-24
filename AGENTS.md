# TripSummarizer

## Project Vision

TripSummarizer is an AI-driven travel logging web application. Users log trips, rate activities, and provide narratives. The core engine uses a local LLM to analyze this historical data, understand unique preferences, and generate highly personalized recommendations for future travel.

## Core Directives for AI Agents

- **Documentation:** This `AGENTS.md` file MUST be updated upon major feature additions, structural changes, or architectural shifts.
- **Surgical Modifications:** DO NOT change unrelated code. Maintain existing patterns. Avoid opportunistic refactoring unless explicitly requested.
- **Validation:** After modifying code, you MUST run `npm run validate` in either the `/Web` or `/Server` directory to ensure no regressions, linting issues, or TypeScript errors were introduced.

## Tech Stack

- **Web (Frontend):** React (Vite), TypeScript, Tailwind CSS 4, TanStack React Query, Zustand
- **Server (Backend):** Node.js (v20+), Express, TypeScript, Zod, Drizzle ORM
- **Database:** Supabase (PostgreSQL) with strict Row Level Security (RLS)
- **AI Engine:** TanStack AI with Ollama OR Gemini API ( the switch happens in the .env file )

## Architectural Rules

### 1. Server Architecture & Data Flow

- **Pattern:** Route → Controller → Service → Database.
- **Validation:** All incoming payloads must be validated using Zod schemas located in `src/Types/validation.ts` via middleware.
- **Stateless Auth & RLS:**
  - The server is strictly stateless. `persistSession` and `autoRefreshToken` are disabled.
  - Every DB request MUST extract the user's JWT from the `Authorization` header.
  - The Service layer must instantiate a request-scoped Supabase client using `getSupabaseClient(token)` to enforce RLS under the user's identity.
  - Use `SUPABASE_ANON_KEY` for the server client to ensure RLS compliance.
- **Core API Endpoints:**
  - `/auth`: User registration, authentication, token refresh, and profile fetching.
  - `/trips`: Full CRUD operations for user trip logs.
  - `/chat`: AI recommendation generation and refinement (`POST /chat`). Supports continuous context by accepting `{ message, history, id? }`. Automatically handles auto-saving new sessions via `insertHistory` or updating existing sessions via `updateHistory` (stores the latest user adjustment and assistant recommendation).
  - `/history`: Recommendation history sessions (`GET /history` to list sessions ordered by `created_at DESC`, `DELETE /history?id=...` to remove a session).

### 2. Web (Client) Architecture

- **Auth Persistence:** JWTs are stored in `localStorage` (`Token`: `{ token, refreshToken, expiresAt }`).
- **Refresh Flow:** The `useAuth` hook monitors a 45-minute timeout and automatically fetches a new session via `refreshToken` before expiry.
- **State Management (Zustand):**
  - User profile object lives ONLY in `authStore` memory (never `localStorage`).
  - Active recommendation session state (`id`, `recommendation`, `history`) lives in `recommendationStore`.
- **Server State & Data Fetching (TanStack Query):**
  - `useHistory`: Queries `["history"]` for all user recommendation sessions and exposes `deleteHistory` mutation with automatic cache invalidation.
  - `useGenerateRecommendation`: Mutation hook executing recommendation generation/refinement, updating `recommendationStore`, and invalidating `["history"]` query cache.
- **UI Components:**
  - `HistoryDrawer`: Slide-over drawer displaying past recommendation sessions with resume and deletion capabilities.
  - `ConfirmationModal`: Reusable modal for destructive user actions (e.g., deleting history entries).
- **Cleanup:** `localStorage.clear()` and `useRecommendationStore.getState().clearHistory()` must be executed on sign-out.

## Database Schema (PostgreSQL / Drizzle)

- `profiles`: Linked 1:1 with `auth.users` via triggers.
  - Fields: `id` (uuid/PK), `email` (text/unique), `name`, `updated_at`.
  - RLS: Users can only `SELECT` and `UPDATE` where `auth.uid() = id`.
- `trips`: User travel logs.
  - Fields: `id` (uuid/PK), `user_id` (uuid/FK), `country`, `city` (text[]), `travel_date`, `rating` (smallint 1-5), `likes` (text[]), `hates` (text[]), `free_text`, `created_at`.
  - RLS: Full CRUD access ONLY where `auth.uid() = user_id`.
- `history`: AI recommendation chat history sessions.
  - Fields: `id` (uuid/PK defaultRandom), `user_id` (uuid/FK referencing `profiles.id` on delete cascade), `chat_history` (jsonb/Message[]), `created_at` (timestamp with timezone), `updated_at` (timestamp with timezone).
  - RLS: Full CRUD access ONLY where `auth.uid() = user_id`.

## Testing & Validation

- **Server Tests:** Vitest. Run using `npm run test` (watch mode) or `npm test -- --run` in `/Server`.
- **Key Test Areas:** Focus tests on Services (`historyService.test.ts`, `tripService.test.ts`) and Zod Validation schemas (`validation.test.ts`).
- **CI/Validation:** Use `npm run validate` (runs Lint + TS strict check + Build).

## Current Development Focus

- [x] Infrastructure, Auth, DB Schema, AI agent, Trip Entry UI, and Recommendation History Persistence (Auto-saving, Updating, Deletion, Drawer UI).
- [ ] **Next:** Polish & Visual Refining.
