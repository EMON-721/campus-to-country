# The Band Passport

A private IELTS Academic planner with 33 navigation destinations, seven daily skills, exactly 360 active study minutes, original exercises, timers, drafts, vocabulary revision and mock-test estimates.

## Run locally

No dependencies or build step required. From the project folder run:

```bash
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000 in your browser. Data is saved in localStorage per browser/device; export a JSON backup in Settings before clearing storage or changing devices. All dates use Asia/Dhaka. The deployed site uses Sites owner-private access.

## Files

- dist/index.html: application shell
- dist/style.css: responsive light/dark styling
- dist/data.js: original practice content and study plan
- dist/app.js: state, timers, navigation, editors and trackers

## Scoring

Listening and Academic Reading estimates interpolate official average reference points (IELTS.org); actual test thresholds vary. Writing/Speaking scores are manually supplied. This app does not grade essays or speech, and the short original exercises are not full-length IELTS tests. Synthetic speech depends on browser voice support. Use linked official recordings for authentic accent practice.

## Privacy

Progress is browser-local, never uploaded by the app. No cross-device synchronization. Avoid using a shared browser profile for private learning data. Export and restore are available.

## Version 4 upgrade

The original app remains in app.js. academy-data.js supplies original question/lesson data and verified-status resource entries. academy.js extends the existing app, reusing its localStorage key and preserving version-1 backups. There is no npm or framework build required.

Text data stays in localStorage; private files and recordings are in the `emon-ielts-private-files` IndexedDB database. Export a full backup with files in Settings. Exported JSON is private user data: do not commit it to source control. Resource JSON/CSV imports are separate from progress backups.

Run checks with Node.js:

```bash
node check-core.cjs
node check-academy.cjs
```

Tests exercise the application logic with a lightweight document stub. They are not full browser UI, microphone or IndexedDB acceptance tests. Browser visual QA is unavailable in this environment.

AI evaluation is not configured. The Tutor displays rule-based lesson recommendations and transparent limitations. Video candidates are unverified; no automatic synchronization with external portals exists. Copyrighted Cambridge test contents are not included. Reading simulator uses 3 short original passages and 40 questions, not calibrated full-length exam content. Listening currently has 4 synthetic-audio parts and 12 questions; no 40-question Listening exam is claimed.

## Version 4.1

The Practice Hub extends the existing simulator route. Three original full-length Reading sets contain 120 questions. Three shortened Listening drills contain 120 questions with twelve bundled MP3 recordings; these are not full-length official Listening mocks. Six new Writing tasks and three Speaking sets include saved drafts and self-review, without automated grading. The combined seeded objective bank contains 430 questions. Typing Academy includes 23 built-in exercises, virtual keyboard guidance and error analysis.

Run the additional integrated check:

```bash
node check-practice41.cjs
```

This check also requires ffmpeg/ffprobe to decode and validate audio assets. Audio is already bundled for normal website use. Optional content/audio regeneration scripts are in scripts/ and require Python, Flite and ffmpeg. For a private local server, use `python3 -m http.server 8000 --bind 127.0.0.1 --directory dist`.

See IMPLEMENTATION-REPORT-V4.1.md for exact completed features, validation boundaries and remaining work. Existing storage keys, private attachment database and history are preserved. Browser/mobile, microphone and actual IndexedDB acceptance tests remain unverified.

## Version 4.2

Practice Hub → Listening → Recording length offers three full-length original synthetic mocks and preserves Version 4.1 mini-practice. Full audio totals 30:38, 30:14 and 30:14, plus two final checking minutes. Eight question types are represented. These are unofficial, uncalibrated learning assessments, without authentic accent claims. Full variants reuse 114 existing items and add six plan labels; the seeded bank now contains 436 distinct objective questions.

Run `node check-practice42.cjs` in addition to the three previous checks. It uses simulated controls/media/storage callbacks and real ffmpeg decoding; it is not browser acceptance testing. Reading source equality is checked against the Version 4.1 Git baseline. The check writes a structural audit into the task scratch directory.

Long-form audio can be regenerated with `python3 scripts/build-v42-listening.py` using installed Flite voice libraries and ffmpeg. Recordings are already bundled for ordinary use. Historical snapshots store repeated passage/transcript text once and reconstruct question context for review. Full backup attachment restoration uses an atomic IndexedDB transaction; real-browser validation remains pending.


## Version 4.6 backend checkpoint

The original UI and assets now live in `public/legacy`. Its localStorage and IndexedDB names are unchanged. Do not make this legacy owner workspace public before per-student isolation and ownership migration are finished.

Install with the repository lockfile, run `npm run db:generate` only after schema changes, then `npm run build`. Hosted deployments use the existing Sites project with D1 (`DB`) and R2 (`BUCKET`). Authentication is platform-owned ChatGPT sign-in, not app email/password authentication. Set `ADMIN_USER_IDS` securely in hosted environment to the owner's Site-specific account identifier from `/profile`. Never use an email or client-supplied role for authorization.

Run `node tests46/backend.test.mjs` and existing `node check-*.cjs` suites individually. Legacy checks now read `public/legacy`. Tests use isolated SQLite and simulated controls; they do not prove browser login/audio/microphone workflows.

See `CHECKPOINT-V4.6.md` for unfinished requirements. Payment checkout is disabled; no sandbox merchant credentials or live payment configuration is present.

