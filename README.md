# Campus to Country

Private integrated study-abroad platform checkpoint. The latest owner specification is [docs/MASTER_PROMPT_v4.0.txt](docs/MASTER_PROMPT_v4.0.txt). Read [docs/CHECKPOINT.md](docs/CHECKPOINT.md) for tested behavior, source preservation and incomplete requirements before treating this as production ready.

## Development

Use Node 22.x, install with `npm ci`, run `npm run dev`, and build with `npm run build`. Standard Next.js runs on Vercel without Cloudflare/Workers/R2 or custom build wrappers. Read [the complete Vercel migration guide](docs/VERCEL-MIGRATION.md) for the required Turso database, private Supabase Storage bucket, environment variables and data-preserving cutover steps. Verify with `npx tsc --noEmit` and `npm run test:runtime`.

Runtime server configuration: `CTC_SUPABASE_URL` and `CTC_SUPABASE_KEY` (publishable key). Do not add a service-role key to browser code. The additive SQL migrations are in database/. Existing legacy users are not migrated. Production provider redirects, email confirmation/recovery and MFA provisioning require validation.

The original logo is at public/campus-to-country-logo.png. Original listening text is media-source/campus-workshop.txt; the bundled MP3 was generated using ffmpeg's flite `slt` voice for an original practice exercise. Synthetic narration is not an official IELTS exam recording. Follow the installed ffmpeg/flite voice licensing when redistributing narration or replacing the synthesis provider.
