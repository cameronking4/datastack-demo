# DocDrift Custom Instructions

## PR Guidelines
- Prefix all PR titles with `[docdrift]`
- Keep documentation updates concise and technically accurate
- Match the existing tone of the DataStack documentation (clear, developer-focused, practical)

## Project-Specific Guidance
- Documentation lives in `content/docs/` as MDX files using Fumadocs
- API routes are under `app/api/v1/` covering: auth, clusters, jobs, notebooks, pipelines, sql, users, webhooks, workspaces
- When API endpoints change, ensure corresponding documentation reflects parameter changes, new fields, and updated examples
- Respect the Fumadocs frontmatter schema defined in `source.config.ts`
- Use syntax-highlighted code blocks for API request/response examples
- Keep documentation consistent with the existing structure and naming conventions

## Verification
- Run `pnpm run types:check` to validate types before submitting
- Run `pnpm run build` to ensure the docs site builds successfully
