# English-only presentation

This increment supersedes the earlier bilingual display requirement. Campus to Country's navigation, public guides, learning instructions, Workspace language controls, administration labels, Bank Statements display and assistant responses use English.

- Country guides display their existing English fields. Translation switches are removed; original translated source fields remain stored.
- Visa, university search, IELTS question-type help, Premium Academy, mentorship upload controls and support labels display English.
- Previously saved Bank Statements language preferences cannot switch the interface back to Bengali. Financial records are unchanged.
- The 266 original notes receive a non-mutating English presentation, including translated strategy introductions and the complete tense chart.
- Both original vocabulary collections and progress IDs are preserved. Saved English definitions (`meaningEn`) take priority; an explicitly revealed definition can use the public Free Dictionary API. Only the selected English word is sent, without account cookies or referrer. Requests time out, cache successful results and allow retry; an external English dictionary link is available when lookup fails. No definitions or personal records are fabricated. Quizzes mask accepted answers in their English clues.
- Dictionary reference: https://dictionaryapi.dev/. Provider access and browser CORS remain deployment acceptance checks; live endpoint access could not be verified from this environment. Browser clicks/mobile behavior are unverified.
- Admin structured forms omit archived locale fields while retaining them in saved objects. Updating an English field does not erase an original translation. Private user-authored notes, uploaded originals and audit records are not translated or deleted.
- The approved branding, account authentication, Account IDs, original course/word IDs, applications, calendars, VisaFund and mentorship records remain unchanged. No database migration or production-data mutation is required.

Validation: TypeScript; production build; English-only React rendering, content projection, dictionary retry/privacy and preservation tests; existing module/security/regression tests; original content and media checks. No production publication occurs without the approval required by the earlier supplied specification.
