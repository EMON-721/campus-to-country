# Account identity and contact management

Every authenticated account has a stable display ID: `CTC-` followed by its complete uppercase auth UUID. It retains all UUID bits, is not an authorization credential, and does not change when a profile or email changes. Existing users acquire the same derived ID without a backfill or record migration.

The Personal Workspace dashboard and Profile page display this ID and the sign-in email. Profile email is the single required personal contact address. Optional update consent is a separate boolean, defaults to false for older profiles, and can be withdrawn in Personal information. Sign-in credentials remain managed by the existing authentication flow.

Central Admin → User accounts includes the account/contact directory with pagination, search, review/channel/consent filters, all-page filtered CSV export, contact address editing, approve/reject with user-visible feedback, enable/disable, reset review and private notes. The existing ban/restore/delete and applicant-record controls remain present. Bank Statements user management links to the same contact controls. Every mutation requires same origin, verified MFA admin, a reason and the expected current email; mismatched email returns 409. Admin email changes preserve other profile fields and reset review. Metadata is stored under `platform_users.preferences.contactReview` and is removed by existing account deletion cleanup.

Approval is an administrative review, not ownership verification. Only a contact address matching the verified sign-in email gets that ownership indicator. Optional outreach eligibility additionally requires consent, approval, an enabled channel and an active account. No email is sent and no mailing-provider integration is enabled by this feature. Private notes and actor IDs are omitted from the self-service endpoint.

`database/account-contact-directory.sql` adds only MFA-protected read functions. It does not replace tables, accounts, policies or user data. Its private definer function uses the existing `require_admin()` gate and empty search path; its public wrapper is invoker and anonymous execution is revoked. Ordinary users read only their own profile through existing RLS.

Validation: `node --test tests-account-contact.mjs` plus the existing bank, user deletion, admin fields and super-admin suites. `database/test-account-contact-rollback.sql` checks the live RPC with synthetic users and rolls back every fixture. TypeScript and production build must pass. Browser interaction must be checked separately when browser QA is available.
