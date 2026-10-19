# User content management — Campus to Country 7.7.7

Central entry: `/admin?section=content`. Reuses the existing administration, authentication, storage and original editors. No production records or source content were preloaded, reset or deleted by this change.

| Content | Existing management |
| --- | --- |
| Branding, notices, navigation, wording, page blocks and visibility | Site settings, click-to-edit, Super Admin page builder |
| Countries, universities, programmes and scholarships | Country settings, academic catalogue, guides and resource editors |
| Visa guides, official sources, templates and links | Visa management and resource editors |
| Workspace records, documents, applicants and calendars | Applicant Admin and protected document management |
| IELTS vocabulary, notes, grammar, questions, skills and practice sets | Learning Admin: add, edit, bulk JSON import, delete from learner view, restore |
| Premium Academy and paid course materials | Existing protected Academy/course editors and approved media |
| Counseling programmes, sessions and community content | Existing Counseling and mentorship administration |
| VisaFund and bank content | Existing bank operator and site content controls |
| Public learning and catalogue attachments | Public media library, then add the returned public URL in the entry's attached files |

The searchable control index links to original editors and user pages. The resource selector includes every registered resource collection; this does not duplicate existing collections or accounts.

## Imports and uploads

Learning JSON imports accept an array, an `entries` array wrapper or a single object, up to 5 MB and 5,000 entries. Every entry must have a stable unique ID and match the selected collection's existing schema. Learning imports publish only after explicit confirmation; all entries validate before one database transaction. Existing IDs update, other entries remain. Each write records its previous and new content in the audit log. Resource imports merge into the editor draft and require Save before publication.

New learning entries start blank, including when a collection is empty. Vocabulary requires the administrator to enter a word before saving. Existing source vocabulary, lessons and question fixtures remain intact.

Public media accepts PNG, JPEG and WebP up to 8 MB, plus PDF, DOCX, UTF-8 text, MP3, WAV, WebM and MP4 up to 12 MB. Actual multipart bytes are bounded and signatures are checked. These uploads are public; use existing protected editors for private applicant documents and paid materials. Existing referenced public files cannot be removed until references are cleared. Upload/list/delete operations require the existing MFA administrator authorization; mutations require same origin.

## Deletion semantics

Built-in learning deletion hides the entry from learners and keeps restoration available. Removing a wording override restores the original wording. Custom records use their original deletion controls and safeguards. This change adds management capabilities; it does not delete user data or bypass authorization.

## Verification

- Existing 194 JavaScript regression tests passed after attachment integration.
- Additional tests cover all blank entry schemas, a 3,003-entry transaction, preserved unlisted records, before/after audits, invalid/duplicate batch rejection, public attachment URL validation, file byte readback, MIME spoof rejection and reference-aware deletion.
- TypeScript and production build checked separately.
- Browser interaction QA is unavailable in this environment. Existing repository-wide lint backlog is not resolved by this change.
- Saved review only; production deployment remains subject to the prior audit restriction.
