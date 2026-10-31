# Vercel deployment and security review — 31 October 2026

## Implemented

- Standard Next.js build/install/output settings: `npm ci`, `npm run build`, `.next`. The existing application routes, branding, reference assets, authentication provider and records are retained.
- Upgraded the affected Zod dependency to pinned 4.6.7; adjusted its record schema API without replacing user data or weakening validators.
- Admin checks retain provider verification, trusted database membership and AAL2 MFA, and now also bind the token subject to the verified user and reject expired claims. No self-service role provisioning or fallback admin credential is introduced.
- Authentication POST bodies are bounded to 16 KiB, require JSON objects, reject privilege/unknown fields and normalize email input. Passwords, tokens and plaintext identifiers are not written into rate counters.
- Durable login, registration, recovery, password-change, refresh and MFA throttles use the existing SQL limits table. Missing durable storage returns 503 rather than silently using an unreliable per-instance counter. Limits reset after one minute; no permanent account lock is created.
- Logout clears the access cookie at `/` and refresh cookie at `/api/v1/auth` even if upstream logout fails. Both remain Secure and HttpOnly.
- Same-origin checks account for Next.js internal URLs behind the ingress Host, without trusting an arbitrary forwarded host over the real Host. Cross-site requests remain denied. Bank mutations share this policy.
- Added nosniff, anti-framing, HSTS, referrer and browser permission policies. CSP blocks framing/object embedding and constrains base/form URLs; it does not claim a nonce-based script policy. Microphone use from the same origin remains available for IELTS recording.
- Admin/auth responses are not cached and carry noindex instructions.
- A privileged Supabase key cannot be substituted for the publishable account API key. Deployment readiness rejects browser-prefixed privileged variables and non-persistent file database URLs.
- Source secret/artifact checks, least-privilege Verify workflow, weekly Dependabot configuration and CODEOWNERS are supplied. The workflow installs from the lockfile, scans tracked files, audits production dependencies, runs tests and builds without application secrets. Branch-rule enforcement is an owner/account setting, not implied by a CODEOWNERS file alone.

## Hosting actions completed

- Confirmed the existing Vercel project and its production aliases; retained its deployment protection.
- Set standard Next.js build/install/output settings, disabled deployment source exposure and directory listing, and enabled fork protection. The GitHub repository itself remains public as requested.
- Added the existing Campus to Country Supabase URL and publishable API key to Vercel Production and Preview as encrypted variables. Added the bucket name variable. No private key was put in source or chat output.
- Created an empty **private** `ctc-files` bucket with a 25 MiB file ceiling in the existing Supabase project. Added no public Storage policies and uploaded no personal documents.
- Verified live database metadata: RLS enabled on all reviewed public/private application tables; zero public admin INSERT/ALL policies; four ownership policies on user records; MFA predicates on the three reviewed admin content/catalogue policies. Existing private tables intentionally retain default-deny access.

## Required owner configuration before full operation

In Vercel Project → Settings → Environment Variables, add these **server-only** values for Production (and Preview only where intended):

| Variable | Required source |
| --- | --- |
| `TURSO_DATABASE_URL` | Your existing/selected hosted libSQL database URL |
| `TURSO_AUTH_TOKEN` | Its database access token |
| `CTC_SUPABASE_SERVICE_ROLE_KEY` | Server-only secret/service-role key from the existing Campus to Country Supabase project |

Do not paste these values into chat, public issues, committed files or any `NEXT_PUBLIC_` variable. They were not present in the Vercel environment listing and cannot be fabricated by the application. Existing Auth/publishable variables are already configured. The app deliberately keeps protected operations unavailable until their required services are configured.

For a new empty libSQL database, run `npm run db:migrate` with your private local environment, then `npm run check:deployment`. If transferring existing D1 data, follow [the migration guide](../VERCEL-MIGRATION.md) and reconcile migration history first; do not reset records, recreate accounts or change ownership IDs. Copy existing private object bytes using their original keys before a hosting cutover. No production database export/import was performed here.

If using Google sign-in, configure the production Site URL and exact callback allowlist in Supabase Auth URL Configuration, including `https://campus-to-country.vercel.app/api/v1/auth/google/callback`. Avoid broad allowlists for untrusted preview domains. Existing Google provider credentials stay with Supabase. Enable leaked-password protection in Supabase if available within the selected plan; the security advisor reports it disabled. No paid feature was activated.

## Verification evidence

- 212 JavaScript regression/security tests passed, including MFA enrollment/verification, throttling, forged/expired admin claims, unexpected privilege fields, cross-owner references, private files and upload replay checks.
- TypeScript checking and a standard Next.js production build completed successfully.
- Production dependency audit returned zero reported vulnerabilities after the Zod update. This is an advisory snapshot, not proof that every dependency is vulnerability-free.
- Current tracked-source scans found no matching provider-secret/private-key/literal-token patterns or tracked private runtime artifacts. This check does not certify every historical commit.
- Eleven standalone TypeScript checks passed in Node strip-types mode; the existing adapter check passed using Node's transform-types mode for its parameter-property syntax.
- Production-server smoke checks confirmed root/admin pages render with security headers, anonymous admin API access returns 401, and cross-origin account requests are rejected. A real Next.js ingress-origin mismatch was reproduced and fixed; the final smoke check confirmed a legitimate ingress origin reaches the controlled missing-database 503, a foreign origin returns 403, and a forged role field returns 400.
- Live provider metadata and private bucket configuration were inspected; no private user records were read or modified.
- A protected-production fetch was attempted with the connected Vercel account, but Vercel Authentication rejected the temporary share link. Deployment protection was not disabled to bypass this. Authenticated browser end-to-end login/upload tests still require the missing credentials, deployed configuration and an authorized test session.

No absolute security or issue-free hosting guarantee is made. These controls reduce concrete risks; production credentials, provider availability, owner MFA and tested data migration remain necessary.
