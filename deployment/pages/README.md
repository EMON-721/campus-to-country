# Campus to Country — Cloudflare Pages address

This Pages entrypoint forwards the complete application to its existing public backend. It does not migrate or duplicate databases, user uploads, secrets or account records. The existing backend publication must remain active. No API key belongs in this directory or in Pages client assets.

## Cloudflare dashboard

- Create a **Pages** project connected to `EMON-721/campus-to-country`.
- Project name: `campus-to-country` if available (the actual assigned URL is authoritative).
- Production branch: `main`.
- Root directory: `deployment/pages`.
- Framework preset: `None`.
- Build command: leave empty.
- Build output directory: `.`.
- Environment variables and paid plans: none required for this entrypoint.

The root Vinext source is preserved for development and future full backend migration. Do not select a static Next.js preset for that full application. The Pages `_worker.js` handles application routes, APIs and assets; uploading the root `dist/client` alone is insufficient.

## Validation before launch

Check all six public sections, the launch notice, and that anonymous account creation, uploads, bookings and AI writes are rejected in demo mode. Private records must never be visible anonymously. Existing administrator authentication remains required by the backend.

For Google sign-in on the new hostname, add `https://ACTUAL-PAGES-HOST/api/v1/auth/google/callback` to this Campus to Country Supabase project's allowed redirect URLs; retain the existing origin. Password recovery links need the same domain review. Do not edit the separate VisaFund project. While the public site remains in demo mode, users should not sign in or register.

Set-Cookie stays host-only on Pages. Origin validation happens at the Pages boundary and again at the existing application backend. This is a fixed-destination gateway, not an open proxy. No private storage or account data is exported into GitHub.
