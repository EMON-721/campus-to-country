# Central administration extension

Entry: `/admin?section=super`. Existing MFA-verified `ctc_admins` members have full application management privileges. No existing member or applicant record is changed by deployment.

The searchable control directory links the six existing module editors, all registered IELTS/Workspace pages, banking tools, applicant documents, account controls, mentorship approvals, services and change history.

New settings in `SiteSettings.customization`:

- Public and notice logos, favicon, footer copy and links.
- Homepage section visibility and university directory/comparison sizes.
- New/custom replacement pages with text, image, video, links, FAQ and table blocks. Blocks can be added, reordered, duplicated, hidden and removed. Pages support header/footer/section navigation and signed-in access. Anonymous settings and initial page props exclude member-page bodies.
- Reading and Listening short exercises, answer keys, Writing prompts/tables, Speaking prompts, routine defaults, study targets and mock windows. Existing attempts and learner preferences are retained.
- Premium lesson visibility: administrator only (unchanged default), signed-in learners or public. Changing visibility does not activate a payment provider.
- General Workspace upload allowance; original per-file validation remains.
- User mutation API availability, enforced by middleware with an MFA-admin bypass. Account recovery and administrator controls cannot be disabled through these user rules.

Page editor (`?edit=1`): text, links and accessible labels remain available. The additional visual selector controls image/media URLs, visibility, text alignment, colours, font size, padding, corner radius and maximum width. Saved element overrides use validated structural selectors and style properties. No executable HTML, JavaScript or arbitrary CSS is accepted. Private records are managed through record editors. Layout changes can require reselecting a structural element; removing its override restores the original presentation.

Saved content can be paged, unpublished, deleted and restored using recorded snapshots. Deleted content IDs can be recreated by snapshot restoration. Settings retain revision-conflict checks. The public content request is scoped to the current route so unrelated library overrides do not crowd out page labels.

Public image uploads use `/api/v1/site-assets`, private admin listing, MIME signatures and R2. An image still referenced by stored content/configuration cannot be removed until references are changed.

`database/admin-roles.sql` installs `ctc_manage_admins`. It checks the existing private MFA gate, grants only existing verified accounts, serializes membership mutations, retains at least one administrator and records role changes in lifecycle audit. Ordinary users cannot promote themselves. No service-role key reaches the browser.

Existing module features remain: catalogue create/edit/publish/hide/restore, bilingual visa guides, all learning libraries and answers, applicant record CRUD/export, applicant documents, bank operator editing and paired-transfer corrections, mentorship courses/materials/access/requirements/payment review, sessions/approval/rejection, inquiries and comments, contact inbox, AI/email/payment configuration and account suspension/restoration/deletion.

External account ownership and provider capabilities are not changed. The application cannot read users' unsynced browser storage remotely, recover permanently deleted file bytes, issue bank statements, bypass provider billing or operate hosting/GitHub account settings through the website. Live payment remains unactivated.

Validation: TypeScript; targeted tests in `tests-super-admin.mjs`; existing administrator, bank, mentorship, domain and finance regressions; PostgreSQL transactional role tests rolled back without changing memberships. Browser interaction QA requires the managed browser capability and is reported separately.
