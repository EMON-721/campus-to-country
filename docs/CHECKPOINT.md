# Campus2Connect integration checkpoint — 11 October 2026

The authoritative specification is MASTER_PROMPT_v4.0.txt. This is an incremental private staging checkpoint, not complete v4.0 acceptance or a public production cutover. The original approved logo is unmodified. Public branding is Campus2Connect; personal owner identifiers are not configured in public content.

## Audited repositories and preservation

| Repository | Audited commit | Evidence and integration |
| --- | --- | --- |
| EMON-721/visafund | 5b86bb42fd07af2030e6fa0d467f58b81cd13f19 | Text source retained with owner identifier redaction under legacy/visafund. Integer minor-unit finance and its 21 assertions reused unchanged. Original D1/admin/transfer/import workflows await adapter integration. |
| EMON-721/italy-journey-portal | 3d75a9daaa55da1c33fae63307d507ae7be623dd | Text source retained with owner identifier redaction under legacy/italy-journey-portal. Workspace workflows inform profile, shortlist, applications, checklist and calendar. Tracked account database excluded. Insecure master-password, default accounts and unauthenticated reset are not used. |
| EMON-721/The-Passport-Band | dd75fe4550437c70dd6d0dbe95d7257443694776 | Repository contained README only. No claimed historic media, mock engine or curriculum could be recovered. README preserved; new original practice clearly labeled. |

255 text files were copied through the authorized GitHub connector. Original repositories/main branches were not changed. Generated source inventory records SHA-256 for the retained files. Git history remains in the upstream repositories; Owner email/name references in retained legacy documents were replaced by operator placeholders; upstream originals remain unchanged. Source snapshots are not represented as a complete history migration. Lockfile/generated metadata/account database exclusions are deliberate. No existing applicant records were migrated.

## Six-module acceptance matrix

| Module | Implemented in this checkpoint | Remaining before full acceptance |
| --- | --- | --- |
| Countries/academics | Broad destination registry; original official references where available; published institution/programme catalogue API with MFA/admin authoring; search, language filter, three-programme comparison, private shortlist save | Complete verified institution/programme datasets, scholarships, source extraction/review jobs, change notifications, source snapshots and matching rules |
| The Passport Band | Original reading/listening drills with saved answers; generated listening MP3; writing drafts/submissions, microphone speaking practice, typing metrics, focused timer with checkpoints/lease, milestones, personal questions, shared progress/history and calendar | Missing upstream source; full 40-question mocks, complete foundation/A1–B2/advanced curricula, entitlement/payment integration, IndexedDB guest storage, server writing drafts, examiner assessment and progress analytics |
| Visa | Official source references, structured jurisdiction/source-status catalogue and admin authoring; private checklist | Verified destination/nationality/residence coverage, visa case state machine, embassy notice jobs, tracking providers |
| VisaFund | Private planning accounts/transactions CRUD; exact integer currency/balance engine; CSV export/print | Transfers, CSV import, rules, financial evidence links, report revisions and secure legacy data migration |
| Counseling | Validated paid-package and availability catalogue with admin publication; private workspace integration scaffold | Atomic booking reservations, verified payment callbacks/refunds, counselor permissions, availability calendar, explicit sharing grants and confirmation delivery. Checkout intentionally closed. |
| Applicant Workspace | Single provider identity; blank profile; shortlist/application/checklist CRUD; shared day/week/month/agenda calendar; export; own IELTS/funds records | Private documents with atomic 10 MB quotas and independent verified backup, complete academic records/preferences, reminders/notifications, calendar recurrence exceptions/DST semantics, retention and account deletion workflows |

Cross-cutting: Supabase-backed ownership RLS, secure server cookies, same-origin mutation checks, Zod payloads, explicit administrator grants plus aal2 authorization, public/draft/premium content separation, catalogue revision history and record audit. No administrator automatically provisioned. MFA enrollment UI, provider redirect/email-delivery validation, app-level rate limiting, complete role/permission CMS, cursor pagination and concurrency versioning remain open. Current APIs cap record retrieval at 2,000 and catalogue retrieval at 1,000, so large exports require pagination before production.

## Verification

- TypeScript no-emit passed.
- Finance: 21 assertions passed.
- Domain: 15 assertions passed (leap months, DST gap and 23-hour day, midnight splitting, session deduplication, overlapping segment rejection, malformed dates/negative money, monthly recurrence, typing metrics).
- Remote synthetic transaction test passed: owner read/isolation, cross-owner update blocked, foreign financial account rejected, no admin self-promotion, protected CMS, duplicate timer lease rejected. Fixtures rolled back.
- Supabase security advisor: no reported RLS issues; leaked-password protection disabled warning remains. See https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection .
- Browser/mobile/auth-delivery/recording end-to-end QA has not run: required managed browser capability was unavailable. Do not infer those flows are validated from the build.
- Build/deployment results are reported separately after the checkpoint is saved.

## Next execution order

1. Recover Passport Band actual source/media or author licensed complete material; never treat README claims as shipped code.
2. Configure provider redirect/confirmation/recovery and MFA enrollment; grant owner admin through a privileged operator after verified identity; perform account/session/browser QA.
3. Complete verified source-backed academic/visa data and review workflows across the supported country registry.
4. Integrate preserved VisaFund and Italy workflows through typed adapters, with migration/reconciliation tests.
5. Implement and test counseling sandbox state machine, then provider callbacks; keep live payments disabled pending explicit approval.
6. Implement private documents, quota reservation, independent backup/restore verification, retention notices/holds and background jobs.
7. Complete calendar DST exceptions, reminders, event links, pagination and app rate limits; validate all six modules before any full acceptance claim.

No paid provisioning, live payment activation, public access change or irreversible legacy data operation occurred.

## 2026-10-11 — Hosted Passport Band recovery correction
The GitHub repository lacked the application, but the original hosted Site source was recovered at commit ad806f580e52991153fb6490c9b9de84decd51d7. Earlier claims that original static teaching content could not be recovered are superseded.

Integrated into the central IELTS routes: original 1,000-word and 3,003-entry collections; 159 uploaded skill materials plus lessons, transitions, 10 writing/speaking sets and units (266 searchable materials total); 200 typed worksheets and original sheet images; 3 complete Reading and 3 complete four-part Listening sets with answers, explanations and audio. The three uploaded PDFs match the source manifest SHA256 records. `/ielts/vocabulary`, `/ielts/notes`, `/ielts/grammar` and `/ielts/mock-tests` now appear in navigation. Practice saves use the central account/guest history, without importing or replacing old browser-private stores. Listening uses synthetic original practice audio; scores are practice accuracy, not official bands. Mock UI is untimed learning mode.

Visa directory expanded from 3 to 22 government/mission references, including all previously missing main destinations. Embassy jurisdiction is not inferred merely from a mission URL. No new legal requirements or fees are copied into a rules database.

Validation: recovered-content counts and media paths, domain and financial regressions, TypeScript and production build. Managed browser QA unavailable; visual interaction testing remains unverified. Original owner's browser-only saved notes/uploads are not recovered by this static-source migration.

## Balanced colours and central text editing
Replaced uniform dark navy treatment with a warm neutral canvas, white brand header, sage/teal, muted blue, sand and lavender module accents. The approved logo file is byte-for-byte unchanged; its white image background now blends into the white header without a separate boxed tile.

Added protected click-to-edit page copy (`?edit=1`) and admin learning-entry editors for both vocabulary collections, notes and worksheets. Edits use existing central ctc_content records and require the existing admin membership plus MFA on every write. A new library endpoint merges published overrides into recovered learning entries. Personal applicant record bodies are excluded from page-copy edits. These additions do not constitute full A-to-Z CMS coverage: mock questions/media, layout, theme controls, schema and security settings still require development. Admin role/MFA provisioning is a separate prerequisite and has not been bypassed. Browser QA remains unavailable.

Owner admin follow-up: the previously supplied owner contact has a verified account and an existing verified MFA factor. Granted this exact verified account the requested administrator role; membership confirmed by database query. Added the admin authenticator verification form to upgrade the login session to AAL2 through the existing provider challenge/verify API. The owner must enter their own authenticator code; no factors or codes were extracted or reset. Privileged end-to-end editing remains untested without the owner's session/code.

## Section colour composition
Added route-scoped accents across all six modules: muted blue Countries, teal IELTS, sand Visa, sage VisaFund, lavender Counseling and slate Workspace. White reading surfaces and shared components unify the palette. Homepage hero and selected workspace/IELTS banners use navy with restrained teal and warm accents. Header stays white so the unchanged logo matte blends seamlessly. Screen-only overrides preserve print output. TypeScript and production build checked; browser visual QA unavailable.

## Interior colour surfaces and logo presentation
Extended each module palette to cards, alternate panels, inputs, forms, calendar surfaces, library indices, notices and tables. Counseling now uses lavender throughout instead of white cards. The header uses a warm-sand/teal/blue gradient. The original logo file is unchanged: CSS crops its large empty margins and an inline SVG display filter removes near-white matte while retaining source RGB colours. Print styles retain original presentation. Browser visual QA remains unavailable; the alpha-filter appearance is unverified in actual browsers.
