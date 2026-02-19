PR title prefix: [docdrift]
Tone: concise and actionable.
Project guidance:
- Only modify documentation under content/docs and configuration files like source.config.ts unless the user explicitly requests API edits.
- Run locally before PR: npm run types:check && npm run build
- Include Devin run session URL in PR description ie: https://app.devin.ai/sessions/2ad9e3c6487e48e4a5f1eb5b8bcb9ec2
- Keep edits minimal and focused; prefer small commits. Tag PRs with "docdrift" label.
- Keep docdrift.yaml pathMappings update to date when change detected -> any new endpoints in API or critical folders with app logic should be declared. Don't be too verbose though, folders with * is more scalable than explicit filenames.
