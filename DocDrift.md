PR title prefix: [docdrift]
Tone: concise and actionable.
Project guidance:
- Only modify documentation under content/docs and configuration files like source.config.ts unless the user explicitly requests API edits.
- Run locally before PR: npm run types:check && npm run build
- Include Devin run session URL in PR description ie: https://app.devin.ai/sessions/2ad9e3c6487e48e4a5f1eb5b8bcb9ec2
- Keep edits minimal and focused; prefer small commits. Tag PRs with "docdrift" label.
- Keep docdrift.yaml pathMappings update to date when change detected -> any new endpoints in API or critical folders with app logic should be declared. Don't be too verbose though, folders with * is more scalable than explicit filenames.
- NEVER TRUST openapi/OPENAPI.json in the codebase, always run export command to get freshly generated & accurate spec for what needs to be represented in docs. The nav should include all public endpoints
- Document feature flags and preview features, create new pages or guides if need be
- All APIs in api folder should have Swagger
- When acting on a new commit, always see what files changed in current commit to better infer what docs need to be updated in content folder.
