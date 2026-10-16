# IELTS incremental integration — 12 October 2026

Target: existing Campus to Country Site appgprj_6acbb877378c8191a95b6fb545a83196, `/ielts/*`. Input: attached v2.1.4 standalone specification. Current user instructions supersede its old standalone-site, Passport Band, Campus To Connect, owner-contact-removal and initial no-account instructions. No separate Site, auth system, calendar system, finance changes or new parent homepage was created.

## Preserved existing implementation
- 1,000 and 3,003-entry vocabulary collections; 266 recovered notes; 200 original worksheets and source images.
- Original 3 Reading / 3 Listening sets and 10 Writing / Speaking sets, audio, answer keys and evidence.
- Four skill drills, browser-local writing drafts, microphone recording, typing metrics.
- Central authenticated/guest progress, focused study timer with pause/recovery and central calendar.
- Existing milestone dates and records; admin membership/MFA and database policies.
- Parent branding, contact, copyright, six-module palette, approved logo and all non-IELTS routes.

## Added gaps
| Area | Incremental change | Verification |
|---|---|---|
| Guide | Academic/General distinction, section formats, Writing/Speaking criteria, official raw-score reference points | Official IELTS sources checked |
| Practice hub / bank | Search, skill/type/difficulty filters, learning/review modes using existing 240 Reading/Listening questions | Original answer-key checks |
| Mock engine | Four skills, section/question navigation, Learning/Timed modes, stable attempt IDs, autosave/recovery, elapsed/remaining clock, auto-submit, flags, notes, passage highlights, evidence and type accuracy | Engine tests + TypeScript; browser pending |
| Listening | Existing original audio; timed mode one playback with saved resume positions, learning replay/transcript | Media path checks; live audio QA pending |
| Writing | Existing 10 two-task sets available through timed mock engine, independent responses/word counts, drafts, submission/history, Not assessed rubric | TypeScript; browser pending |
| Speaking | Existing recorder reused inside mock, cue-card preparation clock, browser-local IndexedDB recording save/playback/download/delete | TypeScript; microphone/IndexedDB browser QA pending |
| Vocabulary | Meaning-to-English recall quiz and saved objective review, preserving both lists | TypeScript |
| Pronunciation | Sounds, stress, intonation, connected speech; optional device speech playback, saved self-review | TypeScript; device voices vary |
| Learning units | Interactive access to original 28 strategy units, contexts, expected answers and revision guidance | Original content preserved |
| Daily routine | Separate editable six-hour routine; task add/edit/delete/reorder/status/notes; existing timer links | 360-minute default test |
| Milestones | Existing four presets now generate explicit weekly objectives/tasks; historical records preserved | Date regression tests |
| Progress/history | Real totals, skill totals, seven-day focus bars, date/activity filtering, saved answers, timestamps for new guest records | Domain regression tests |
| Typing | Keyboard/finger guidance, letter practice, supported custom duration and history summary | Existing typing regression tests |
| Settings | Daily target, larger text, study theme, reduced motion, default mode, validated merge-only backup import/export, preference reset | Schema validation + TypeScript |
| Premium | 13 server-only core grammar foundation lessons with examples/questions/explanations; metadata-only public catalogue; role + MFA admin preview | Server gate, bundle inspection; owner-session QA pending |
| Admin | Existing content editor gains IELTS question and protected-lesson entries; question-key edits feed bank and mocks | Existing admin gate and RLS retained |
| Readability | Larger text/controls, wider gutters, room between cards/forms, responsive nav and reading layout | TypeScript/build; browser pending |
| Hero | Existing globe/orbit/plane CSS motion, reduced-motion support | CSS implemented; browser pending |

## Accurate remaining limits
- This is an incremental integration, not a claim that all 2.1.4 requirements are fully complete.
- Managed browser control is unavailable. End-to-end navigation, refresh/recovery, expiry, microphone/IndexedDB, audio restrictions, responsive visual checks and admin edit flows need browser QA.
- The existing original test audio is synthetic; material is uncalibrated. Scores are raw practice accuracy. Official reference points are educational guidance, not predicted IELTS bands. Writing/Speaking are Not assessed.
- Premium now has 13 protected core grammar lessons; this is not a complete four-skill Beginner-to-B2 course or certification. Paid checkout and learner entitlements remain disabled.
- Full structured mock-set/typing/resource/milestone-template administration, revision rollback and arbitrary new mock authoring remain incomplete. Existing custom private questions are editable and retained.
- Question-bank filters cover the existing Reading/Listening collection; Writing/Speaking prompts remain in their skill notes and mock sets. Not every requested question subtype has a separate authored foundation lesson or calibrated difficulty set.
- Browser-local routines, preferences, drafts and recordings do not sync across devices. Submitted practice and recorded focus retain the existing central-account save path. Calendar stays the central calendar; guest calendar support was not rebuilt.
- Calendar week start/time format and notification channels were not added as pretend-working controls.
- Backup import validates all records first and merges new IDs only. It can stop after partial successful inserts if a later network request fails; existing records are never overwritten.

## Checks
`tsc --noEmit`; `tests-ielts-engine.ts` (normalization, alternatives, word limits, clock bounds, draft namespaces, 360-minute routine, all 240 answer keys); recovered-material/media checks; 15 domain assertions; 21 finance regression assertions. Production build and private deployment are recorded by the native Site workflow.
