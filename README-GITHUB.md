# Campus to Country

Private source repository for Campus to Country.

## Verified source

The existing repository history is preserved. The application matches published Sites version 69, source commit `ae89e0ebd2ea6dc5aaee0aba6b579d396ba1f719`.

All 820 files in the source-and-assets export were checked against their original Git blob hashes, including all 221 binary media files. The non-secret `.openai/hosting.json` manifest is also retained because the application build imports it. Generated TypeScript build cache, credentials, runtime databases and private user uploads are not source files and are not exported.

Validation completed:
- Full application production build passed.
- All exported source and asset hashes matched; no missing files.
- Pages gateway origin, redirect, body forwarding and cookie checks passed.
- Cloudflare Wrangler compiled the Pages Worker successfully.

## Cloudflare Pages

Configuration and exact dashboard settings are in [deployment/pages/README.md](deployment/pages/README.md).

The Pages entrypoint connects a new Pages address to the existing public Campus to Country backend. It does not migrate databases, account records, private uploads or secrets. The current backend must remain active.

Cloudflare account sign-in and the actual Pages deployment are still pending. No `pages.dev` URL has been claimed or verified yet.

Keep the repository private. Never commit API keys, passwords or local environment files.
