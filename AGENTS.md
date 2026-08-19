# Azure Release Lab — Cursor agent notes

## Project

Tiny web board that shows which Azure lane the site is on (local, staging, production), plus the PR → staging → production-approval → nightly path.

## Stack

- Vite + React + TypeScript
- Playwright smoke tests in `tests/smoke/`
- Azure Pipelines via `azure-pipelines.yml` (environments `staging` and `production`)

## Conventions

- Recent runs: prefer `/api/runs` (live Azure); fall back to `src/data/mockPath.ts`
- Keep the Playwright suite tiny (about 5 tests). Do not grow it into a giant regression pack
- Never commit `.env`, Vercel tokens, Azure PATs, or GitHub tokens
- No employer names or private details in code, README, UI, or commits
- Keep README and UI in product/lab language
- This lab is web only (no mobile / CTV pipelines)

## Scripts

- `npm run dev` — local board
- `npm run build` — production bundle
- `npm run test:smoke` — Playwright smokes
- `npm run preview` — preview built app

## Related docs

- `README.md` — what the lab is + quick start
- `docs/AZURE_SETUP.md` — Azure environments, Vercel secrets, walking the path
