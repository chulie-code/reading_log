# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint (eslint-config-next)
```

There is no test runner configured.

> **Next.js 16** — see `@AGENTS.md`. APIs differ from older training data; consult `node_modules/next/dist/docs/` before writing Next.js code. A concrete example already in this repo: middleware lives in **`proxy.ts`** (root) and exports a `proxy()` function, not `middleware.ts`.

## Architecture

A Korean-language reading-log app ("독자저자"). Two surfaces share one codebase:

1. **Public landing page** (`app/page.tsx` + `components/sections/*`) — marketing site with a waitlist form. All copy is centralized in `lib/site.ts` (edit `BRAND` to rename the service).
2. **Authenticated app** (`app/dashboard/*`) — the actual product: track books, jot notes, and generate AI digests.

### Auth (Supabase SSR)

Built on `@supabase/ssr`. Three client factories in `lib/supabase/`, each for a different runtime context — **do not mix them up**:

- `server.ts` → `createClient()` for Server Components / Server Actions / Route Handlers (reads `cookies()`).
- `client.ts` → browser client.
- `middleware.ts` → `updateSession()`, called from `proxy.ts` on every matched request to refresh the auth token cookie.

Conventions:
- Identify the user with `supabase.auth.getClaims()` and read `claims.sub` (the user id) — **not** `getUser()`. See `requireUserId()` in `app/dashboard/actions.ts`, the standard gate that redirects to `/login` when unauthenticated.
- In `lib/supabase/middleware.ts`, never insert code between `createServerClient(...)` and `getClaims()` — it breaks token-refresh timing.
- Email signup redirects to `app/auth/confirm/route.ts`, which calls `verifyOtp`. Supabase dashboard email-template/redirect-URL config must match (see the user's memory note).

### Data mutations (Server Actions)

All writes go through `"use server"` actions (`app/dashboard/actions.ts`, `app/auth/actions.ts`), wired to forms via React 19 `useActionState`. Actions return a typed state object (`{ error?, message? }` / `{ data?, error? }`) for inline form feedback. Patterns to follow:
- Validate/whitelist inputs server-side (e.g. `BOOK_STATUSES`, `NOTE_TYPES`).
- Even though RLS scopes rows to the user, **also** add `.eq("user_id", userId)` on updates/deletes as defense-in-depth.
- Call `revalidatePath(...)` after mutations.

**Postgres tables** (Supabase, RLS-protected, not in repo): `books`, `notes` (FK to books, cascade delete), `digests` (stores AI output as JSON; new row per generation to preserve history).

### AI digests (OpenRouter)

`lib/openrouter.ts` is `import "server-only"` (keeps `OPENROUTER_API_KEY` out of client bundles). `createDigest()` calls OpenRouter's chat-completions API with a strict `json_schema` response format and a Korean reading-coach system prompt, returning a typed `ReadingDigest`. It retries once and strips code-fences before `JSON.parse`. Model defaults to `anthropic/claude-opus-4.8`, overridable via `OPENROUTER_MODEL`. Invoked from the `requestDigest` action; rendered by `components/ai-digest.tsx`.

### Waitlist (MVP shortcut)

`app/actions/waitlist.ts` writes emails to a local JSON file at `data/waitlist.json` via `node:fs` — a deliberate placeholder. Swap only the read/write helpers when moving to a real DB. (Note: local-file persistence won't survive on serverless/Vercel — migrate before relying on it in production.)

## Conventions

- Path alias `@/*` maps to the repo root (`@/lib/...`, `@/components/...`).
- Code comments and all user-facing strings are in Korean.
- Styling is Tailwind CSS v4 (config via `postcss.config.mjs`; no `tailwind.config.js`).

## Environment variables

`.env.local` (not committed):
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase client.
- `OPENROUTER_API_KEY` — **server-only; never prefix with `NEXT_PUBLIC_`**.
- `OPENROUTER_MODEL` — optional model override.

## 한국어로 답하기

- 응답은 항상 한국어로.
- 어려운 용어 쓰지 말고 초보자한테 말하듯이 설명해줘.
- 결과만 보여주지 말고 다음에 뭘 해야 하는지도 알려줘.