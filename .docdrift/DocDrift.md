# DocDrift Custom Instructions

## PR Guidelines
- Prefix all PR titles with `[docdrift]`
- Keep a professional, concise, and technically accurate tone
- Match the existing documentation style used in `content/docs/`

## Project Context
DataStack is a unified data platform with two main parts:
1. A Fumadocs-based documentation site (MDX content in `content/docs/`)
2. A versioned REST API at `/api/v1/` covering clusters, jobs, pipelines, notebooks, SQL warehouses, auth, users, webhooks, and workspaces

## Documentation Structure
- All doc content lives in `content/docs/` as MDX files with YAML frontmatter
- The Fumadocs source adapter is configured in `lib/source.ts` and `source.config.ts`
- Machine-readable doc indices are served at `/llms.txt` and `/llms-full.txt`

## What to Update
- When API route handlers change (request/response shapes, new endpoints, removed endpoints), update the corresponding MDX docs
- Keep code examples in docs consistent with actual API behavior
- Ensure any new API resources get a corresponding documentation page

## What NOT to Touch
- Do not modify API route handler logic in `app/api/v1/`
- Do not change Next.js config, layout components, or build tooling
- Do not alter the Fumadocs configuration (`source.config.ts`, `lib/source.ts`)

## Verification
Always run these before opening a PR:
```bash
pnpm run types:check
pnpm run build
```
