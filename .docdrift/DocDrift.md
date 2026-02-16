# DocDrift Custom Instructions

## PR Conventions
- Prefix all PR titles with `[docdrift]`
- Keep documentation changes scoped to `content/docs/`

## Tone & Style
- Use a clear, concise, and technical tone consistent with the existing DataStack documentation
- Match the Fumadocs MDX formatting conventions used throughout the docs site
- Prefer short sentences and active voice
- Use code blocks with language tags for all code examples

## Project-Specific Guidance
- DataStack is a Next.js application using the Fumadocs framework for documentation
- Documentation content lives in `content/docs/` as MDX files with YAML frontmatter
- API routes are located under `app/api/v1/` and cover: auth, clusters, jobs, pipelines, notebooks, sql, users, webhooks, workspaces
- When API route handlers change, check whether the corresponding documentation in `content/docs/` needs updating
- The project uses pnpm as its package manager
- Run `pnpm run types:check` and `pnpm run build` to verify changes
