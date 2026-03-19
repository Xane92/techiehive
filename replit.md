# Techiehive

## Overview

Techiehive is a full-stack EdTech platform built with React (Vite) frontend and Node.js + Express backend in a pnpm monorepo.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/techiehive)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Styling**: Tailwind CSS v4 (CSS variable-based theming)

## Brand Colors

- **Primary**: `#F5C400` (yellow) — HSL: `48 100% 48%`
- **Background dark**: `#0A0A0A` (near black) — HSL: `0 0% 4%`
- **Surface**: `#111111` — HSL: `0 0% 7%`
- **Text light**: `#FFFFFF` — HSL: `0 0% 100%`
- **Text muted**: `#888888` — HSL: `0 0% 53%`

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── techiehive/         # React + Vite frontend (port 20149, preview path: /)
│   └── api-server/         # Express API server (preview path: /api)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — only emit `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Development Workflows

- Frontend: `pnpm --filter @workspace/techiehive run dev`
- Backend: `pnpm --filter @workspace/api-server run dev`
- DB push: `pnpm --filter @workspace/db run push`
- Codegen: `pnpm --filter @workspace/api-spec run codegen`

## Packages

### `artifacts/techiehive` (`@workspace/techiehive`)

React + Vite frontend. Currently shows the "Techiehive – Coming Soon" placeholder. Theme CSS variables are configured in `src/index.css`.

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for validation and `@workspace/db` for persistence.

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Schema goes in `src/schema/`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`).
