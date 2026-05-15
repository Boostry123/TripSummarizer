# TripSummarizer

## Project Vision
TripSummarizer is a web application designed to capture and synthesize travel experiences. Users log their trips, rating specific activities and providing free-text narratives. The core value proposition is an AI-driven engine that analyzes this accumulated personal data to understand a user's unique preferences, enabling pinpoint recommendations for future travels based on their historical "likes" and "dislikes."

## Core Mandates
- **Documentation Policy**: This `GEMINI.md` file MUST be updated whenever a major feature is added, folder structures are modified, or significant architectural decisions are made. It serves as the primary context for the project.
- **Surgical Modification Policy**: DO NOT change code that is unnecessary. Only update and change what is actually relevant to the specific task assigned. Maintain existing patterns and avoid unrelated refactoring.
- **Validation Mandate**: After every code modification, you MUST verify the changes by running the project's validation script (`npm run validate` in either the Web or Server directory) to ensure no regressions, linting issues, or TypeScript errors were introduced.

## Tech Stack
- **Frontend**: React (Vite), TypeScript, Tailwind CSS 4, TanStack React Query (Caching)
- **Backend**: Node.js (v26.1.0+), Express, TypeScript, tsx (for dev), Zod (Validation)
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **AI**: Gemini API (for context traversal and recommendations)

## Architecture
### Server (`/Server`)
- `src/Config`: Database initialization (`Db.ts`).
- `src/Routes`: API endpoints.
- `src/Controllers`: Request handling logic.
- `src/Types`: TypeScript interfaces (Database schema & Zod types).
- `src/Service`: Business logic and AI integration.
- `src/Middleware`: Authentication and Zod `validate.ts` middleware.

### Web (`/Web`)
- `src/Apis`: Services for backend communication.
- `src/Components`: Reusable UI elements.
- `src/Pages`: Top-level route components.
- `src/hooks`: Custom React hooks.
- `src/Helper`: Utility functions.
- `src/Types`: Shared TypeScript types.

## Database Schema

### `profiles` (Table)
Linked 1:1 with `auth.users`. Automatically managed via triggers.
- `id`: `uuid` (Primary Key, references `auth.users.id`)
- `email`: `text` (Unique, non-nullable)
- `name`: `text` (Nullable)
- `updated_at`: `timestamp with time zone` (Default: `now()`)

### `trips` (Table)
Stores user travel logs.
- `id`: `uuid` (Primary Key, Default: `gen_random_uuid()`)
- `user_id`: `uuid` (Foreign Key, references `public.profiles.id`)
- `country`: `text` (Non-nullable)
- `city`: `text[]` (Non-nullable)
- `travel_date`: `date` (Non-nullable)
- `rating`: `smallint` (Non-nullable, Constraint: 1-5)
- `likes`: `text[]` (Default: `[]`)
- `hates`: `text[]` (Default: `[]`)
- `free_text`: `text` (Nullable)
- `created_at`: `timestamp with time zone` (Default: `now()`)

## Database & Security
- **Strict Isolation**: Row Level Security (RLS) is enabled on all tables.
- **RLS Policies**:
  - `profiles`: Users can only `SELECT` and `UPDATE` their own record (`auth.uid() = id`).
  - `trips`: Users have full CRUD access ONLY to records where `auth.uid() = user_id`.
- **Stateless Server Strategy**:
  - The server client uses `SUPABASE_ANON_KEY` to ensure RLS compliance.
  - `persistSession` and `autoRefreshToken` are disabled.
  - Every request requiring DB access MUST pass the user's JWT from the `Authorization` header.
  - The service layer instantiates a request-scoped Supabase client using `getSupabaseClient(token)` from `Db.ts` to perform operations under the user's identity, ensuring RLS enforcement.
- **Client-side Auth Persistence**:
  - **Strict Storage**: The JWT is stored in `localStorage` under the key `Token` with the format `Bearer <JWT>`.
  - **Memory-only User State**: The user profile object is kept in the Zustand store memory and NOT persisted to `localStorage` for security and freshness.
  - **Total Cleanup**: On signout, `localStorage.clear()` is called to ensure no residual auth data remains on the client.

## Development Roadmap
1. [x] Project Initialization & Config (TypeScript, Express, React, Tailwind 4)
2. [x] Basic Landing Page UI (Refactored into `HomePage.tsx`)
3. [x] Trip Entry System (Multi-stage `TravelLogPage`)
4. [x] Authentication UI (Login & Signup components, `AuthPage`)
5. [x] Database Schema & Server-side Validation (Supabase + Zod)
6. [x] API Implementation (Routes & Controllers for Auth, Trips & Profiles)
7. [x] Frontend Integration (Connecting Web to Server for Auth, Trip Logging & Profile Management)
8. [ ] AI Context Integration & Recommendation Engine
9. [ ] Polish & Visual Refining
