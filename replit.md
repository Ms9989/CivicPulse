# CivicPulse AI

AI-powered civic decision intelligence platform for municipalities — analyze complaints, prioritize critical issues, and optimize departmental workflows with Google Gemini AI.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/civic-pulse run dev` — run the frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL`, `GEMINI_API_KEY`, `SESSION_SECRET`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, Recharts, shadcn/ui, next-themes
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- AI: Google Gemini (`@google/genai`) via `lib/integrations-gemini-ai`
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source-of-truth API contract
- `lib/db/src/schema/` — Drizzle schema: users, departments, complaints, insights
- `artifacts/api-server/src/routes/` — Express route handlers (auth, complaints, departments, analytics, ai)
- `artifacts/civic-pulse/src/pages/` — React pages (Landing, Login, Signup, Dashboard, Complaints, Analytics, Insights, Departments, DepartmentDetail, NewComplaint)
- `artifacts/civic-pulse/src/lib/AuthContext.tsx` — JWT auth context (token stored in localStorage as `civicpulse_token`)
- `lib/integrations-gemini-ai/src/client.ts` — Gemini AI client (uses `GEMINI_API_KEY`)

## Architecture decisions

- JWT auth: tokens issued by the API are stored in `localStorage`, passed as `Authorization: Bearer <token>` header
- `@google/genai` must be a direct dependency of `artifacts/api-server` (esbuild externalizes `@google/*` patterns, so it cannot be a transitive dep only)
- All API types come from generated code (`lib/api-client-react`, `lib/api-zod`) — do not hand-write request/response types
- `staggerItem` in `PageTransition.tsx` uses `type: "spring" as const` to satisfy Framer Motion's strict `AnimationGeneratorType` union
- Analytics and dashboard data are computed from the complaints/departments tables on each request (no caching layer)

## Product

- **Landing page**: marketing page with CTA to sign up or view demo
- **Auth**: email/password signup and login with JWT tokens
- **Dashboard**: real-time KPIs (total, critical, resolved, pending), department workload chart, priority distribution, recent incidents table
- **Complaints (Incident Directory)**: filterable/searchable table with status/priority dropdowns, AI analysis trigger, delete
- **New Complaint**: form to submit a new civic complaint with AI auto-analysis
- **Analytics**: 30-day trend chart, category pie chart, ward distribution bar chart, department performance table
- **AI Insights**: Gemini-powered city pulse report, department efficiency scoring, category trends
- **Departments**: department cards with stats; Department Detail with complaints breakdown

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after any OpenAPI spec change before editing frontend hooks
- `pnpm --filter @workspace/db run push` must be run after DB schema changes (dev only; production uses migrations)
- Do not add leaf workspace packages (civic-pulse, api-server) to the root `tsconfig.json` references
- The API server binds to `PORT` env var (workflow sets it to 8080); never hardcode ports

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
