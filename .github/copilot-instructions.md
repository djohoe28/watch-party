<!-- Copilot / AI agent instructions for contributors and automated agents -->
# Project quick notes for AI contributors

This file captures the specific, discoverable rules and patterns that make an AI coding agent immediately productive in this repo.

## Quick commands
- Install & dev: `npm install` then `npm run dev` (Vite)
- Firebase emulators (local data): `npm run emulate-firestore:io` or `npm run emulate-firestore`
- Build: `npm run build`

## Big-picture architecture (why it is organized this way)
- Frontend: React + TypeScript + Vite + MUI. App entry: `src/main.tsx`. Pages/layouts live under `src/layouts/`.
- Firebase back-end: initialization and app-wide Firebase wiring in `src/services/Firebase/Firebase.service.ts`. Auth & Firestore helpers live in `src/services/Firebase/` and the Firestore wrapper is `src/services/Firestore.service.ts`.
- Data layering: App domain models live in `src/models/App/` while Firestore-specific types/documents live in `src/models/DB/`. Converters mapping DB <-> App models are in `src/services/Converters/`.
- State wiring: Context providers live in `src/layouts/Providers/` and surface hooks in `src/hooks/` so components consume a consistent async contract.

## Project-specific conventions (must follow)
- Path aliases: use TypeScript aliases from `tsconfig.json` (examples: `@services/*`, `@layouts/*`, `@hooks/*`). Example import: `import { firestoreDb } from "@services/Firebase/Firestore.service";`.
- Async hook contract: hooks return the AsyncContext shape: `{ payload, loading, error }` (see `src/types/AsyncContext.ts` and `src/hooks/useAuthState.ts`). New hooks/components must follow this pattern.
- Providers pattern: expose contexts via providers in `src/layouts/Providers/` (e.g., `AuthProvider.tsx`, `RoomDataProvider.tsx`). Keep provider responsibilities small: sign-in/session, room state, members list, references.
- Firebase emulator awareness: code uses `import.meta.env.DEV` to switch emulator logic. Env vars are `VITE_FIREBASE_*` and emulator hosts/ports (`VITE_FIREBASE_FIRESTORE_EMULATOR_HOST`, `VITE_FIREBASE_FIRESTORE_EMULATOR_PORT`). Local emulator data folder: `firestore.local/`.
- TypeScript: `tsconfig.json` uses `strict` — produce strictly typed code and prefer adding minimal narrowing helpers rather than suppressing errors.

## Typical change flow (checklist for implementing features/fixes)
1. Update or add App model (`src/models/App/`) and DB model (`src/models/DB/`) if shape changes.
2. Add/modify a Firestore converter in `src/services/Converters/` to map DB ↔ App types.
3. Update `src/services/Firestore.service.ts` only if a new collection-level helper is needed.
4. Add a hook in `src/hooks/` that returns `{ payload, loading, error }` and keeps side effects isolated.
5. Surface the hook via a Provider in `src/layouts/Providers/` if it represents app-level state.
6. Use path aliases when importing and update consumers under `src/layouts/`, `src/components/` or pages.

## Integration points to inspect when making changes
- Auth & session: `src/hooks/useAuthState.ts` and `src/layouts/Providers/AuthProvider.tsx` (anonymous sign-in fallback logic lives here).
- Firestore access: `src/services/Firestore.service.ts` and converters in `src/services/Converters/` (e.g. `Member.converter.ts`, `Message.converter.ts`).
- Media flow: media-related components and forms under `src/layouts/Media/` and `src/models/App/MediaState.model.ts`.

## Developer workflows & gotchas
- Emulators: npm scripts expect `firestore.local/` for import/export. CI that runs emulator-dependent tests must provide that folder or mock Firestore.
- DEV flags: many code paths check `import.meta.env.DEV` — when running tests or CI, set this appropriately to exercise emulator logic.
- Keep changes backward-compatible: providers and hooks are widely consumed; prefer additive changes and default fallbacks.

## Useful file pointers (quick references)
- App entry: `src/main.tsx`
- Firebase init: `src/services/Firebase/Firebase.service.ts`
- Firestore wrapper: `src/services/Firestore.service.ts`
- Converters: `src/services/Converters/*` (e.g., `Member.converter.ts`)
- Hooks: `src/hooks/*` (e.g., `useAuthState.ts`, `useRoomReferences.ts`)
- Providers: `src/layouts/Providers/*` (e.g., `AuthProvider.tsx`, `RoomDataProvider.tsx`)
- Models: `src/models/App/` and `src/models/DB/`

If anything here is unclear or you'd like more examples (converter pattern, hook tests, or emulator setup for CI), say which area and I'll expand with concrete snippets and a small test harness.
