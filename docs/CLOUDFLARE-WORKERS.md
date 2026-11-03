# Campus to Country — Optional Cloudflare Workers deployment

**Status:** Isolated, unmerged readiness branch. No Cloudflare deploy, DNS cutover, database migration, or Vercel production change has occurred. A successful live Workers build is **not yet verified**.

## What is configured

This is a Next.js 16 full-stack app with authenticated API routes, Google OAuth, admin roles, cookies, private documents, Turso/libSQL and Supabase private Storage. It **cannot** be deployed as a static Next.js export or Pages asset folder.

- `vercel.json` and the regular `npm run build` (`next build`) remain the original Vercel configuration.
- `wrangler.jsonc` and `open-next.config.ts` target standalone Cloudflare Workers via OpenNext and do not run as part of Vercel builds.
- `@libsql/client/web` and `drizzle-orm/libsql/web` use web-compatible remote Turso access. Database migrations remain separate Node scripts.
- The older `deployment/pages/_worker.js` only proxies to another backend. **Do not use it** when deploying this independent full application.
- Cloudflare currently recommends **vinext** for new Next.js migration projects, but it is still beta. This branch starts with OpenNext to reuse `next build`. If Workers tests reveal incompatibilities (especially with `proxy.ts`), evaluate vinext in a separate branch without disabling security middleware.

## Build and preview (local staging clone only)

Use Node.js **22.x** and checkout `cloudflare-workers-readiness-2026` in a separate working copy:

```bash
npm ci
npm run cloudflare:prepare
npm run cloudflare:check
npm run test:runtime
npm run cloudflare:build
npm run cloudflare:preview
```

`cloudflare:prepare` installs the Cloudflare adapter and Wrangler locally with `--no-save --package-lock=false`, so the tracked npm manifest/lockfile and Vercel's `npm ci` are not changed. Do not run `npm run cloudflare:deploy` until staging tests pass. The generated Worker entry is `.open-next/worker.js` and assets are `.open-next/assets`; neither `.next` nor `dist/client` is a Pages output for this full app.

Run `npm ci && npm run build`, `npx tsc --noEmit`, and the existing runtime tests separately to ensure the standard Vercel application still builds before ever merging this branch.

## Environment and data

Set these variables as **Cloudflare server-side secrets**, never in GitHub, `wrangler.jsonc`, `.env` commits or `NEXT_PUBLIC_` values:

- `CTC_SUPABASE_URL` — Supabase project URL
- `CTC_SUPABASE_KEY` — publishable/anon key
- `CTC_SUPABASE_SERVICE_ROLE_KEY` — privileged **server-only** key
- `CTC_STORAGE_BUCKET` — private `ctc-files` bucket (or your staging bucket)
- `TURSO_DATABASE_URL` — remote Turso/libSQL URL
- `TURSO_AUTH_TOKEN` — database token

Other existing Gemini, payment, email, and encryption keys may be required for their corresponding features. Keep them server-side. **Use a separate staging database and private storage bucket, preferably with a separate Supabase project** for previews. Two deployments pointing to one Turso/Supabase project share and modify the same accounts/files; code isolation alone does not isolate data. Never automatically apply schema migrations during a build or an initial deployment.

No D1/R2 data migration is performed or required by this optional deployment path.

## Future Cloudflare publication

1. In Cloudflare, create a **Workers** project named `campus-to-country-cf` from the reviewed Cloudflare branch, not a static Pages project. Keep the Vercel `main` production integration unchanged; do not auto-deploy production traffic.
2. Use repository root, Node 22, and `npm ci && npm run cloudflare:prepare && npm run cloudflare:build` as the build commands. Follow the official OpenNext Workers deployment procedure for your chosen Git/CLI build integration.
3. Configure the Cloudflare runtime secrets and make necessary build-time variables available to the build runner. Validate all authenticated read/write APIs on the **actual Worker preview**, not just `next build`.
4. In Supabase OAuth settings add the exact new hostname callback `https://ACTUAL-WORKER-HOST/api/v1/auth/google/callback`; retain the existing Vercel URLs. Review email recovery URLs, cookies, origin/CSRF protections and payment callback allowlists. Do not point external callbacks at staging unexpectedly.
5. Verify homepage, all sections, login/logout, Google OAuth, admin MFA/permissions, disabled/demo actions, Turso reads/writes, direct staged PDF/image uploads, private file downloads, signed Storage links, performance and error logs. Anonymous users must never obtain private records.
6. Check Workers compressed bundle size, CPU time/memory and plan limits. Workers may reject Node APIs or Next.js proxy/middleware behavior that works on Vercel. Fix or switch adapters and rerun tests before publishing; **never weaken security controls** to make the build pass.
7. Only after explicit review, manually run `npm run cloudflare:deploy` with your authorized Cloudflare account, check the Worker hostname, and separately plan DNS cutover if wanted.

Cloudflare Workers deployment does **not** automatically replace or disable the Vercel website.

Official references: https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/ and https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/ .
