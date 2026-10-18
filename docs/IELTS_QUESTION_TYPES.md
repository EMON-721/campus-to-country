# IELTS question types and screenshot reference map

The four uploaded screenshots are the source for the visible type tags and topic names, not full question papers or audio. The new learner directory appears in Listening, Reading, Writing and Speaking and at `/ielts/question-types`. Existing drills, practice sets, notes, recording and progress tools remain available.

The seed contains 34 detailed guides: 7 Listening types, 13 Reading types, 11 Academic Writing preparation categories and 3 Speaking part guides. Every guide has English and Bangla descriptions, approach steps, common mistakes, an original micro-example and an official format link. Objective examples provide feedback and explanations; Writing/Speaking use ungraded responses and example plans. Saving uses the existing owner-scoped attempt history or existing browser guest storage. No automatic IELTS band is assigned.

The reference map transcribes 11 Listening rows (including Athar's Collection, Listening Test 4 — Paper B), 10 Reading rows, 10 Writing rows with their Task 1/Task 2 pairs, and 10 Speaking rows with 50 topic placements. Listening and Reading images provide whole-test tags, so no per-part question assignment is invented. Clipped Reading tags are marked partial. The screenshot headers' 60 passages / 40 Writing tasks are not adopted as available content totals, since only ten rows of those skills are visible. All displayed guide and row totals come from the collections actually shown.

Part/Task buttons reveal the relevant reference topics/type guides. Administrators may attach a real HTTPS or local IELTS practice link to each part, alongside editing existing mock sets. A reference row remains visibly a reference until the separate linked content is opened.

MFA administrators can manage both collections at `/admin?section=ielts&panel=question-types` or through each skill's page controls. Collections are `ielts-question-types` and `ielts-reference-tests`, using the existing audited D1 resource API: add, edit, reorder, hide, restore and remove. Dedicated Zod schemas validate guide fields, answer keys, skill enums, part counts, reference-only provenance and safe links. Existing resources retain their own validation paths. No database reset or schema replacement is required.

Official format references checked 18 October 2026:
- https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-listening
- https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-reading
- https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-writing
- https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-speaking

Validation: `node --test tests-ielts-question-types.mjs tests-section-admin.mjs tests-super-admin.mjs tests-admin-centralization.mjs tests-workspace-admin-controls.mjs`, TypeScript and production build. Browser interaction requires separate verification when a supported browser tool is available.
