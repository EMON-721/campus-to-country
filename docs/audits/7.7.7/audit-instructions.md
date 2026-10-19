# CAMPUS TO COUNTRY — COMPLETE IMPLEMENTATION AUDIT, GAP RECOVERY & FINAL QUALITY ASSURANCE
## Verify Every Previous Requirement, Complete All Missing Functionality, Fix Broken Integrations & Prevent Feature Loss

**Repository:** https://github.com/EMON-721/campus-to-country  
**Default Branch:** `main`  
**Project:** Campus to Country  
**Task Type:** Full Code Audit + Requirements Verification + Incremental Completion + Regression Testing

---

# 1. PRIMARY MISSION

Act as a Senior Full-Stack Engineer, Software Architect, QA Engineer, Security Auditor, UX/UI Specialist, Database Engineer, and Product Owner.

Your task is to comprehensively audit the existing Campus to Country website against the previously supplied:

**CAMPUS TO COUNTRY — FINAL CONNECTED ECOSYSTEM UPGRADE PROMPT (41 Sections)**

That specification covers:

1. Universities
2. Visa Application
3. Personal Workspace
4. IELTS and Premium Academy integration
5. Bank Statements / VisaFund integration
6. Mentorship & Counseling integration

The main objective is to determine exactly what has been implemented, what is partially implemented, what is missing, and what does not work correctly.

**DO NOT STOP AFTER PRODUCING AN AUDIT REPORT.**

After discovering missing or incomplete functionality, implement the required corrections incrementally within the existing project, subject to the preservation, authorization, and deployment restrictions below.

Your responsibility is to ensure that no previously requested functionality, data connection, user workflow, administrative capability, or security requirement is accidentally omitted.

## Completion Standard

A feature is not complete simply because:

- A navigation link exists.
- A page renders.
- A button appears.
- A placeholder card exists.
- A database table exists.
- A frontend form accepts input.
- A simulated response appears.
- A prompt previously mentioned it.
- An old report marked it complete.

A feature is complete only when its expected functionality works, required data persists, authorization is correct, the user experience is usable, and appropriate tests pass.

---

# 2. STRICT PRESERVATION REQUIREMENTS

This is NOT a request to rebuild the website.

Do not:

- Create a new parent website.
- Change the Campus to Country name.
- Modify the existing approved logo.
- Reset existing databases.
- Delete user records.
- Replace the authentication system.
- Change existing Account IDs.
- Delete university records.
- Delete programme records.
- Delete scholarship records.
- Delete shortlist records.
- Delete application records.
- Delete private documents.
- Delete IELTS results or practice history.
- Delete Premium Academy lessons.
- Delete VisaFund accounts or transactions.
- Delete mentorship enrollment or booking records.
- Delete calendar events.
- Remove administrator permissions.
- Remove existing valid official-source links.
- Disrupt unrelated website modules.
- Introduce fake student profiles or activities.
- Activate live payment collection without approval.
- Deploy unapproved changes to production.

Use additive, backward-compatible modifications wherever possible.

Before any database migration, create and verify an appropriate backup or rollback plan using the project's supported infrastructure.

Do not execute destructive migrations without explicit authorization.

---

# 3. AUDIT THE LATEST GITHUB IMPLEMENTATION

Start with the latest `main` branch.

Do not rely exclusively on previous audit summaries.

Inspect the actual:

- File structure
- Application routes
- React components
- Navigation configuration
- API endpoints
- Database schema
- Database migrations
- Authentication
- Authorization
- CMS
- Administrative interfaces
- Shared records
- File storage
- Service integrations
- Environment configuration
- Tests
- Build configuration

Important existing files include:

### Main Application

- `app/platform.tsx`
- `app/globals.css`
- `lib/module-navigation.ts`
- `lib/brand.ts`
- `lib/domain.ts`
- `db/schema.ts`

### Universities

- `app/catalogue.tsx`
- `app/country-guide.tsx`
- `app/country-programme-utility.tsx`
- `app/italy-programme-utility.tsx`
- `lib/institution-directory.ts`
- `lib/country-programme-reference.ts`
- `lib/academic.ts`
- `app/api/v1/catalogue/route.ts`

### Visa Application

- `app/visa-directory.tsx`
- `app/visa-admin-overview.tsx`
- `app/visa-guide-admin.tsx`
- `app/visa-links-admin.tsx`
- `lib/visa-sources.ts`
- `lib/country-guides.ts`
- `app/api/v1/country-guides/route.ts`

### Personal Workspace

- `app/workspace-files.tsx`
- `app/applicant-admin.tsx`
- `app/ielts-workspace.tsx`
- `lib/workspace-admin-controls.ts`
- `app/api/v1/workspace/documents/route.ts`
- `app/api/v1/admin/workspace/route.ts`

### IELTS / Premium Academy

- `app/ielts-tools.tsx`
- `app/ielts-library.tsx`
- `lib/ielts-engine.ts`
- `lib/ielts-premium.ts`
- `lib/learning-library.ts`

### Bank Statements / VisaFund

- `app/bank/index.tsx`
- `app/bank/workspace.tsx`
- `lib/bank/module-policy.ts`
- Related financial APIs, database tables, and authorization logic

### Mentorship & Counseling

- `app/mentorship.tsx`
- `app/mentorship-enrollment-form.tsx`
- `app/course-learning-room.tsx`
- `lib/mentorship.ts`
- `app/api/v1/mentorship/route.ts`

Also inspect all newer or related files, even when their names are not listed above.

---

# 4. CREATE A COMPLETE REQUIREMENTS TRACEABILITY MATRIX

Before making changes, extract every individual requirement from the previous 41-section specification.

Assign each requirement a unique ID.

Examples:

- UNI-001
- UNI-002
- VISA-001
- VISA-002
- WS-001
- WS-002
- IELTS-INT-001
- FUND-INT-001
- MENTOR-INT-001
- ADMIN-001
- SEC-001
- QA-001

For every requirement record:

| Field | Description |
|---|---|
| Requirement ID | Unique identifier |
| Module | Relevant website module |
| Requirement | Exact expected functionality |
| Existing Route | Current route or page |
| Component | Relevant source file |
| API | Required backend endpoint |
| Database | Associated persistent storage |
| Current Status | Implementation condition |
| Gap | What is missing or broken |
| Action | Required correction |
| Test | How functionality is validated |
| Result | Pass, Fail, Blocked, or Not Run |
| Evidence | File path, test output, or screenshot |
| Completion | Verified only after testing |

Use the following implementation status values:

1. Fully Implemented and Verified
2. Implemented but Not Tested
3. Partially Implemented
4. UI Only
5. Backend Only
6. Missing
7. Broken
8. Integration Missing
9. Security Improvement Required
10. Blocked by External Dependency

**Never classify a feature as complete based solely on the existence of its source code.**

---

# 5. VERIFY EVERY SECTION OF THE PREVIOUS 41-SECTION PROMPT

Treat all 41 sections as mandatory audit scope.

The previous specification included:

1. Primary Objective
2. Preservation Rules
3. GitHub Audit
4. Ecosystem Structure
5. Universities Overview
6. University and Programme Search
7. University Detail Pages
8. Programme Detail Pages
9. Scholarship Finder
10. Programme Comparison
11. Admission Preparation Guide
12. Visa Overview
13. Visa Country Details
14. Visa Journey
15. Visa Document Checklist
16. Embassy and Official Links
17. Visa FAQs
18. Personal Workspace Core Objective
19. Workspace Navigation
20. Workspace Dashboard
21. Profile Management
22. Shortlists and Applications
23. Scholarship Workspace
24. IELTS and Premium Academy Integration
25. VisaFund Integration
26. Mentorship Preservation
27. Mentorship Workspace
28. Mentorship Calendar Integration
29. Document Vault
30. Central Calendar
31. Notifications and Reminders
32. Cross-Module Workflows
33. Responsive UX Design
34. Dashboard Information Priority
35. Super Admin Management
36. Database Architecture
37. Security and Privacy
38. Implementation Roadmap
39. Testing
40. Completion Reporting
41. Final Execution Requirements

**No section may be omitted from the audit.**

Break broad sections into individually verifiable features instead of marking the entire section complete after checking one component.

If the complete earlier prompt is unavailable in the implementation environment, reconstruct the audit checklist from this document, identify any unavailable original wording, and report that limitation rather than falsely claiming a complete comparison.

---

# PART A — UNIVERSITIES VERIFICATION

# 6. UNIVERSITIES MODULE COMPLETE AUDIT

Verify all of the following.

## A. Navigation

- [ ] Universities Overview
- [ ] Explore Countries
- [ ] Find Universities
- [ ] Find Programmes
- [ ] Scholarships
- [ ] Compare Programmes
- [ ] Admission Guide

Verify existing URLs remain functional.

Do not unnecessarily break `/countries`, `/institutions`, or `/programmes`.

## B. Universities Overview

- [ ] Correct hero title
- [ ] Functional programme search
- [ ] Country selector
- [ ] Degree selector
- [ ] Subject selector
- [ ] Teaching-language filter
- [ ] Explore Countries action
- [ ] View Saved Programmes action
- [ ] Responsive result cards
- [ ] Proper empty states

## C. University Search

Verify filtering for:

- [ ] University name
- [ ] Programme name
- [ ] Country
- [ ] City
- [ ] Subject
- [ ] Degree
- [ ] Specialization
- [ ] Institution type
- [ ] Teaching language
- [ ] Duration
- [ ] Tuition
- [ ] Application fee
- [ ] Intake
- [ ] Deadline
- [ ] Entrance exam
- [ ] Interview
- [ ] Academic requirements
- [ ] Scholarship availability

Ensure unsupported filters are not presented as working.

## D. University Details

- [ ] University overview
- [ ] Country
- [ ] City
- [ ] Institution type
- [ ] Official website
- [ ] Departments
- [ ] Available programmes
- [ ] Admission information
- [ ] Admission contacts
- [ ] Official admissions portal
- [ ] Last verified date

## E. Programme Details

- [ ] Programme title
- [ ] Degree
- [ ] Department
- [ ] Specialization
- [ ] Duration
- [ ] Credits/ECTS
- [ ] Language
- [ ] Intake
- [ ] Tuition
- [ ] Application fee
- [ ] Academic requirements
- [ ] CGPA/GPA requirements
- [ ] Language-test requirements
- [ ] Entrance examination
- [ ] Interview
- [ ] Required documents
- [ ] Application deadline
- [ ] Official application URL
- [ ] Research opportunities
- [ ] Funding information
- [ ] Verification status

## F. Scholarship Finder

- [ ] Government scholarships
- [ ] University scholarships
- [ ] Merit-based scholarships
- [ ] Need-based scholarships
- [ ] Tuition waivers
- [ ] Research scholarships
- [ ] PhD funding
- [ ] Erasmus Mundus
- [ ] Scholarship filtering
- [ ] Scholarship detail pages
- [ ] Eligibility requirements
- [ ] Financial benefits
- [ ] Deadlines
- [ ] Official sources
- [ ] Save scholarship
- [ ] Connect scholarship to application
- [ ] Scholarship Workspace integration

## G. Comparison

- [ ] Add programme to comparison
- [ ] Remove programme
- [ ] Compare requirements
- [ ] Compare duration
- [ ] Compare tuition
- [ ] Compare deadlines
- [ ] Compare scholarship availability
- [ ] Responsive comparison interface
- [ ] Save programme to shortlist
- [ ] Open official programme page

## H. Admission Guide

- [ ] Destination selection
- [ ] Programme discovery
- [ ] Eligibility review
- [ ] Programme comparison
- [ ] Document preparation
- [ ] Scholarship preparation
- [ ] Application submission guidance
- [ ] Decision tracking guidance
- [ ] Personal Workspace integration

Verify that all displayed information is sourced from legitimate records.

Do not fabricate university counts, fees, deadlines, rankings, eligibility results, or acceptance probabilities.

---

# PART B — VISA APPLICATION VERIFICATION

# 7. VISA MODULE COMPLETE AUDIT

## A. Navigation

- [ ] Visa Overview
- [ ] Choose Country
- [ ] Visa Requirements
- [ ] Step-by-Step Guide
- [ ] Document Checklist
- [ ] Embassy & Official Links
- [ ] Visa Journey

## B. Visa Overview

- [ ] Country selector
- [ ] Official visa links
- [ ] Preparation guidance
- [ ] Checklist access
- [ ] FAQs
- [ ] Personal Visa Journey action

## C. Country-Specific Requirements

Verify:

- [ ] Correct visa category
- [ ] Country-specific instructions
- [ ] Nationality considerations
- [ ] Residence considerations
- [ ] Embassy jurisdiction
- [ ] Required academic documents
- [ ] Admission requirements
- [ ] Financial evidence
- [ ] Sponsorship requirements
- [ ] Insurance requirements
- [ ] Legalization requirements
- [ ] Translation requirements
- [ ] Fees
- [ ] Appointments
- [ ] Application portals
- [ ] Post-submission procedures
- [ ] Official verification sources

## D. Visa Timeline

- [ ] Admission recorded
- [ ] Visa requirements reviewed
- [ ] Documents in preparation
- [ ] Application prepared
- [ ] Appointment requested/booked
- [ ] Appointment attended
- [ ] Documents submitted
- [ ] Application pending
- [ ] Decision recorded
- [ ] Travel preparation

Stages must adapt to the country's actual procedure.

## E. Visa Document Checklist

- [ ] Identity documents
- [ ] Academic documents
- [ ] Admission evidence
- [ ] Financial documents
- [ ] Scholarship evidence
- [ ] Sponsor evidence
- [ ] Insurance
- [ ] Legalization
- [ ] Translation
- [ ] Application forms
- [ ] Appointment documents
- [ ] Other country-specific requirements

For each item verify:

- [ ] Add
- [ ] Edit
- [ ] Mark status
- [ ] Attach document
- [ ] Add deadline
- [ ] Add notes
- [ ] Save progress
- [ ] Reopen saved checklist

## F. Official Sources

- [ ] Government visa portal
- [ ] Immigration authority
- [ ] Embassy/consulate
- [ ] Official appointment link
- [ ] Application center, if applicable
- [ ] Tracking portal
- [ ] Last verification date
- [ ] Admin source management
- [ ] Broken-link handling

## G. Country Guides and FAQs

- [ ] Existing guides preserved
- [ ] FAQs preserved
- [ ] Country-specific steps preserved
- [ ] Source links preserved
- [ ] Admin publishing works
- [ ] Unpublished records remain private
- [ ] Existing bilingual source data is not destroyed

Use the currently approved public language configuration. Where English-only public UI has been requested, keep the public interface in English without deleting legacy translation data.

Do not produce false visa requirements, guarantees, or simulated government tracking.

---

# PART C — PERSONAL WORKSPACE VERIFICATION

# 8. CENTRAL PERSONAL WORKSPACE AUDIT

## A. Navigation

Verify:

- [ ] Dashboard
- [ ] My Profile
- [ ] Saved Programmes
- [ ] Applications
- [ ] Scholarships
- [ ] Visa Journey
- [ ] IELTS Progress
- [ ] Financial Preparation
- [ ] Mentorship & Sessions
- [ ] Documents
- [ ] Calendar & Tasks
- [ ] Notifications
- [ ] Account Settings
- [ ] Export & Backup

Do not create duplicate account pages or calendars.

## B. Dashboard

Verify:

- [ ] Saved programme count
- [ ] Active application count
- [ ] Upcoming deadline count
- [ ] Pending task count
- [ ] Current applications
- [ ] Continue Where You Left Off
- [ ] Upcoming activities
- [ ] Recent activity
- [ ] Connected services
- [ ] Quick actions
- [ ] Correct empty states

All counts must be calculated from real saved records.

## C. Profile

Verify:

- [ ] Unique Account ID preserved
- [ ] Full name
- [ ] Contact email
- [ ] Nationality
- [ ] Residence
- [ ] Timezone
- [ ] Academic qualification
- [ ] Institution
- [ ] Academic field
- [ ] CGPA/GPA and scale
- [ ] Graduation date
- [ ] Language-test results
- [ ] Country preferences
- [ ] Degree preferences
- [ ] Intended intake
- [ ] Research interests
- [ ] Publications
- [ ] Projects
- [ ] Professional experience
- [ ] Save and edit
- [ ] Privacy controls

All optional information must be user-provided.

## D. Shortlist

Verify:

- [ ] Save programme
- [ ] Open saved programme
- [ ] Edit notes
- [ ] Compare saved programmes
- [ ] Archive
- [ ] Remove
- [ ] Create application from shortlist
- [ ] Prefill known programme information
- [ ] Prevent unintended duplicates
- [ ] Persistent saved data

## E. Applications

Verify:

- [ ] Create application
- [ ] Edit application
- [ ] Delete with confirmation
- [ ] Add university
- [ ] Add programme
- [ ] Add intake
- [ ] Add deadline
- [ ] Add official portal
- [ ] Record submission
- [ ] Update status
- [ ] Record decision
- [ ] Attach documents
- [ ] Associate scholarship
- [ ] Add calendar event
- [ ] Start visa preparation
- [ ] List view
- [ ] Kanban view, if implemented

Check backward compatibility of existing application statuses.

## F. Scholarship Workspace

- [ ] Saved scholarships
- [ ] Application association
- [ ] Deadline tracking
- [ ] Document association
- [ ] Scholarship status
- [ ] Personal notes
- [ ] Persistent progress

Do not infer successful scholarship awards.

---

# PART D — IELTS CONNECTION AUDIT

# 9. VERIFY IELTS AND PREMIUM ACADEMY INTEGRATION

IELTS must remain an independent functional module while sharing appropriate user progress with Personal Workspace.

Verify preservation of:

- [ ] IELTS Reading
- [ ] IELTS Listening
- [ ] IELTS Writing
- [ ] IELTS Speaking
- [ ] Grammar
- [ ] Vocabulary
- [ ] Pronunciation
- [ ] Typing Academy
- [ ] Premium Academy
- [ ] Mock Tests
- [ ] Practice Questions
- [ ] Study Routine
- [ ] Study Timer
- [ ] Existing Notes
- [ ] Existing Recordings
- [ ] Progress History

### Workspace Connection

- [ ] IELTS progress visible in Workspace
- [ ] Real study duration
- [ ] Recent practice
- [ ] Mock results
- [ ] Skill-wise activity
- [ ] Premium learning progress where supported
- [ ] Continue Learning action
- [ ] Open IELTS action
- [ ] Shared calendar integration
- [ ] Existing IELTS records preserved

Do not create a second IELTS progress database.

Do not claim IELTS examiner-calibrated results where no verified assessment exists.

---

# PART E — VISAFUND CONNECTION AUDIT

# 10. VERIFY BANK STATEMENTS / VISAFUND INTEGRATION

Inspect the current VisaFund implementation.

Preserve:

- [ ] Financial dashboard
- [ ] Accounts
- [ ] Transactions
- [ ] Transaction calendar
- [ ] Financial analytics
- [ ] Country requirements
- [ ] Destination planning
- [ ] Financial readiness
- [ ] Country comparison
- [ ] Sponsors and sources
- [ ] Document vault
- [ ] Savings goals
- [ ] Currency converter
- [ ] Fund history
- [ ] Reports

### Workspace Connection

Verify:

- [ ] Financial Preparation card
- [ ] Open VisaFund link
- [ ] Current authenticated user context
- [ ] Savings-goal navigation
- [ ] Financial-readiness navigation
- [ ] Sponsor-management navigation
- [ ] Financial-document navigation
- [ ] Appropriate private summaries
- [ ] Correct access control
- [ ] No duplicate financial records

### Visa Connection

- [ ] Visa financial checklist can link to relevant authorized financial documents.
- [ ] User explicitly selects information to associate.
- [ ] Financial information remains private.
- [ ] Other students cannot access financial records.
- [ ] Mentors cannot automatically access sponsor or banking data.
- [ ] Bank credentials are not requested.
- [ ] VisaFund records are not represented as official bank statements.

**DO NOT REBUILD VISAFUND OR CREATE A SECOND BANKING SYSTEM.**

---

# PART F — MENTORSHIP CONNECTION AUDIT

# 11. VERIFY MENTORSHIP AND COUNSELING INTEGRATION

Preserve:

- [ ] Mentor profiles
- [ ] Mentorship programmes
- [ ] Courses
- [ ] Course materials
- [ ] Enrollment requests
- [ ] Enrollment approval
- [ ] Session availability
- [ ] Booking requests
- [ ] Booking approval
- [ ] My Bookings
- [ ] Learning rooms
- [ ] Course discussions
- [ ] Mentorship administration
- [ ] Existing payment restrictions

### Workspace Mentorship Section

Verify:

- [ ] My Mentorship & Sessions
- [ ] Upcoming sessions
- [ ] Pending booking requests
- [ ] Confirmed bookings
- [ ] Session date and timezone
- [ ] Mentor information when available
- [ ] Enrollment history
- [ ] Approved learning-room access
- [ ] Course materials access
- [ ] Browse Mentorship action
- [ ] View Bookings action

### Calendar Connection

Verify:

- [ ] Session request can create a provisional calendar activity.
- [ ] Pending appointments are not labeled confirmed.
- [ ] Approved booking status is correctly reflected.
- [ ] Rescheduling updates the associated activity.
- [ ] Cancellation is reflected.
- [ ] Duplicate calendar events are prevented.
- [ ] Existing events remain intact.

Use actual booking IDs and backend statuses.

Mentors must not automatically access private application documents or financial records.

---

# PART G — DOCUMENT VAULT AUDIT

# 12. COMPLETE DOCUMENT SYSTEM VERIFICATION

Inspect the existing `workspace_documents` storage implementation.

**Known area requiring special verification:** Earlier code uses an IELTS-specific document scope in `/api/v1/workspace/documents`.

Check whether this limitation still exists.

If it does, implement a safe, backward-compatible general Workspace document system.

Do not delete or disconnect existing IELTS documents.

### Required Categories

- [ ] Personal
- [ ] Identity
- [ ] Academic
- [ ] Applications
- [ ] Scholarships
- [ ] IELTS
- [ ] Financial
- [ ] Visa
- [ ] Mentorship
- [ ] Other

### File Operations

- [ ] Upload
- [ ] Download
- [ ] Secure preview
- [ ] Rename
- [ ] Categorize
- [ ] Version replacement
- [ ] Archive
- [ ] Delete with confirmation
- [ ] Link document to application
- [ ] Link document to scholarship
- [ ] Link document to visa checklist
- [ ] Link document to mentorship request where authorized

### Security Tests

- [ ] Authentication required
- [ ] Ownership verified
- [ ] File type validated
- [ ] File size validated
- [ ] Storage quota respected
- [ ] Secure download headers
- [ ] Private storage
- [ ] No public disclosure
- [ ] Appropriate admin controls
- [ ] Audit-sensitive operations

A document associated with several records should not require unnecessary duplicate file storage.

Do not weaken VisaFund-specific document security.

---

# PART H — CALENDAR AUDIT

# 13. VERIFY THE CENTRAL CALENDAR

Preserve the existing 24-hour calendar.

Verify:

- [ ] Day view
- [ ] Week view
- [ ] Month view
- [ ] Agenda view
- [ ] Create activity
- [ ] Edit activity
- [ ] Delete activity
- [ ] Reschedule
- [ ] Repeating events
- [ ] Category filtering
- [ ] Completion status
- [ ] Timezone handling
- [ ] Persistent records

Verify integration with:

- [ ] University deadlines
- [ ] Scholarship deadlines
- [ ] IELTS practice
- [ ] Visa preparation
- [ ] Visa appointments
- [ ] Financial preparation tasks
- [ ] Mentorship sessions
- [ ] Personal tasks

Check for duplicate event creation and inconsistent statuses.

Use one central calendar.

---

# PART I — NOTIFICATION AUDIT

# 14. VERIFY REMINDERS AND NOTIFICATIONS

Check whether a real notification delivery system exists.

Verify:

- [ ] Upcoming university deadlines
- [ ] Scholarship reminders
- [ ] IELTS study reminders
- [ ] Visa tasks
- [ ] Visa appointments
- [ ] Mentorship booking changes
- [ ] Confirmed sessions
- [ ] Enrollment updates
- [ ] Read/unread status
- [ ] Notification preferences
- [ ] Dismiss notifications
- [ ] Relevant record links

Verify:

- Real trigger
- Actual delivery mechanism
- Recipient identity
- Deduplication
- Timezone handling
- Retry behavior
- Opt-out preferences
- Privacy-safe message content

Do not present fake notifications or simulated delivery as working features.

If an external service is required and unavailable, report the dependency clearly.

---

# PART J — CROSS-MODULE END-TO-END TESTS

# 15. TEST ALL MAJOR STUDENT JOURNEYS

Test using isolated temporary test accounts and test records, never real user data.

### Scenario 01

Find University → Open Programme → Save Programme → Verify Workspace Shortlist.

### Scenario 02

Compare Programmes → Select Programme → Save → Reopen Saved Record.

### Scenario 03

Saved Programme → Create Application → Confirm Prefilled Information → Verify Persistent Record.

### Scenario 04

Application → Add Deadline → Open Central Calendar → Verify Event.

### Scenario 05

Scholarship Finder → Save Scholarship → Link Application → Track Scholarship.

### Scenario 06

Application → Attach Document → Reopen Application → Securely Download Associated File.

### Scenario 07

Application → Record Admission Decision → Start Visa Journey → Verify Linked Visa Checklist.

### Scenario 08

Visa Checklist → Open VisaFund → Review Financial Preparation → Return to Visa Checklist.

### Scenario 09

IELTS Practice → Save Result → Open Personal Workspace → Verify IELTS Summary.

### Scenario 10

Mentorship → Request Session → Open My Bookings → Verify Status → Open Calendar.

### Scenario 11

Mentorship Booking Approval → Update Workspace and Calendar without creating duplicate records.

### Scenario 12

Upload Private Document → Log Out → Attempt Direct Access → Verify Access Is Denied.

### Scenario 13

User A Creates Application → User B Attempts Access → Verify Access Is Denied.

### Scenario 14

Admin Updates Published University Information → Verify Public Record Reflects Authorized Changes.

### Scenario 15

Admin Updates Visa Guide → Verify Publication State, Version, and Official Links.

### Scenario 16

Account Export → Confirm Relevant User Records Are Included and Files Are Handled According to Existing Export Policies.

Every scenario must include:

- Preconditions
- Test steps
- Expected result
- Actual result
- Pass/fail
- Evidence

---

# PART K — SUPER ADMIN VERIFICATION

# 16. COMPLETE ADMIN MANAGEMENT AUDIT

Verify the existing Super Admin can administer the relevant modules without bypassing security.

### Universities

- [ ] Country records
- [ ] Institution records
- [ ] Programme records
- [ ] Scholarship records
- [ ] Admission guides
- [ ] Official sources
- [ ] Publication states

### Visa Application

- [ ] Country guides
- [ ] Requirements
- [ ] Embassy links
- [ ] Checklist templates
- [ ] FAQs
- [ ] Source verification
- [ ] Visa-related user support

### Personal Workspace

- [ ] Authorized user support
- [ ] Profile support
- [ ] Application record support
- [ ] Calendar configuration
- [ ] Document policies
- [ ] Notification settings
- [ ] Audit logs

### IELTS

- [ ] Existing IELTS administration preserved
- [ ] Premium Academy administration preserved
- [ ] Lesson management preserved
- [ ] Question management preserved
- [ ] Learner progress administration appropriately authorized

### VisaFund

- [ ] Existing bank-specific admin system preserved
- [ ] Sensitive financial data protected
- [ ] Existing financial administrative permissions retained

### Mentorship

- [ ] Mentor management
- [ ] Course management
- [ ] Enrollment review
- [ ] Booking management
- [ ] Session approval
- [ ] Material publication
- [ ] Learner access management

### Administrative Operations

Where appropriate, verify:

- [ ] Create
- [ ] Read
- [ ] Update
- [ ] Delete
- [ ] Enable
- [ ] Disable
- [ ] Publish
- [ ] Unpublish
- [ ] Reorder
- [ ] Archive
- [ ] Restore
- [ ] Approve
- [ ] Reject

Do not assume a visible administrator button means the corresponding API works.

Every privileged action must have server-side authorization.

Verify MFA requirements, audit logs, and destructive-action confirmation.

---

# PART L — UX/UI QUALITY AUDIT

# 17. VERIFY DESIGN AND USABILITY

Check the three primary modules and their Workspace integrations.

### Desktop

- [ ] Navigation is clear
- [ ] Search is prominent
- [ ] Filters are understandable
- [ ] Primary actions are visible
- [ ] Forms are not excessively long
- [ ] Cards are consistent
- [ ] No unnecessary nested navigation
- [ ] Tables remain readable

### Mobile

Test representative viewport widths including:

- 320px
- 375px
- 390px
- 768px

Also test a desktop viewport.

Verify:

- [ ] No unintended horizontal overflow
- [ ] Forms work
- [ ] Buttons are accessible
- [ ] Navigation opens and closes
- [ ] Comparison is usable
- [ ] Dashboard cards fit
- [ ] Calendar controls work
- [ ] Document upload works
- [ ] Modal dialogs are accessible

### Accessibility

Check:

- Keyboard access
- Form labels
- Focus indicators
- Error messages
- Semantic headings
- Color contrast
- Screen-reader descriptions
- Reduced-motion support
- Adequate touch targets

Use the established website design system.

Preserve the existing logo and visual identity.

Do not introduce external branding.

---

# PART M — BACKEND AND DATABASE AUDIT

# 18. DATABASE INTEGRITY

Verify:

- [ ] Existing tables preserved
- [ ] Existing Account IDs preserved
- [ ] Existing records preserved
- [ ] Appropriate foreign relationships
- [ ] Stable record identifiers
- [ ] Valid schema migrations
- [ ] No duplicate source records
- [ ] No accidental user-data overwrite
- [ ] Proper indexing
- [ ] Persistent updates
- [ ] Correct deletion behavior
- [ ] Proper audit logging
- [ ] Rollback strategy

Check that:

- University records connect to programme records.
- Shortlists connect to users.
- Applications connect to users and programmes.
- Scholarships connect appropriately to users and applications.
- Visa journeys connect to users and relevant countries.
- Documents connect to their authorized owners.
- Calendar events connect to their actual source records.
- IELTS progress connects to the correct user.
- Financial data remains under the existing financial authorization boundary.
- Mentorship bookings and enrollments connect to the correct user.

Do not create a duplicate database for Personal Workspace.

---

# 19. API FUNCTIONALITY AUDIT

For every required API endpoint, test:

- Authentication
- Authorization
- Request validation
- Response validation
- Error handling
- Persistence
- Correct ownership
- Rate limits where applicable
- Appropriate HTTP status
- Safe handling of missing data
- Correct publication visibility

Test both valid and invalid requests.

Test expired or missing sessions.

Test cross-user access attempts.

Test unauthorized administrative requests.

No frontend-only authorization may replace backend access checks.

---

# PART N — SECURITY AUDIT

# 20. SECURITY VERIFICATION CHECKLIST

Verify protection against:

- Unauthorized document access
- Cross-account record access
- Insecure direct object references
- Improper admin permissions
- Missing server-side validation
- Unsafe file uploads
- Cross-site scripting
- CSRF on sensitive actions
- Unsafe external redirects
- Sensitive data leakage
- Accidental public banking data
- Exposure of document URLs
- Uncontrolled AI access to private documents

Check that personal and financial records are not shared with mentors or other users without explicit permission.

Do not expose secrets in test logs or screenshots.

Do not disable existing security checks merely to make tests pass.

---

# PART O — AUTOMATIC GAP RECOVERY

# 21. FIX ALL VERIFIED IMPLEMENTATION GAPS

After building the audit matrix:

1. Identify incomplete requirements.
2. Group them by module.
3. Identify dependencies.
4. Prioritize security and data-integrity problems.
5. Fix broken existing features.
6. Complete missing backend logic.
7. Connect incomplete frontend workflows.
8. Add missing persistence.
9. Add missing admin functionality.
10. Add necessary tests.
11. Re-run regression checks.
12. Update implementation status based on evidence.

### Critical Rule

Do not mark missing functionality as complete simply by creating a placeholder interface.

If a requested feature needs a database table, API, authorization, and frontend component, implement and test all required layers.

If external credentials, official data, vendor authorization, or payment approval are missing, isolate the blocked portion and report the exact blocker.

Do not invent credentials or bypass authorization.

---

# 22. FIX FEATURES IN A SAFE ORDER

Follow this priority:

**Priority 1 — Data Integrity and Security**

- Broken ownership controls
- Document access problems
- Data loss risks
- Unauthorized operations
- Incompatible migrations

**Priority 2 — Broken Existing Functionality**

- Nonworking buttons
- Broken forms
- Failed saves
- Incorrect route handling
- Missing records
- Broken API connections

**Priority 3 — Cross-Module Integration**

- Universities to Workspace
- Visa to Workspace
- IELTS to Workspace
- VisaFund to Workspace
- Mentorship to Workspace
- All modules to Calendar

**Priority 4 — Missing Features**

- University filters
- Scholarships
- Detailed programme information
- Dynamic visa checklist
- Application stages
- Workspace dashboard improvements
- Notification functionality

**Priority 5 — UX and Accessibility**

- Navigation simplification
- Mobile layout
- Form usability
- Clear empty states
- Consistent cards and buttons

Do not sacrifice data safety for speed.

---

# PART P — TESTING AND REGRESSION

# 23. RUN AVAILABLE TESTS

Run the existing relevant project tests.

Include:

- TypeScript checks
- Linting
- Production build
- Unit tests
- Integration tests
- API tests
- Database migration tests
- Security tests
- Navigation tests
- Document ownership tests
- Cross-module workflow tests
- Admin permission tests
- Mobile/browser tests where a supported test environment exists

Add regression tests for newly fixed issues.

Do not claim browser tests passed unless a real browser test was performed.

Do not claim an external service integration passed if it was only mocked.

---

# 24. VERIFY NO EXISTING FEATURES WERE LOST

After implementation, compare the updated version against the original baseline.

Check:

- Universities records intact
- Country guides intact
- Programme records intact
- Shortlists intact
- Applications intact
- User accounts intact
- IELTS records intact
- Premium Academy intact
- VisaFund records intact
- Mentorship records intact
- Private documents intact
- Calendar events intact
- Admin controls intact
- Official links intact
- Website branding intact
- Existing unrelated modules functional

Any unexpected feature regression must be treated as a failure.

Fix the regression before considering the upgrade complete.

---

# PART Q — FINAL REQUIREMENTS COMPLETENESS CHECK

# 25. NO-OMISSION VERIFICATION

Before delivering the final result, compare the implemented website against every requirement in:

**Campus to Country — Final Connected Ecosystem Upgrade Prompt (Sections 1–41)**

Then compare against the complete checklist in this audit prompt.

Verify that:

1. No requirement was accidentally omitted.
2. No working feature was unnecessarily replaced.
3. No old user data was deleted.
4. No existing route was broken.
5. No duplicate module was introduced.
6. No duplicate user registry was introduced.
7. No duplicate calendar was introduced.
8. No duplicate financial system was introduced.
9. No functionality was labeled complete without evidence.
10. No security restriction was weakened.
11. No fictional information was introduced.
12. No unrelated module was damaged.
13. No approved logo or branding was changed.
14. Every user-facing action has appropriate behavior.
15. Every newly required administrative action works.
16. Every persistent feature saves and reloads correctly.
17. Every cross-module relationship is tested.
18. Every remaining blocker is documented.

If any requirement is still incomplete, keep it in the outstanding-requirements list with its original requirement ID.

Never silently remove requirements from the scope.

---

# PART R — FINAL REPORT FORMAT

# 26. PRODUCE A DETAILED VERIFICATION REPORT

After performing the audit and authorized corrections, generate a report titled:

**CAMPUS TO COUNTRY — FINAL IMPLEMENTATION VERIFICATION REPORT**

Include:

## A. Executive Summary

- Overall readiness
- Completed functionality
- Missing functionality
- Security findings
- Critical blockers

## B. Requirement-by-Requirement Matrix

Every requirement ID must appear.

Show:

- Requirement
- Current status
- Implementation location
- Test result
- Evidence
- Remaining action

## C. Universities Report

Show implemented, fixed, and incomplete features.

## D. Visa Application Report

Show implemented, fixed, and incomplete features.

## E. Personal Workspace Report

Show implemented, fixed, and incomplete features.

## F. IELTS Integration Report

Show actual progress connection and limitations.

## G. VisaFund Integration Report

Show actual financial-workspace integration and privacy boundaries.

## H. Mentorship Integration Report

Show actual booking, enrollment, session, and calendar connections.

## I. Super Admin Report

Show working management functionality and permissions.

## J. Database and Security Report

List migrations, ownership tests, and remaining risks.

## K. UX and Accessibility Report

Identify usability improvements and responsive testing.

## L. Test Results

Provide:

- Tests executed
- Tests passed
- Tests failed
- Tests blocked
- Tests not run

## M. Changed Files

List relevant modified files and explain the changes.

## N. Outstanding Requirements

For every incomplete item provide:

- Requirement ID
- Reason
- Blocker
- Required next action
- Current state

Do not use vague phrases such as "Everything is implemented" without individual verification.

---

# 27. COMPLETION RULE

Do not declare the project complete until all implementable requirements within the authorized scope have been addressed and relevant tests have passed.

External dependencies requiring user credentials, production access, payment authorization, unavailable official data, or unsupported browser tools must be clearly reported as blocked.

Do not hide or silently ignore these limitations.

A successful build does not prove every user journey works.

A working page does not prove database persistence.

A saved record does not prove authorization is secure.

A source file does not prove the feature is usable.

**Verification must be evidence-based.**

---

# 28. FINAL EXECUTION COMMAND

Perform a complete audit of the latest Campus to Country GitHub implementation.

Verify every feature promised in the previous 41-section Final Connected Ecosystem Upgrade specification.

Audit all six connected modules:

1. Universities
2. Visa Application
3. Personal Workspace
4. IELTS and Premium Academy
5. Bank Statements / VisaFund
6. Mentorship & Counseling

Check the frontend, backend, database, user journeys, document system, calendar, notifications, admin controls, responsiveness, and security.

Complete verified missing functionality incrementally.

Repair broken features.

Improve incomplete integrations.

Preserve all existing user data and working functionality.

Do not rebuild the website.

Do not change the approved logo.

Do not create duplicate modules.

Do not introduce fake records.

Do not weaken access controls.

Do not enable live payment collection or deploy to production without explicit approval.

Re-run tests after every meaningful implementation phase.

Produce the final traceability matrix and completion report.

**AUDIT EVERYTHING → IDENTIFY EVERY GAP → FIX WHAT IS MISSING → TEST EVERY CONNECTION → VERIFY DATA PRESERVATION → REPORT EVERY RESULT.**

**NOTHING REQUESTED SHOULD BE SILENTLY OMITTED, AND NOTHING UNVERIFIED SHOULD BE MARKED COMPLETE.**
