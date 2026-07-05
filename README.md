# CivicPulse AI

CivicPulse AI is an AI-powered civic decision intelligence platform for municipalities. It helps city teams analyze complaints, prioritize critical issues, and improve departmental workflows using Google Gemini AI.

## Overview

The platform includes:
- A React + Vite frontend for public-facing and internal civic workflows
- An Express API server for authentication, complaints, analytics, and AI insights
- Shared libraries for API contracts, database schema, and AI integrations
- A mockup sandbox for UI experimentation

## Project Structure

```text
Civic-Pulse-AI/
├── artifacts/
│   ├── api-server/        # Express API server
│   ├── civic-pulse/       # React frontend
│   └── mockup-sandbox/    # UI mockup sandbox
├── lib/
│   ├── api-spec/          # OpenAPI spec and code generation
│   ├── api-client-react/  # Generated React API client
│   ├── api-zod/           # Generated Zod schemas/types
│   ├── db/                # Drizzle ORM schema and DB setup
│   └── integrations-gemini-ai/  # Gemini AI integration
├── scripts/               # Helper scripts
├── attached_assets/       # Supporting assets
├── package.json           # Root workspace scripts
├── pnpm-workspace.yaml    # pnpm workspace configuration
└── replit.md              # Existing project notes
```

## Tech Stack

- pnpm workspaces
- Node.js 24
- TypeScript 5.9
- React + Vite
- Tailwind CSS
- Framer Motion
- Recharts
- shadcn/ui
- Express 5
- PostgreSQL + Drizzle ORM
- Google Gemini AI
- Zod and Orval

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm
- PostgreSQL database

### Environment Variables

Set the following environment variables before running the project:

```bash
DATABASE_URL=
GEMINI_API_KEY=
SESSION_SECRET=
```

### Install Dependencies

```bash
pnpm install
```

### Run the Application

Start the API server:

```bash
pnpm --filter @workspace/api-server run dev
```

Start the frontend:

```bash
pnpm --filter @workspace/civic-pulse run dev
```

### Typecheck the Project

```bash
pnpm run typecheck
```

### Regenerate API Code

If the OpenAPI spec changes, regenerate the client and Zod schemas:

```bash
pnpm --filter @workspace/api-spec run codegen
```

### Push Database Schema Changes

```bash
pnpm --filter @workspace/db run push
```

## Features

- Landing page with sign-up and demo calls to action
- Authentication with JWT-based login and signup
- Dashboard with KPIs and civic incident insights
- Complaint directory with filtering and search
- New complaint submission with AI-assisted analysis
- Analytics views for trends, categories, and department performance
- AI insights powered by Gemini

## Notes

- The API server uses the PORT environment variable and should not be hardcoded.
- API types should be generated from the shared OpenAPI contract rather than handwritten.
- Database schema changes should be applied through the Drizzle workflow.

## License

MIT
