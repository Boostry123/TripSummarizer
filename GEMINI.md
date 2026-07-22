# TripSummarizer

## Project Vision

TripSummarizer is a web application designed to capture and synthesize travel experiences. Users log their trips, rating specific activities and providing free-text narratives. The core value proposition is an AI-driven engine that analyzes this accumulated personal data to understand a user's unique preferences, enabling pinpoint recommendations for future travels based on their historical "likes" and "dislikes." It will then generate a recommendation and will wait for additional requests to even further pinpoint the perfect trip.

## Core Mandates

- **Documentation Policy**: This `GEMINI.md` file MUST be updated whenever a major feature is added, folder structures are modified, or significant architectural decisions are made. It serves as the primary context for the project.
- **Surgical Modification Policy**: DO NOT change code that is unnecessary. Only update and change what is actually relevant to the specific task assigned. Maintain existing patterns and avoid unrelated refactoring.
- **Validation Mandate**: After every code modification, you MUST verify the changes by running the project's validation script (`npm run validate` in either the Web or Server directory) to ensure no regressions, linting issues, or TypeScript errors were introduced.

## Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS 4, TanStack React Query (Caching)
- **Backend**: Node.js (v26.1.0+), Express, TypeScript, tsx (for dev), Zod (Validation), Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS) & Drizzle ORM
- **AI**: TanStack AI with Ollama (Local LLM - qwen3:8B)

## Architecture

### Server (`/Server`)

- `src/Config`: Supabase & Database configuration (`Db.ts`).
- `src/Db`: Drizzle ORM configuration, client connection (`Client.ts`), table schemas (`Schema.ts`), and SQL migrations (`Migrations/`).
- `src/Routes`: API endpoints (`chatBotRoutes.ts`).
- `src/Controllers`: Request handling logic.
- `src/Types`: TypeScript interfaces (Database schema & Zod types).
- `src/Service`: Business logic and AI integration (`chatBotService.ts`).
- `src/Middleware`: Authentication and Zod `validate.ts` middleware.
- **npm Scripts** ([package.json](file:///F:/coding/web-dev/TripSummarizer/Server/package.json)):
  - `npm run dev`: Starts local Express dev server with hot-reloading (`tsx watch src/index.ts`).
  - `npm run dev:docker`: Starts the app inside Docker using tsx (`tsx src/index.ts`).
  - `npm run build`: Compiles TypeScript and runs `tsc-alias` to rewrite import paths.
  - `npm start`: Runs the compiled production code from `dist/src/index.js`.
  - `npm run lint`: Runs ESLint checks.
  - `npm run validate`: Runs lint and build sequentially to verify project correctness.
  - `npm run test`: Initiates the Vitest suite in watch mode.
  - `npm run db:generate`: Generates SQL migration scripts using Drizzle Kit.
  - `npm run db:migrate`: Executes pending SQL migrations against the database.
  - `npm run db:studio`: Opens Drizzle Studio visual database inspector.

### Web (`/Web`)

- `src/Apis`: Services for backend communication (`chatService.ts`).
- `src/Components`: Organized UI elements:
  - `Auth/`: Authentication forms (Login, Signup).
  - `Common/`: Reusable base components (Card, BaseEntryForm).
  - `Layout/`: Structural components (Navbar, Footer, Layout).
  - `Trip/`: Trip-specific UI (Forms, Modals).
- `src/Pages`: Top-level route components (`RecommendationPage.tsx`).
- `src/hooks`: Custom React hooks.
- `src/Helper`: Utility functions.
- `src/Types`: Shared TypeScript types.
- **npm Scripts** ([package.json](file:///F:/coding/web-dev/TripSummarizer/Web/package.json)):
  - `npm run dev`: Boots Vite development server with host access enabled (`vite --host`).
  - `npm run build`: Compiles production assets into `/dist`.
  - `npm run preview`: Launches a local preview server for the compiled production builds.
  - `npm run lint`: Runs ESLint checks.
  - `npm run validate`: Performs ESLint check, strict TypeScript type check (`tsc --noEmit`), and build compilation.

## Database Schema

### `profiles` (Table)

Linked 1:1 with `auth.users`. Automatically managed via triggers.

- `id`: `uuid` (Primary Key, references `auth.users.id`)
- `email`: `text` (Unique, non-nullable)
- `name`: `text` (Nullable)
- `phone_number`: `varchar(20)` (Unique, Nullable)
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
  - **Strict Storage**: The JWT is stored in `localStorage` under the key `Token` as a JSON object containing `token`, `refreshToken`, and `expiresAt`.
  - **Refresh Mechanism**: A 45-minute timeout is enforced in the store. The `useAuth` hook monitors expiration and automatically uses the `refreshToken` to fetch a new session before the access token expires.
  - **Memory-only User State**: The user profile object is kept in the Zustand store memory and NOT persisted to `localStorage` for security and freshness.
  - **Total Cleanup**: On signout, `localStorage.clear()` is called to ensure no residual auth data remains on the client.

## Server Testing

The backend tests are run using **Vitest** to ensure correctness of core business services and input validations.

- **Configuration**: Managed in [vitest.config.ts](file:///F:/coding/web-dev/TripSummarizer/Server/vitest.config.ts), setting up path aliases (`@/` mapping to `Server/src/`) and test exclusion patterns.
- **Commands**:
  - Run tests in watch mode: `npm run test` (or `npx vitest`) from the `Server/` directory.
  - Run tests once: `npm test -- --run`
- **Test Categories**:
  - **Services** (located in [Server/tests/Services/](file:///F:/coding/web-dev/TripSummarizer/Server/tests/Services)):
    - [tripService.test.ts](file:///F:/coding/web-dev/TripSummarizer/Server/tests/Services/tripService.test.ts): Mocks [getSupabaseClient](file:///F:/coding/web-dev/TripSummarizer/Server/src/Config/Db.ts) and tests the [getTrips](file:///F:/coding/web-dev/TripSummarizer/Server/src/Service/tripService.ts) service method. Verifies success path querying the `trips` table sorted by `created_at` descending, and verifies appropriate error propagation when database queries fail.
  - **Validation & Types** (located in [Server/tests/Types/](file:///F:/coding/web-dev/TripSummarizer/Server/tests/Types)):
    - [validation.test.ts](file:///F:/coding/web-dev/TripSummarizer/Server/tests/Types/validation.test.ts): Tests schemas defined in [validation.ts](file:///F:/coding/web-dev/TripSummarizer/Server/src/Types/validation.ts):
      - [LoginSchema](file:///F:/coding/web-dev/TripSummarizer/Server/src/Types/validation.ts#L6): Validates inputs for format compliance, including email formatting and minimum password length constraints.
      - [TripSchema](file:///F:/coding/web-dev/TripSummarizer/Server/src/Types/validation.ts#L35): Validates fields required for logging trips, including non-empty string and array validations, support for YYYY-MM-DD or ISO 8601 date formats, rating range limits (1-5), and numeric integer constraints.

## Development Roadmap

1. [x] Project Initialization & Config (TypeScript, Express, React, Tailwind 4)
2. [x] Basic Landing Page UI (Refactored into `HomePage.tsx`)
3. [x] Trip Entry System (Multi-stage `TravelLogPage`)
4. [x] Authentication UI (Login & Signup components, `AuthPage`)
5. [x] Database Schema & Server-side Validation (Supabase + Zod)
6. [x] API Implementation (Routes & Controllers for Auth, Trips & Profiles)
7. [x] Frontend Integration (Connecting Web to Server for Auth, Trip Logging & Profile Management)
8. [x] AI Context Integration & Recommendation Engine
9. [ ] Polish & Visual Refining
