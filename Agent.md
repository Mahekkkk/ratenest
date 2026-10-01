# Agent.md

Working guide for AI agents (and humans) on RateNest. Read `PROJECT_DOCUMENTATION.md` for the full spec. This file holds the rules for working in the repo and the running status log.

## Project

RateNest: store rating platform. Roles: `ADMIN`, `USER`, `STORE_OWNER`. One login, role decides the dashboard.

| Layer    | Stack                                        | Path        |
| -------- | -------------------------------------------- | ----------- |
| Frontend | React 19, Vite, react-router-dom, plain CSS  | `client/`   |
| Backend  | Node, Express 5, JWT, bcryptjs, express-validator | `server/` |
| Database | MySQL (`database/schema.sql`)                | `database/` |

API base: `http://localhost:5000/api` (override in client with `VITE_API_URL`).

## Rules for every change

1. **Commit and push every change or update.** One logical change per commit, then `git push origin main`.
2. **No co-author lines.** Never add `Co-Authored-By` or "Generated with" trailers to commits or PRs.
3. Commit messages use Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `chore:`.
4. Never commit `.env`, secrets, `node_modules`, or `dist`.
5. Update the **Status log** below in the same commit as the work it describes.
6. Backend enforces auth and roles. Frontend route guards are for UX only.
7. Only claim features in README/docs that are actually implemented.

## Frontend skills (`web-dev-skills/`)

- `design-taste/` and `prompt.txt` are the standing checklist for UI work: state a Design Read, apply the Operate-mode rules, design all 8 interaction states (default, hover, focus, active, disabled, loading, error, success), respect `prefers-reduced-motion`, no em dashes in copy, no AI-slop defaults.
- `react-frontend/`, `express-api/`, `innolance-lms-fullstack/` were written for another project (TypeScript, Wouter, Drizzle). Use them for general discipline only. RateNest uses JavaScript, react-router-dom, and MySQL via `mysql2`.
- Verify before done: `npm run lint`, `npm run build`, click through each role in a browser.

## Frontend conventions

- All API calls go through `client/src/services/api.js`. Components never call `fetch` directly.
- Auth state lives in `client/src/context/AuthContext.jsx` (token + user in `localStorage`).
- Route guards: `ProtectedRoute` (logged in) and `RoleRoute` (role match).
- Styling: CSS custom properties in `client/src/styles/tokens.css`, component styles in `client/src/styles/app.css`. No inline `style` props except dynamic values.
- Validation rules mirror the server (name 20-60, address max 400, password 8-16 with an uppercase and a special character).

## Run locally

```bash
# backend
cd server && npm install && npm run dev
# frontend
cd client && npm install && npm run dev
```

Seed admin: `node server/createAdmin.js` (see the script for credentials).

## Status log

| Date       | Change                                                                 |
| ---------- | ---------------------------------------------------------------------- |
| 2026-10-02 | Added Agent.md. Starting frontend rebuild: routing, auth context, design system, role pages. |
| 2026-10-02 | Frontend rebuilt: react-router routes, AuthContext, role guards, design tokens, all role pages (login, register, admin, user, owner). Server: store validation applied, duplicate route removed. Lint and build pass; not yet tested against a live MySQL. |
