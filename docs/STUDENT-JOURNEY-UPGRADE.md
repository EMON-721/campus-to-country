# Campus to Country — incremental student journey upgrade

Audit date: 19 October 2026. GitHub baseline: `EMON-721/campus-to-country`, `main`, `ea3af605d9690018401109d567bb190985cf1967`. Sites source baseline: `542588233a8edfb2c48bae6b9ab7a579caf5f191` (live version 77). The two histories are separate; application source was checked against the current baseline before editing.

## Audit and implementation map

| Functionality / inspected files | Initial classification | Result |
| --- | --- | --- |
| Branding: `lib/brand.ts`, platform header and approved logo | Working and reusable | Kept original brand, logo and six modules. |
| Main routing: `app/platform.tsx`, `lib/module-navigation.ts`, `app/globals.css` | Requires integration | Shared section navigation for Universities/Visa/Workspace; old country, institution, programme, guide and service paths continue to resolve. |
| Country directory and catalogue: `app/catalogue.tsx`, `lib/institution-directory.ts`, `app/api/v1/catalogue/route.ts` | Working and reusable | Reused merged seed/admin records, source links, publication controls and audit storage. No seed reset. |
| Universities landing page | Missing | Added the requested hero, one programme search with country/degree/subject/language, destination discovery, scholarships/admission actions and reviews from actual dated catalogue records. |
| Programme discovery and comparison | Existing but incomplete | Structured filters, compact cards, progressive details, source status, unknown amounts kept unknown, currency-aware tuition filter, browser comparison of 2–4 records (within the configured limit). |
| Official programme references: `app/country-programme-utility.tsx`, `app/italy-programme-utility.tsx`, `lib/country-programme-reference.ts` | Working and reusable | Original country/Italy degree and subject utilities remain behind an expandable reference section; no invented institution-specific programmes. |
| Academic validation: `lib/academic.ts` | Existing but incomplete | Added optional admissions, finance, study-mode, research/contact and scholarship fields. Existing payloads remain valid. |
| Scholarships | Missing | Published scholarship catalogue with existing admin storage; private saved scholarships use the existing owner shortlist records, with distinct preparation statuses, deadlines, documents and application links. Empty until real opportunities are published. |
| Admission guide | Missing | Editable, printable planning sequence via the existing module resource CMS. Official portal submission remains external. |
| Visa directory: `app/visa-directory.tsx`, `lib/visa-sources.ts` | Working and reusable | Kept sources; separate country discovery and official-source views, recorded review dates and jurisdiction caveats. No new legal claims or fresh verification dates. |
| Visa guides/admin: `app/country-guide.tsx`, `app/visa-guide-admin.tsx`, `app/visa-links-admin.tsx`, `app/visa-admin-overview.tsx`, `lib/country-guides.ts`, country-guides API | Working and reusable | Original bilingual steps, FAQs, budgets, official links, publication and admin notes remain. New navigation links to these original guides. |
| Visa preparation | Requires integration | Public overview/requirements/steps/document categories connect to one private Visa Journey. Admin-editable general and country-specific templates open a draft; nothing is added until the user saves. |
| Profile, saved programmes and applications: `lib/domain.ts`, platform Workspace | Existing but incomplete | Progressive private profile, saved stages/priority/archive, application list and mobile-friendly board, more stages, references/decisions/document and scholarship links. Old `Admitted` remains valid. |
| Shortlist/application ownership and relationships | Requires security improvement | New cross-record and document links must belong to the applicant. Admin links use the existing MFA RPC. Duplicate programme/intake applications require an explicit acknowledgement. |
| Account identity/auth: existing profile and account APIs | Working and reusable | One account and unchanged Account ID/sign-in identity. Contact email stays distinct and required when saving a profile. No auth-project changes. |
| Calendar | Working and reusable | Kept Day/Week/Month/Agenda, categories, recurrence and records. Explicit deadline actions use stable event IDs. Editing a calendar event preserves source references and provides its related-record link. |
| Private vault: `app/workspace-files.tsx`, documents API, `db/schema.ts` | Working and reusable; link deletion guard required security improvement | Same original files, owner/scope, quotas, IDs, hashes and R2 keys. Applications, scholarship and visa tasks link files once. Deletion checks all owner references, including through admin document access. |
| Workspace admin: `app/applicant-admin.tsx`, `lib/workspace-admin-controls.ts`, admin Workspace API | Working and reusable | Existing reason/MFA/audit checks retained; added fields/statuses and route-specific mappings. No parallel admin system. |
| IELTS/Premium: `app/ielts-workspace.tsx`, current Academy | Working and reusable | Existing learning, notes, uploads and practice history retained. Notifications extend the single preferences record, and IELTS preference saves preserve these fields. |
| VisaFund / Bank Statements | Working and reusable | Financial preparation opens the original accounts, transactions, goals, sponsors, documents and reports. No copied ledger or sensitive balance preview. |
| Mentorship | Requires integration | Own bookings/enrollments read from the original service; explicit provisional calendar choice, stable booking reference, manual refresh from authoritative status/time, adoption of matching legacy provisional events. No invented confirmations or payment access. |
| In-app notifications | Missing | Derived from actual saved records with read/unread, dismissal, clear-read and preferences in the existing settings record. No separate notification database. |
| Background email/push delivery and live checkout | Present in the interface only / requires external configuration where offered | No new live payments or fictitious notification delivery. User-facing copy states the actual delivery limit. |

## Canonical locations

- Universities: `/countries`; destinations: `/countries/explore`; existing `/countries/<route>` preserved.
- Academic records: `/institutions`, `/programmes`, `/programmes/compare`, `/scholarships`, `/admission-guide`.
- Public Visa information: `/visa`, `/visa/countries`, `/visa/requirements`, `/visa/steps`, `/visa/documents`, `/visa/official-links`; existing country guide URLs preserved.
- Personal records: existing `/applicant/shortlists`, `/applicant/applications`, `/applicant/visa-journey`, `/applicant/documents`, `/applicant/calendar`.
- Additional Workspace views: `/applicant/scholarships`, `/applicant/financial-preparation`, `/applicant/mentorship`, `/applicant/notifications`.
- Old `/visafund` navigation overrides remain schema-valid; financial tools themselves stay in the original module.

## Preservation and storage

No production records were inserted, removed, reset or rewritten by this task. No personal sample records, completed tasks, shortlists, applications, enrollments or profiles were preloaded. Tests use disposable in-memory fixtures.

No database schema migration is needed. `db/schema.ts`, all applied migrations, authentication projects and existing database tables remain unchanged. Optional JSON payload fields extend existing record kinds. Public scholarships are stored by the existing D1 `academic-catalogue` path, avoiding a new Supabase catalogue enum or table. New CMS template collections contain general guidance, not user-owned tasks.

Original country/academic directories, guides, resource links, private bytes, Account IDs, calendars, IELTS/Premium, VisaFund, Counseling, Super Admin, configuration and previous audit logs are retained. Public shortlist editing now points to its original Workspace instead of providing a second editor. User-initiated, confirmed deletion controls already present in the project remain available; no such action was performed.

## Security and verification

- Existing verified authentication, owner RLS, same-origin checks, MFA administration, account lifecycle and audit logging retained.
- New related-record validation is owner-scoped; private files checked by both file ID and applicant owner. Admin relationship reads use the existing MFA-protected support RPC.
- A forged client calendar payload cannot mark a mentorship booking approved/completed: its event title, dates, timezone and status are derived from the actual owned booking.
- Original documents cannot be removed while referenced by supported Workspace or IELTS records.
- Dynamic private headings/linked-file labels are marked private so the global visual text editor cannot publish them as page copy.
- Full source typecheck; diff whitespace check; 137 Node integration/UI-render/regression tests; 15 date/DST/domain assertions; 8 IELTS schema assertions; recovered-content verification (1,000 + 3,003 vocabulary entries, 266 notes, 200 worksheets, six complete 40-question sets and their media).
- Suites cover catalogue publication/restoration, source preservation, cross-owner references/files, duplicate acknowledgement, mentorship status synchronization, admin controls/MFA, original account contact behavior, Bank Statements, IELTS/Premium and vocabulary preservation.

## Review limits and follow-up

- No browser/mobile click-through QA was available in this environment. UI checks use React server rendering; authenticated APIs were exercised with controlled providers and disposable SQLite, not real student credentials. Real-provider and deployed-browser acceptance remain release checks.
- No new embassy/university facts were researched or claimed verified. Source dates are the dates already stored; requirements still need review against the responsible official source.
- Scholarships intentionally show an empty state until administrators publish real opportunities. There are no manufactured funding records.
- The existing client loads the latest 2,000 account records. Counts are based on that loaded set and show a limit notice when reached. Relationship validation paginates owner history and stops safely at 20,000 records.
- Programme comparisons are browser-local; saved programmes are account records. Comparison does not create a private shortlist automatically.
- Duplicate detection is a confirmation guard rather than a new database uniqueness constraint; concurrent manual requests with different IDs can still require reconciliation. Catalogue saves and contextual reminders use stable IDs for retry deduplication.
- File-link checking across Supabase and R2/D1 is not a distributed transaction. File versioning/rename/archive, automatic source monitoring, background reminders and live payment activation are not introduced by this increment.
- Calendar recurrence retains its existing fixed-UTC/DST limitation. Booking calendar updates are explicit refresh actions, not a background scheduler.
- A release archive is to be saved for review. Production publication requires explicit user approval, as stated in the supplied specification. Existing live version 77 remains the baseline until publication is approved.
