# Campus to Country

Private integrated study-abroad platform checkpoint. The latest owner specification is [docs/MASTER_PROMPT_v4.0.txt](docs/MASTER_PROMPT_v4.0.txt). Read [docs/CHECKPOINT.md](docs/CHECKPOINT.md) for tested behavior, source preservation and incomplete requirements before treating this as production ready.

## Development

Use Node 22.x, install with `npm ci`, run `npm run dev`, and build with `npm run build`. Standard Next.js runs on Vercel without Cloudflare/Workers/R2 or custom build wrappers. Read [the complete Vercel migration guide](docs/VERCEL-MIGRATION.md) for the required Turso database, private Supabase Storage bucket, environment variables and data-preserving cutover steps. Verify with `npx tsc --noEmit` and `npm run test:runtime`.

Runtime server configuration: `CTC_SUPABASE_URL` and `CTC_SUPABASE_KEY` (publishable key). Do not add a service-role key to browser code. The additive SQL migrations are in database/. Existing legacy users are not migrated. Production provider redirects, email confirmation/recovery and MFA provisioning require validation.

The original logo is at public/campus-to-country-logo.png. Original listening text is media-source/campus-workshop.txt; the bundled MP3 was generated using ffmpeg's flite `slt` voice for an original practice exercise. Synthetic narration is not an official IELTS exam recording. Follow the installed ffmpeg/flite voice licensing when redistributing narration or replacing the synthesis provider.

<!-- DEPLOYMENT LINKS: maintained for GitHub repository navigation -->
## Website & repository links

- **Source repository:** https://github.com/EMON-721/campus-to-country
- **Published website URL:** https://campus-to-country.vercel.app
- **Availability:** Deployment URL recorded; live HTTP reachability could not be independently verified on 1 November 2026.

<!-- END DEPLOYMENT LINKS -->

## Optional Cloudflare Workers (not deployed)

This repository retains the existing standard Vercel deployment. A separate Cloudflare Workers/OpenNext build path, staging precautions, and manual setup steps are documented in [Cloudflare Workers readiness](docs/CLOUDFLARE-WORKERS.md). The Cloudflare setup does not deploy or change the Vercel production website.
