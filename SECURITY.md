# Campus to Country security

The public repository contains application source, reference content and example configuration. Administrator passwords, session cookies, database tokens, server API keys and private student documents belong outside Git.

Administrator operations require a provider-verified account, an existing administrator membership, a matching unexpired access token and MFA assurance level 2. Registration cannot grant an administrator role. Private data endpoints enforce ownership or an authenticated MFA support scope.

Authentication forms have bounded input, same-origin checks and durable rate counters. Account operations fail closed while the required database is unavailable. Session cookies are HttpOnly and Secure; logout clears the original cookie paths even if the upstream service fails. Browser/server credential separation and private Storage are mandatory deployment checks.

Run `npm run security:secrets`, `npm run security:audit`, the regression suite and `npm run build` before release. `npm run check:deployment` separately verifies the configured database and private bucket without printing secrets. See [deployment and security review](docs/security/VERCEL-SECURITY-REVIEW.md) for setup and verification boundaries.

Use private security reporting through GitHub where available. Do not publish passwords, tokens, private documents or exploit details involving real users in public issues. If a real credential is exposed, revoke/rotate it with its provider; deleting a file does not remove its Git history.

Repository owners should protect their GitHub, Vercel and Supabase accounts with MFA. CODEOWNERS and automated checks are supplied; require the Verify check and owner review in branch rules if those rules are available for the repository. No workflow receives production application secrets, and pull requests use `pull_request`, not `pull_request_target`.
