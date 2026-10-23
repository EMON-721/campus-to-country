# Standard Next.js deployment on Vercel

This repository now uses standard Next.js with the existing App Router, authentication, admin controls and content. There is no Cloudflare account, Wrangler, R2 bucket provisioning or custom build wrapper in the active build. No production data is moved or deleted by installing or building this version.

## 1. Build configuration

`package.json`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint . --ignore-pattern dist --ignore-pattern .next",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "node --env-file-if-exists=.env.local scripts/migrate-database.mjs",
  "test:runtime": "node --test tests-vercel-runtime.mjs"
}
```

Pinned runtime dependencies: `next: 16.4.3`, `react: 19.3.1`, `react-dom: 19.3.1`, `@libsql/client: 0.18.0`. `eslint-config-next` matches Next.js. The committed `package-lock.json` is the active lockfile; use npm. Node.js 22.x is suitable. Other existing application dependencies are retained.

`next.config.ts`:

```ts
import type {NextConfig} from 'next';
const nextConfig:NextConfig={reactStrictMode:true,poweredByHeader:false,experimental:{turbopackFileSystemCacheForBuild:false}};
export default nextConfig;
```

The documented Next.js build-cache switch is disabled because repeated builds reproduced a persistent-cache read error in this environment. This keeps the normal `next build` command; there is no cache-cleaning wrapper or fabricated output.

Do not add `output: 'export'`: account cookies, private documents, admin writes, payments and other API routes need a server. Do not set `distDir`, an asset prefix, a custom Vite loader or a fake routes manifest. `next build` produces `.next/routes-manifest.json` naturally. Current assets use ordinary image tags/local public assets; no remote image host configuration is needed. If adopting `next/image` for a new remote host later, add a narrow `images.remotePatterns` entry.

`vercel.json` selects the `nextjs` framework and pins `outputDirectory` to `.next`, overriding any stale dashboard value such as `dist/client`. This is the real standard Next.js build directory; no manifest or static export is fabricated. `proxy.ts` replaces Next.js's deprecated `middleware.ts` convention while preserving its action/module checks. Proxy authorization passes the incoming Request explicitly to `admin(request)`; normal route handlers continue using Next.js cookies in their request scope. `tsconfig.json` drops Cloudflare ambient types and excludes archived deployment/reference sources from application compilation.

## 2. Database: preserve SQLite semantics

R2 was not the only binding: the app also used D1 for users, financial records, audit logs, content, bookings and private-file metadata. Removing storage bindings without replacing the database would break these features.

- `lib/sql-database.ts`: libSQL client and typed SQL service; prepared queries, bound parameters, row results, affected-row counts, `RETURNING` and atomic batch transactions.
- `lib/server-runtime.ts`: lazy database/storage service instances; importing route modules during build does not require credentials or contact a provider.
- `db/index.ts`: uses `drizzle-orm/libsql` with the original SQLite schema.
- Existing route and service imports use `@/lib/server-runtime`; `database` replaces `env.DB`, `objects` replaces `env.BUCKET`.
- The original Drizzle SQL migrations and ownership identifiers are retained. No SQL-to-Postgres translation or duplicate account system is introduced.

Create a **free Turso/libSQL database** through Turso's own dashboard, not a paid Marketplace purchase. Copy the database URL and database auth token into your Vercel environment. The free plan advertises no credit card requirement; stay within its quotas.

For a brand-new empty database, set `.env.local` from `.env.example`, then run:

```bash
npm ci
npm run db:migrate
npm run build
```

`db:migrate` is an explicit schema setup command, not part of build or postinstall. It records applied SQL filenames and runs each migration in a transaction. Do not point a fresh-schema migration at an existing unregistered schema or a database import without reviewing its migration history first.

### Existing D1 data

A deployment refactor cannot automatically transfer a remote database or R2 files. A new Turso database starts empty. To retain existing user records/settings, obtain an authorized SQLite-compatible export of the current D1 database, import it into Turso, verify row counts, keys and ownership, and reconcile `ctc_schema_migrations` against the schema already applied. Keep the old deployment until this is verified. Do not re-create existing users, change Account IDs or seed personal records. This repository does not run a production export/import automatically.

## 3. Storage: private Supabase bucket

Use the **existing Supabase project** that already provides authentication and RPCs. Create a private bucket named `ctc-files` in Supabase Dashboard → Storage. Keep the bucket private and set a maximum upload size of at least 25 MB, subject to your free plan limits. Do not add public insert/read policies or expose its service key in a browser.

`lib/object-storage.ts` implements server-side upload, download, deletion, recursive listing, signed staging upload URLs and short-lived download URLs (60 seconds for documents/images; one hour for video playback) using Supabase Storage's HTTP API. Original object keys are preserved: `workspace/<owner>/<id>`, `<bank-owner>/<id>`, `site-assets/<id>`, `notices/<id>`, and course media keys. File metadata and existing access rules remain in the database.

Do not store runtime uploads in `/public/uploads` on Vercel; its deployed filesystem is not persistent writable storage. Existing committed logos/images under `/public` remain normal static files.

### Large files

Vercel Functions have a 4.5 MB request/response payload limit. Existing file size options are preserved using:

1. `lib/upload-client.ts`: request a staging upload ticket; send file bytes directly to private Supabase Storage; complete the original upload endpoint with a small JSON body.
2. `app/api/v1/uploads/route.ts`: require original user/admin authorization and same origin, allow only known upload targets, bound the declared size, throttle tickets, and bind each ticket to its actor, target and expiry.
3. `lib/upload-form.ts`: consume the ticket once, verify its actor/path/expiry and actual byte count, recover the original FormData and remove staging bytes. The original endpoint then performs its original type/signature, quota, ownership and audit checks.
4. Original download handlers call `fileResponse` only after their access checks. It returns a signed redirect (60 seconds for documents/images; one hour for video playback). Treat a signed URL as a temporary bearer link; revocation prevents new URLs but an already-issued link lasts until expiry. Video links allow an hour so playback/seek requests continue beyond the first minute.

Small multipart API clients still work. External clients uploading above Vercel's request limit must follow the same ticket protocol; the built-in editors do so automatically. Expired staging uploads are cleaned opportunistically when further tickets are requested. Supabase signed-upload tokens have their provider-defined validity; the application's completion ticket expires after 15 minutes. Bucket quotas still apply to abandoned/rejected uploads, so periodically review the private `staging` folder if uploads stop entirely.

### Existing R2 files

Copy original file bytes into the private Supabase bucket **using the same object keys**, after obtaining authorized exports. Preserve the metadata database. Verify file hashes and private/public access before switching traffic. This code does not silently claim existing R2 objects have moved, nor does it delete the old bucket.

## 4. Environment variables

Add these in Vercel → Project → Settings → Environment Variables for the desired Preview/Production environment, then redeploy:

| Name | Value/source |
| --- | --- |
| `CTC_SUPABASE_URL` | Existing project's HTTPS API URL |
| `CTC_SUPABASE_KEY` | Existing publishable or anon API key; retains current user-token/RLS behavior |
| `CTC_SUPABASE_SERVICE_ROLE_KEY` | Server-only service role/secret key for private Storage |
| `CTC_STORAGE_BUCKET` | `ctc-files` |
| `TURSO_DATABASE_URL` | Hosted libSQL database URL |
| `TURSO_AUTH_TOKEN` | Database token |

Never use `NEXT_PUBLIC_` for database tokens, service-role keys or encryption secrets. Keep all existing optional Gemini, email, encryption and payment variables; changing hosting does not authorize paid services. Supabase authentication redirect allowlists must include the actual Vercel production domain and any deliberately supported preview callback URL. Existing Supabase `database/*.sql` functions/RLS must remain installed; local SQLite migrations do not replace them.

## 5. Vercel settings

Import `EMON-721/campus-to-country` into a personal Vercel Hobby project:

- Framework Preset: **Next.js**.
- Root Directory: repository root (`.`).
- Build Command: default (`npm run build`).
- Install Command: default, or `npm ci` with the committed npm lockfile.
- Output Directory in the dashboard: **leave the override OFF**. The repository now explicitly sets `.next` to override the legacy `dist/client` value. Never use `dist`, `dist/client`, `dist/server`, `out` or `.vercel/output` for this standard Next.js app.
- Node.js: **22.x**.
- Add environment variables above.
- Redeploy with the old build cache disabled once after changing frameworks.

No `wrangler deploy`, Cloudflare API token, R2 bucket, `--prebuilt`, copied manifest or custom framework wrapper is required. Vercel Hobby is for personal/non-commercial use; this app includes paid-service functionality, so check actual usage against plan terms before enabling commercial use. Free tiers have quotas; a free account is not unlimited production capacity.

After a successful Vercel deployment, user URL is the returned `https://<actual-project>.vercel.app/`; admin URL is that same origin plus `/admin`. A real Vercel URL is not fabricated by this change. The previous Sites URLs remain separate until a hosting cutover is explicitly performed.

## 6. Removed active build files

The exact list is in `docs/VERCEL-REMOVED-FILES.json`. It includes the root Vite config, Cloudflare ambient declarations, build plugin/Worker sources, connector preview wrappers, old custom install/build/run scripts, the pnpm lockfile and old `middleware.ts` (replaced by `proxy.ts`).

Keep `/public`, original Drizzle migrations, `/database`, user-facing source and approved branding. Archived `/legacy` and `/deployment` reference files and `.openai/hosting.json` are not active Vercel inputs; they are retained for history, not imported by the application. Do not install or deploy from the archived legacy subdirectories.

## 7. Verification and limits

Run `npm ci`, `npm run test:runtime`, existing regression tests, `npx tsc --noEmit`, and `npm run build`. Check `.next/routes-manifest.json` exists. `npm start` should serve pages and return controlled authorization/configuration errors from protected APIs when unconfigured, rather than trying to provision Cloudflare resources.

Local adapter tests do not prove a live provider integration or transfer existing data. Verify login/MFA, an authorized content update, a private upload/download and cross-user denial against the configured preview before a production cutover. No live Vercel deployment or production database mutation is performed by this refactor.

### Recorded checks

- Standard `next build` completed with TypeScript checking, static page generation and normal route-manifest output; a subsequent build also succeeded with the documented cache setting.
- The 203-test regression suite passed. Six focused migration tests then passed, including explicit Proxy MFA request authorization, large-file staging, replay/actor/path rejection, database batch rollback, repeatable schema setup, missing-bucket write failure, signed media URLs and browser upload transport.
- The npm lockfile passed `npm ci --dry-run`. No Cloudflare packages or runtime bindings are needed by the active application.
- `npm start` smoke check: `/` and `/admin` returned 200 with the existing brand; private Workspace files returned 401 without login. An unconfigured catalogue API returned a controlled 503 requiring Supabase environment variables, without attempting Cloudflare provisioning.
- No production data migration or Vercel release has been initiated.

### Fix for deployment email: output directory `dist/client` not found

The deployment reached the Next.js output check but inherited the previous Vite/Vinext output path from Vercel Project Settings. The root `vercel.json` now contains `"framework": "nextjs"` and `"outputDirectory": ".next"`, which takes precedence over the dashboard output directory. Deploy the new commit rather than redeploying the old `2483a64` snapshot. If automatic deployment is disabled, choose the latest `main` commit in Vercel and redeploy. Turning off the dashboard's old Output Directory override is also recommended.

The connected Vercel account returned 403 for the `emon-grad-track` team during diagnosis, so live deployment status could not be verified from this connection. Repository configuration was corrected without changing account access, credentials, runtime data or the existing application build.
