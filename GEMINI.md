# TripSummarizer

## Project Vision
TripSummarizer is a web application designed to capture and synthesize travel experiences. Users log their trips, rating specific activities and providing free-text narratives. The core value proposition is an AI-driven engine that analyzes this accumulated personal data to understand a user's unique preferences, enabling pinpoint recommendations for future travels based on their historical "likes" and "dislikes."

## Core Mandates
- **Documentation Policy**: This `GEMINI.md` file MUST be updated whenever a major feature is added, folder structures are modified, or significant architectural decisions are made. It serves as the primary context for the project.
- **Surgical Modification Policy**: DO NOT change code that is unnecessary. Only update and change what is actually relevant to the specific task assigned. Maintain existing patterns and avoid unrelated refactoring.
- **Validation Mandate**: After every code modification, you MUST verify the changes by running the project's build, linting, or type-checking commands (e.g., `npm run build` or `npx tsc --noEmit` in the Web project) to ensure no regressions or TypeScript errors were introduced.

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
- `city`: `text` (Non-nullable)
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
  - Every request requiring DB access MUST pass the user's JWT from the `Authorization` header to `supabase.auth.setSession()`.
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
6. [x] API Implementation (Routes & Controllers for Auth)
7. [x] Frontend Integration (Connecting Web to Server for Auth)
8. [ ] API Implementation (Trips & Profiles)
9. [ ] Frontend Integration (Trip Logging & Profile Management)
10. [ ] AI Context Integration & Recommendation Engine

## Changelog
- **2026-05-11**: Hardened and standardized `.gitignore` files across root, Server, and Web directories to prevent accidental leaks of secrets and unnecessary metadata.
- **2026-05-11**: Standardized and professionalized authentication naming conventions.
  - Renamed `getMe` to `getCurrentUser` across all layers (Service, Controller, Hooks).
  - Updated the API endpoint from `/auth/me` to `/auth/profile` for improved clarity.
- **2026-05-11**: Fixed authentication state inconsistency and implemented profile hydration.
  - Added `/auth/me` endpoint to the server to fetch user profile details.
  - Refactored `useAuth` hook in the Web project to automatically fetch and sync the user profile if a token exists.
  - Standardized `Navbar`, `HomePage`, and `ProtectedRoute` to use the `useAuth` hook for a consistent authenticated experience.
  - Ensured `localStorage` persistence only stores the token, while user data remains in memory.
- **2026-05-11**: Integrated TanStack React Query for client-side caching and state management.
  - Configured `QueryClientProvider` with global defaults in `App.tsx`.
  - Established a pattern for React Query custom hooks in `src/hooks` (e.g., `useAuth.ts`).
  - Added React Query DevTools for enhanced development debugging.
- **2026-05-11**: Implemented strict Token persistence and resolved project-wide TypeScript errors.
  - Refactored `authStore.ts` with a custom storage handler to enforce `localStorage` key `Token` and `Bearer <JWT>` formatting.
  - Configured `partialize` to ensure only the token is persisted while keeping user state in memory.
  - Updated `apiClient.ts` to utilize the pre-formatted token and added Vite client type references.
  - Performed a final cleanup of unused imports and variables, achieving a zero-error `tsc` build.
- **2026-05-11**: Updated project and environment to Node.js v26.1.0 (Current). Added `.nvmrc` files and updated `package.json` engines.
- **2026-05-11**: Completed end-to-end Authentication flow.
  - Decoupled Server types from Web types for better architectural separation.
  - Refactored Server middleware (`auth.ts`, `validate.ts`) and controllers to eliminate `any` and enforce strict typing.
  - Integrated `authService` and `authStore` into Web components (`LoginForm`, `Signup`, `Navbar`).
  - Implemented `ProtectedRoute` and standardized routing between Home, Auth, and Travel Log pages.
- **2026-05-11**: Renamed `RegisterForm` to `Signup` component for better clarity and consistency as per user request. Updated `AuthPage` to integrate the new `Signup` component.
- **2026-05-10**: Initial project setup. Configured Server (tsx/Express) and Web (React/Tailwind 4). Added robust `.gitignore` files. Implemented initial Landing Page and refactored into `HomePage.tsx`. Added `GEMINI.md` with documentation mandates.
- **2026-05-10**: Implemented `TravelLogPage` and multi-stage `TripEntryForm`. Added ability to log location, ratings, likes/dislikes, and free-text narratives. Updated `GEMINI.md` roadmap.
- **2026-05-10**: Centralized TypeScript definitions into `Web/src/Types/trip.ts` and refactored components for better type reusability and cleanliness.
- **2026-05-10**: Implemented `useMobile` custom hook and optimized `HomePage`, `TravelLogPage`, and `TripEntryForm` for mobile responsiveness. Added programmatic layout adjustments and specialized mobile styling.
- **2026-05-10**: Removed "See How It Works" placeholder button from HomePage to streamline the user flow.
- **2026-05-10**: Implemented `FeaturesPage` and `AboutPage` with detailed project information and updated site-wide navigation.
- **2026-05-10**: Created a flexible, reusable `Card` component and refactored `HomePage`, `FeaturesPage`, and `TripEntryForm` to use it, ensuring UI consistency and reducing duplication.
- **2026-05-10**: Integrated `react-icons` throughout the project to minimize text and improve intuitive navigation. Refactorings include `TripEntryForm`, `HomePage`, and other pages.
- **2026-05-10**: Added **Surgical Modification Policy** to `GEMINI.md` to ensure focused and relevant code updates.
- **2026-05-10**: Implemented Authentication UI including `LoginForm`, `Signup` (previously `RegisterForm`), and a unified `AuthPage`. Set up centralized authentication types and integrated `/auth` routing. Updated `HomePage` call-to-actions to point to the authentication flow.
- **2026-05-10**: Established a global layout system with persistent `Navbar` and `Footer` components. Standardized site-wide navigation and added social links (GitHub, LinkedIn). Integrated the layout into `App.tsx` for consistent page structure.
- **2026-05-10**: Refined the `Navbar` by removing the redundant "Get Started" button to prioritize the primary CTA on the HomePage.
- **2026-05-10**: Established Supabase integration. Defined strict SQL schema with RLS and auto-profile triggers. Implemented Zod validation layer and middleware on the server. Configured RLS-compliant stateless Supabase client.
