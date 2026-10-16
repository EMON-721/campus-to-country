# Campus to Country — v3.2.3 update

Owner: emon hossain. Contact: emonhossain5081@gmail.com.

This is an incremental release of the existing application. Countries, IELTS, Visa Application, Bank Statements, Counseling and Personal Workspace retain their names, routes and existing content. Existing authentication, MFA, applicant records, IELTS learning tools and admin editors are preserved.

## Implemented in this update

- Private database lifecycle, retention holds, audit trail and unique notification outbox.
- Day 25 first warning, day 29 final warning, day 30 suspension eligibility. A late warning extends the deadline to preserve five full days after the warning is queued. Suspension is the default action. Deletion remains database-locked.
- Verified successful sign-in and trusted authenticated interactions reset activity. Polls, refresh tokens, background jobs and admin-generated events do not reset it.
- Account recovery and own-record export remain available while ordinary suspended account operations are denied by database policies.
- MFA-protected admin policy, exceptions, recovery, templates, notice status and audit controls.
- Internal hourly database evaluation job; policy remains disabled pending approved working notification delivery.
- Direct Google search on relevant directory/visa pages; configurable server-side Gemini multi-turn text endpoint, bounded requests and explicit consent.
- More consistent small-text sizing, responsive controls and a calmer header colour while preserving the logo asset.

## Activation gates and incomplete integrations

No external email is sent. Brevo transmission and persistent network jobs were rejected by automatic approval review. The proposal in `database/proposals` is NOT APPLIED. Enabling the environment authorization flag alone is insufficient: approval, provider configuration, approved migration and delivered-notification tests are required first.

Gemini needs a server-side API key and verified free-tier configuration. Live audio and paid search grounding are not implemented or enabled. Model names and billing must be rechecked against official documentation before activation.

SSLCOMMERZ now has a real server-side sandbox session adapter, signed test-order token, callback/IPN validation handler and MFA-protected admin test controls. Merchant credentials are not yet configured, so no real gateway session has been tested. The fixed 100 BDT test cannot create a live entitlement. Durable settlement and booking fulfillment remain pending; current private hosting may block gateway callbacks and must not be made public without owner approval. Credit/debit/other methods depend on the merchant gateway. Never activate a paid entitlement based on a browser return URL.

Private B2 storage, encrypted independent Google Drive backup and future R2 are adapter contracts only. Document upload stays closed until provider credentials, authorization, malware checks, quota enforcement, backup verification and restore tests pass. The target quota is 10 MB per applicant for PDF/PNG/JPEG documents. No real private-object purge is implemented.

Permanent deletion requires delivered warning, a fresh locked reactivation check, no active paid bookings/entitlements, protected applications, support/export requests or retention obligations, and verified backup/storage cleanup. The current database deliberately cannot enable permanent deletion. Transactional retention must be access-restricted; backup expiry must be documented and tested before lifting this lock.

## Architecture and engineering requirements

Keep the modular monolith, existing framework and central auth/admin. Use domain services and clean boundaries for university directory, IELTS, visa preparation, financial planning, counseling and private workspace. Selective events use transactional outbox/idempotent consumers rather than replacing the application with microservices.

Preserve zero-card hosting and free-tier limits; require explicit cost approval before paid providers. Secrets stay server-side. MFA is required for admin mutations. Owner-only RLS is authoritative for applicant data. Directory ingestion must retain source URL, retrieval time, official verification and admin approval before publication; Google discovery is not automatic source verification.

Use iterative Scrumban delivery, versioned migrations, reversible releases and regression checks. Future ML must remain opt-in and isolated from admission/visa promises and private financial data; no model training on applicant documents is authorized by this release. A production ML integration is still pending.

## Validation and release limitations

15 lifecycle logic checks and transactional database fixtures passed, including boundary days, full waiting period, deduplication, recovery, protection, failed delivery deletion guard, deletion lock, own export and synthetic record cascade. Synthetic fixtures were rolled back. Real private storage deletion and live external delivery are untested and disabled. Concurrent operations use row/advisory locks and skip-locked jobs; true two-connection race stress testing remains outstanding.

Browser visual QA was unavailable in this environment. Existing Supabase advisory: leaked-password protection is disabled; review plan support before enabling. Private lifecycle tables intentionally have RLS with no direct-access policies and are exposed only through narrowly authorized functions.

## Sandbox setup

Register at https://developer.sslcommerz.com/registration/ using the owner’s email. Obtain sandbox Store ID and Store Password. Configure protected runtime secrets CTC_SSLCOMMERZ_STORE_ID and CTC_SSLCOMMERZ_STORE_PASSWORD, then redeploy. Open Central Admin with existing administrator role and MFA, create the 100 BDT test session, use provider test cards, and verify callback/IPN reachability and server validation. Do not use real cards. Test controls never enable live services. No merchant registration or email has been submitted on the owner’s behalf.

Gateway tests use mocked responses to verify reference, amount, currency, risk, signed-token tampering/expiry and missing-secret rejection. A real end-to-end gateway test is still blocked by missing merchant credentials and callback hosting access.

## Gemini secure admin setup

Central Admin now includes a Gemini setup form. MFA-authorized admins enter a key, choose an allowlisted free-tier model and confirm that Google billing remains disabled. Key verification uses model metadata without generating paid content. AES-256-GCM encrypts the key with a fresh IV and purpose-bound associated data. The encryption key is a protected runtime secret, absent from source and client bundles. Configuration RPC returns status only and requires admin MFA; ciphertext retrieval requires an active verified applicant token plus a separate server-held 256-bit secret checked against its private hash. Anonymous and direct table access are revoked. Secret-free audit events record configuration changes. Disconnect removes the stored key. Keep the runtime secret backed up in authorized secret management: rotation requires re-entering the Gemini key. Google quotas and processing terms still apply; no automatic upgrade, paid tool grounding or Live voice is enabled. The new user key has not been entered or tested yet.

## Google sign-in and password setup

Login and registration now offer Continue with Google. The existing Supabase Google provider reports enabled; a test initiation redirects to accounts.google.com. Server-side PKCE uses a random verifier in a secure HttpOnly ten-minute cookie, exchanges the one-time code, verifies the provider user, stores the existing session cookies and preserves admin membership/MFA. No OAuth login automatically promotes a user. /account-security allows signed-in users to set a password; an already enrolled MFA factor requires aal2 before password changes.

Required provider redirect allowlist: https://campus-to-country.emonhossain5081.chatgpt.site/api/v1/auth/google/callback. Provider Management API access is unavailable in this environment, so this allowlist has not been inspected or changed. Set it in Supabase Authentication URL Configuration if login returns to the old VisaFund site. Existing recovery default routing and the full recovery callback remain outstanding; Google OAuth does not fix that separate email flow. Browser end-to-end sign-in remains user-verified, not automated.


## Gemini connection update — 12 October 2026

Gemini 3.8 Flash configuration has been saved by the owner and verified with Google; encrypted storage and server readback succeeded. Text chat supports bounded multi-turn history, explicit consent, and connection/quota/timeout feedback. Gemini 3.8 Live voice now has an authenticated token endpoint and browser microphone/audio integration using single-use, three-minute constrained tokens. Live voice requires separate microphone consent, stops on page hide/exit, and keeps transcripts only in the current tab. Direct Google search remains available. Text search grounding, email sending, permanent deletion, and live payments remain disabled.

TypeScript and mocked assistant security/audio tests pass. Real text generation, ephemeral-token issuance with the owner's key, microphone playback, and browser visual QA still need device verification; a saved API key alone does not verify these paths.


## Bank Statements — VisaFund workspace parity
The complete VisaFund workspace is integrated at `/visafund/*`: Overview, Bank accounts, Transactions, Transaction calendar, Financial insights, Country requirements, My destinations, Financial readiness, Compare countries, Sponsors & sources, Document vault, Savings goals, Currency converter, Fund history, Financial reports, Settings, Notifications, Help, Privacy and Terms. Original forms, charts, planning tools, CSV preview/import, paired transfers, reconciliation, immutable imported ledger entries and unofficial exports are reused.

Campus authentication and fresh owner MFA authorize requests. The Campus Site provisions its own D1 and private R2 bindings; the separate VisaFund project and its Supabase configuration remain untouched. Existing Campus financial records import idempotently on the owner's first authenticated access, without deleting source records. New financial entries are stored in the dedicated ledger, and complete financial export is available under Bank Statements Settings.

Central Admin can configure module labels, headings, visibility and create/edit/delete controls, and publish verified requirement versions. Missing official rules remain explicitly unverified; no VisaFund personal data or fabricated thresholds are copied. Each upload is limited to 10 MB and each owner's document quota to 100 MB. Suspended accounts fail the shared Campus access check. Automatic permanent account deletion remains disabled; enabling it requires a cross-module D1/R2 retention cleanup implementation and validation.

Validation: real SQLite-backed route tests cover owner isolation, anonymous rejection, paired transfer atomicity, currency correction constraints, original file retrieval, cross-owner document denial, CSV deduplication, immutable imports, saved sponsors/goals/destinations, reports, analytics and admin/origin rejection. Financial minor-unit engine tests cover 21 assertions. Real browser visual QA and an authenticated production file round-trip remain unverified.
