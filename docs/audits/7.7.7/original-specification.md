# CAMPUS TO COUNTRY — FINAL CONNECTED ECOSYSTEM UPGRADE PROMPT
## Universities + Visa Application + Personal Workspace
### With Existing IELTS, Premium Academy, VisaFund, and Mentorship Integrations
**Implementation Type:** Incremental Upgrade — No Rebuild  
**Repository:** https://github.com/EMON-721/campus-to-country  
**Branch:** main

---

# 1. PRIMARY OBJECTIVE

Act as a senior full-stack engineer, product architect, UX/UI designer, database architect, security specialist, and quality-assurance engineer.

Upgrade the existing **Campus to Country** website into a more organized, practical, and user-friendly study-abroad ecosystem.

The three primary modules being upgraded are:

1. Universities
2. Visa Application
3. Personal Workspace

The Personal Workspace must remain connected with three additional existing modules:

4. IELTS and Premium Academy
5. Bank Statements / VisaFund
6. Mentorship & Counseling

**IMPORTANT: All six modules already belong to the same ecosystem. Do not recreate them as separate websites or disconnected applications.**

The primary objective is to improve functionality, navigation, usability, data connections, and the student journey while preserving existing records and features.

The complete user journey should be:

Discover Universities → Compare Programmes → Save Shortlist → Prepare Documents → Apply → Track Admission → Prepare Visa → Track Visa → Prepare for Departure.

IELTS preparation, financial planning, mentorship, and the personal calendar must support this journey through a shared Personal Workspace.

---

# 2. NON-NEGOTIABLE PRESERVATION RULES

This is an incremental update.

**DO NOT REBUILD THE WEBSITE FROM SCRATCH.**

Do not:

- Rename Campus to Country.
- Replace or redesign its approved logo.
- Introduce another parent website.
- Create duplicate user accounts.
- Replace existing authentication.
- Reset or delete existing databases.
- Delete existing user profiles.
- Delete existing university records.
- Delete existing shortlists.
- Delete existing application records.
- Delete IELTS progress.
- Delete vocabulary or practice materials.
- Delete existing financial records.
- Delete sponsor information.
- Delete mentorship bookings or enrollments.
- Delete personal documents.
- Delete existing calendar events.
- Remove administrator privileges.
- Modify unrelated website modules unnecessarily.
- Activate paid services without approval.
- Add fabricated user activities or statistics.

Preserve the existing visual identity, routing conventions, shared application architecture, and working implementations.

If a feature already exists, improve it rather than building a duplicate.

If a feature is incomplete, extend the current implementation.

If a feature is missing, implement it using the existing platform architecture.

All changes must be backward-compatible wherever reasonably possible.

---

# 3. REQUIRED GITHUB CODE AUDIT

Before implementation, inspect the latest default-branch code.

Review at minimum:

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
- `lib/workspace-admin-controls.ts`
- `app/api/v1/workspace/documents/route.ts`
- `app/api/v1/admin/workspace/route.ts`

### IELTS

- `app/ielts-workspace.tsx`
- `app/ielts-tools.tsx`
- `lib/ielts-engine.ts`
- `lib/ielts-premium.ts`

### Bank Statements / VisaFund

- `app/bank/index.tsx`
- `app/bank/workspace.tsx`
- `lib/bank/module-policy.ts`
- Existing banking APIs and storage services

### Mentorship

- `app/mentorship.tsx`
- `app/mentorship-enrollment-form.tsx`
- `app/course-learning-room.tsx`
- `lib/mentorship.ts`
- `app/api/v1/mentorship/route.ts`

Also inspect relevant existing APIs, migrations, route handlers, test files, and administrative controls.

Classify existing features as:

- Working and reusable
- Working but needs improvement
- Partially implemented
- UI only
- Missing
- Requires integration
- Requires security improvement

Do not assume every route or displayed feature works correctly without validation.

---

# 4. COMPLETE ECOSYSTEM STRUCTURE

Maintain six main platform modules.

## Module 01 — Universities

Main sections:

- Overview
- Explore Countries
- Find Universities
- Find Programmes
- Scholarships
- Compare Programmes
- Admission Guide

## Module 02 — IELTS

Preserve:

- IELTS Overview
- Reading
- Listening
- Writing
- Speaking
- Vocabulary
- Grammar
- Pronunciation
- Typing Academy
- Premium Academy
- Mock Tests
- Study Routine
- Progress Tracking

## Module 03 — Visa Application

Main sections:

- Overview
- Choose Country
- Visa Requirements
- Step-by-Step Guide
- Document Checklist
- Embassy & Official Links
- Visa Journey

## Module 04 — Bank Statements / VisaFund

Preserve the existing financial management functionality, navigation, data models, and storage.

## Module 05 — Mentorship & Counseling

Preserve existing mentoring programmes, mentor profiles, courses, bookings, enrollment requests, resources, and administrative systems.

## Module 06 — Personal Workspace

This must be the central student dashboard connecting all five other modules.

Do not move every module's full interface into the Workspace.

Instead, provide concise personal summaries, linked records, and clear actions that open the original modules.

---

# PART A — UNIVERSITIES

# 5. UNIVERSITIES OVERVIEW

Preserve the existing `/countries`, `/institutions`, and `/programmes` routes.

Create a simple and professional Universities landing page.

### Hero

Title:

**Find the right university for your future.**

Subtitle:

Explore countries, find universities, compare programmes, and organize your next steps.

### Primary Search

Provide:

- Search university or programme
- Country
- Degree
- Subject
- Teaching language

Primary actions:

- Find Programmes
- Explore Countries
- View My Shortlist

Below the hero, display:

- Country exploration
- University directory
- Programme finder
- Scholarships
- Admission preparation

Only show genuine catalogue records.

Use meaningful empty states when information is unavailable.

---

# 6. UNIVERSITY AND PROGRAMME SEARCH

Upgrade the existing catalogue search.

Support filters for:

- Country
- City
- University
- Institution type
- Degree
- Academic field
- Specialization
- English-only programmes
- Other teaching languages
- Programme duration
- Tuition
- Application fee
- Intake
- Deadline
- Academic requirements
- English proficiency requirements
- Entrance examination
- Interview
- Scholarships

Use an expandable "More Filters" interface.

Do not display twenty filters simultaneously on mobile.

Only apply filters that are supported by available structured data.

### University Cards

Show:

- University name
- City and country
- Public/private status, when verified
- Available programme information
- Official website
- Verification status

### Programme Cards

Show:

- Programme title
- University
- Country
- Degree
- Duration
- Language
- Tuition, if verified
- Application deadline, if verified

Actions:

- View Details
- Compare
- Save Programme

Do not show fake rankings or fabricated acceptance probabilities.

---

# 7. UNIVERSITY DETAIL PAGES

Each university should have a structured detail page.

Sections:

1. Overview
2. Academic Programmes
3. Admission Information
4. Tuition and Fees
5. Scholarships
6. Application Process
7. Official Links

Include relevant verified details:

- Institution name
- Country and city
- University type
- Official website
- Academic departments
- Programme availability
- Campus information
- Admission contact
- Admission portal

Avoid excessively long pages.

Use tabs or expandable sections.

---

# 8. PROGRAMME DETAIL PAGES

Each programme should have a comprehensive information page.

### General Information

- Programme name
- Degree
- Department
- Academic specialization
- Duration
- Credits/ECTS
- Language
- Intake
- Study mode

### Admission Requirements

- Previous degree requirements
- Academic background
- Minimum GPA/CGPA, if published
- Subject prerequisites
- Language test requirements
- Interview
- Entrance examination
- GRE/GMAT, if required
- Portfolio/research proposal, if required

### Financial Information

- Annual tuition
- Application fee
- Other mandatory fees
- Tuition waivers
- Scholarships
- Funding opportunities

### Application

- Opening date
- Deadline
- Required documents
- Official application portal
- Selection process
- Decision timeline, if published

### Additional Information

- Research opportunities
- Relevant academic resources
- Official programme contact
- Last verification date

Use "Not verified" instead of guessing.

---

# 9. SCHOLARSHIP FINDER

Create a dedicated scholarship discovery interface.

Scholarship categories:

- Government scholarships
- University scholarships
- Merit-based scholarships
- Need-based scholarships
- Tuition waivers
- Research scholarships
- PhD funding
- Erasmus Mundus scholarships
- Country-specific scholarships

Each scholarship record should support:

- Scholarship name
- Provider
- Country
- Degree
- Eligible subjects
- Nationality/residency requirements
- Eligibility criteria
- Financial benefits
- Tuition coverage
- Living allowance
- Application deadline
- Required documents
- Official source
- Last verification date

User actions:

- Save Scholarship
- Compare
- Add Deadline
- Associate with Application

Saved scholarships must appear in Personal Workspace.

Do not invent eligibility results, funding amounts, or award probabilities.

---

# 10. PROGRAMME COMPARISON

Enhance the existing programme comparison tool.

Compare 2–4 programmes, subject to the existing configurable limit.

Columns:

- University
- Programme
- Country
- Degree
- Duration
- Language
- Tuition
- Application fee
- Deadline
- Academic requirements
- Language requirements
- Entrance exam
- Scholarship availability
- Verification status

Actions:

- Save to Shortlist
- Remove from Comparison
- View Programme
- Open Official Portal

On mobile, use responsive comparison cards or horizontal scrolling.

---

# 11. ADMISSION PREPARATION GUIDE

Provide a step-by-step admissions guide.

Stages:

1. Choose Destination
2. Find Programmes
3. Review Eligibility
4. Compare Options
5. Prepare Documents
6. Find Scholarships
7. Submit Application
8. Track Decision

Connect relevant actions to the existing Personal Workspace.

Provide document preparation checklists.

Do not claim that Campus to Country directly submits applications to external universities unless a verified integration exists.

---

# PART B — VISA APPLICATION

# 12. VISA OVERVIEW

Preserve `/visa` and existing country-specific guides.

Hero:

**Prepare your visa application with confidence.**

Main actions:

- Choose Destination
- View Requirements
- Prepare Documents
- Open My Visa Journey

Below the hero:

- Available country guidance
- Official immigration resources
- Preparation steps
- Visa document checklist
- FAQs

Keep the page clear and beginner-friendly.

---

# 13. VISA COUNTRY DETAIL STRUCTURE

Every country should have separate visa guidance.

Organize into:

1. Visa Overview
2. Eligibility and Requirements
3. Financial Evidence
4. Document Preparation
5. Application Process
6. Appointment Process
7. Submission and Tracking
8. After Decision
9. Official Resources

Support differences in:

- Nationality
- Country of residence
- Visa category
- Residence-permit category
- Study level
- Financial requirements
- Embassy jurisdiction

Do not apply one country's requirements to another country.

All official requirements need appropriate sources and review dates.

---

# 14. STEP-BY-STEP VISA JOURNEY

Provide a clear visual timeline.

Suggested stages:

1. Receive University Admission
2. Confirm Visa Requirements
3. Prepare Documents
4. Complete Application Form
5. Book Appointment
6. Attend Appointment
7. Submit Required Materials
8. Track Application
9. Record Decision
10. Prepare for Departure

The exact sequence must adapt to country-specific official procedures.

Statuses:

- Not Started
- In Progress
- Ready
- Submitted
- Completed
- Not Applicable

Connect the user's visa timeline to the existing `/applicant/visa-journey`.

Do not create another disconnected visa tracker.

Do not automatically mark a visa approved.

---

# 15. VISA DOCUMENT CHECKLIST

Build dynamic checklists according to country and application circumstances.

Document categories:

- Identity
- Academic
- Admission
- Financial
- Scholarship
- Sponsorship
- Insurance
- Legalization
- Translation
- Application Forms
- Appointment
- Other Requirements

Each checklist item should support:

- Requirement title
- Status
- User notes
- Deadline
- Associated document
- Relevant official source
- Last updated date

Users should be able to link existing private documents without uploading duplicate copies.

Allow country-specific administrator templates.

---

# 16. EMBASSY AND OFFICIAL LINKS

Preserve the existing visa source registry.

Support:

- Immigration authority
- Embassy
- Consulate
- Visa application center
- Official appointment portal
- Application portal
- Official tracking portal
- Contact and jurisdiction details

For each record store:

- URL
- Country
- Authority
- Verification status
- Last checked date
- Admin notes

Broken or unverified links should be identified appropriately.

Do not recommend unofficial appointment intermediaries as official services.

---

# 17. VISA FAQ AND GUIDANCE

Preserve bilingual country guides.

Organize FAQs into:

- Eligibility
- Documents
- Financial Evidence
- Sponsorship
- Scholarship Evidence
- Appointment
- Interview
- Fees
- Processing
- Refusal
- Reapplication
- Travel Preparation

Maintain clear distinctions between official rules and general preparation advice.

Do not provide guaranteed visa approval predictions.

---

# PART C — CENTRAL PERSONAL WORKSPACE

# 18. PERSONAL WORKSPACE — CORE OBJECTIVE

The Personal Workspace must serve as the **central student management hub**.

A registered user should manage their study-abroad journey with one account and one Account ID.

Connected modules:

1. Universities
2. Visa Application
3. IELTS / Premium Academy
4. Bank Statements / VisaFund
5. Mentorship & Counseling

The Workspace itself manages:

- Profile
- Saved programmes
- Applications
- Scholarships
- Documents
- Tasks
- Calendar
- Notifications
- Personal settings

Do not create independent user registries for each module.

Preserve all existing module data and permission boundaries.

---

# 19. RECOMMENDED WORKSPACE NAVIGATION

Organize the Workspace sidebar into clear groups.

### Home

- Dashboard

### My Journey

- Profile
- Saved Programmes
- Applications
- Scholarships
- Visa Journey

### My Preparation

- IELTS Progress
- Financial Preparation
- Mentorship & Sessions

### My Organization

- Documents
- Calendar & Tasks
- Notifications

### My Account

- Account Settings
- Security
- Export & Backup

Keep the navigation manageable.

Use collapsible groups where appropriate.

Do not duplicate entire IELTS, VisaFund, or Mentorship interfaces in the Workspace.

Financial Preparation should link to the existing `/visafund` module.

Mentorship & Sessions should connect to existing `/counseling` records and pages.

---

# 20. PERSONAL DASHBOARD DESIGN

Hero:

**Your Journey, One Workspace.**

Subtitle:

Everything you need to manage your university applications, preparation, and next steps.

### Main Summary Cards

Show four primary cards:

1. Saved Programmes
2. Active Applications
3. Upcoming Deadlines
4. Pending Tasks

Below these, display a compact section called:

**My Connected Services**

Cards:

- IELTS Progress
- Bank Statements
- Mentorship & Counseling
- Visa Preparation

Each card must show relevant genuine information or an empty state.

Do not fabricate activity or completion statistics.

### Upcoming Activities

Show the next saved deadlines, sessions, and calendar events.

### Continue Where You Left Off

Display an appropriate next action based on actual saved records.

### Quick Actions

- Find University
- Add Application
- Upload Document
- Open Calendar
- Continue IELTS
- Open VisaFund
- View Mentorship Sessions

Avoid large numbers of decorative charts.

---

# 21. PERSONAL PROFILE MANAGEMENT

Preserve each user's unique Account ID.

Do not allow users to edit their underlying Account ID.

Allow editing of appropriate personal information.

### Personal Details

- Full name
- Contact email
- Nationality
- Country of residence
- Timezone
- Preferred language

### Academic Details

- Qualification
- University or institution
- Academic field
- Grade/CGPA
- Grading scale
- Graduation date
- Academic history

### Language Qualifications

- IELTS or other test type
- Overall score
- Individual component scores
- Test date
- Expiry date, where applicable

### Study Preferences

- Preferred countries
- Target degree
- Academic subject
- Preferred teaching language
- Intended intake
- Budget preference

### Optional Academic Portfolio

- Research interests
- Publications
- Academic projects
- Professional experience
- Skills

Users must enter their own information.

Do not automatically populate the profile with the owner's personal details.

---

# 22. SAVED PROGRAMMES AND APPLICATION TRACKER

Preserve all existing shortlist and application records.

### Shortlist Features

Allow users to:

- Save Programmes
- Compare Programmes
- Edit Notes
- Set Personal Priority
- Archive Programmes
- Create Application Drafts

When converting a shortlist into an application, prefill known details and request user confirmation.

### Application Stages

Support:

- Researching
- Preparing
- Ready to Submit
- Submitted
- Under Review
- Additional Documents Requested
- Interview Scheduled
- Offered Admission
- Waitlisted
- Rejected
- Withdrawn

Maintain backward compatibility with existing status values.

### Application Details

- University
- Programme
- Country
- Intake
- Deadline
- Official portal
- Application fee
- Submission date
- Application reference
- Scholarship link
- Associated documents
- Current stage
- Notes

Offer list and Kanban views.

Default to the simpler list view on mobile.

---

# 23. SCHOLARSHIP WORKSPACE

Connect saved scholarship records to the user account.

Allow:

- Save
- Edit Notes
- Link to University
- Link to Application
- Add Deadline
- Attach Documents
- Update Personal Status

Statuses:

- Saved
- Preparing
- Submitted
- Under Review
- Awarded
- Unsuccessful
- Withdrawn

Scholarship records must remain separate from university application statuses.

---

# PART D — IELTS CONNECTION

# 24. IELTS AND PREMIUM ACADEMY INTEGRATION

The existing IELTS module must remain fully functional.

Preserve:

- Reading
- Listening
- Writing
- Speaking
- Vocabulary
- Grammar
- Pronunciation
- Typing Academy
- Premium Academy
- Practice Questions
- Mock Tests
- Study Routine
- Progress History
- Saved Notes
- Existing Recordings

The Personal Workspace already has an IELTS progress integration.

Enhance that connection without creating a new IELTS tracking database.

### Workspace IELTS Summary

Display:

- Recent study activity
- Recorded study time
- Current learning progress
- Recent mock results
- Skill-wise practice history
- Weaknesses from genuinely assessed activities
- Upcoming IELTS tasks

### Quick Actions

- Continue Learning
- Open Premium Academy
- Start Practice
- View Mock History
- Open Study Calendar

Use existing saved IELTS records.

Do not treat self-reported scores as examiner-certified scores.

Do not duplicate the existing IELTS calendar.

Use the shared calendar.

---

# PART E — BANK STATEMENTS / VISAFUND CONNECTION

# 25. VISA FUND INTEGRATION

**CRITICAL: VisaFund already exists as a separate, substantial financial management module.**

Do not rebuild it.

Do not create a second banking dashboard inside Personal Workspace.

Preserve its existing:

- Financial dashboard
- Bank accounts
- Transactions
- Transaction calendar
- Financial insights
- Country requirements
- Destination planning
- Financial readiness
- Country comparison
- Sponsors and sources
- Document vault
- Savings goals
- Currency conversion
- Fund history
- Financial reports

Reuse the existing account identity and financial APIs.

### Financial Preparation Card

Inside Personal Workspace, add a compact card named:

**Financial Preparation**

Include appropriate actions:

- Open VisaFund
- View Savings Goals
- Review Financial Readiness
- Manage Sponsors
- Review Financial Documents

Show a private financial summary only when:

1. The user is authenticated.
2. The required data is available.
3. The relevant privacy settings permit the summary.
4. The figures come from genuine saved records.

If these conditions are not met, show a simple link to VisaFund.

Do not duplicate stored bank transactions.

### Visa Connection

Financial readiness and visa preparation should be connected through explicit user-controlled references.

For example:

Visa Financial Checklist → Open VisaFund → Review Available Documents → Link a Selected Document to the Visa Checklist.

Do not automatically expose balances, bank information, sponsor details, account identifiers, or transaction history to mentors, counselors, universities, or other users.

Only transfer or link financial evidence with explicit authorized user action.

Do not claim VisaFund records constitute official bank-issued statements.

---

# PART F — MENTORSHIP & COUNSELING CONNECTION

# 26. EXISTING MENTORSHIP PRESERVATION

Preserve:

- Mentorship programmes
- Published courses
- Mentor profiles
- Session availability
- Booking requests
- Enrollment requests
- Administrator approvals
- Course materials
- Learning rooms
- Existing session records
- Existing comments and discussions
- Existing payment configuration and restrictions

The existing mentorship system already contains booking and enrollment functionality.

Reuse its current API and data rather than creating duplicate booking records.

---

# 27. MENTORSHIP WORKSPACE

Create a Workspace section:

**My Mentorship & Sessions**

Show:

### My Sessions

- Session title
- Mentor, when assigned
- Date
- Timezone
- Session type
- Booking status
- Join link, when genuinely available
- Relevant preparation notes

### My Enrollments

- Course title
- Request status
- Enrollment status
- Authorized learning-room link
- Available published materials

### My Mentorship Activity

- Upcoming approved sessions
- Pending booking requests
- Enrollment requests
- Relevant course updates

### Quick Actions

- Browse Mentorship
- Request Session
- View My Bookings
- Open My Courses

Only show real confirmed mentors and published sessions.

Never generate fake mentor profiles or appointment times.

---

# 28. MENTORSHIP AND CALENDAR CONNECTION

Connect mentorship bookings with the existing Personal Workspace calendar.

The current implementation can create a planned calendar activity when a booking request is submitted.

Improve this workflow.

### Booking States

Distinguish:

- Requested
- Pending Approval
- Confirmed
- Rescheduled
- Completed
- Canceled
- Declined

Map to actual backend statuses.

### Calendar Behavior

When a user requests a session:

- Show the actual booking status.
- Allow a provisional calendar event.
- Do not mark the event as confirmed before approval.

When a booking is approved:

- Update the associated event if a reliable backend status is available.
- Do not create a duplicate event.

When a booking is rescheduled:

- Update the linked calendar event.
- Preserve appropriate history.

When canceled:

- Reflect the cancellation without deleting unrelated events.

Use stable booking IDs.

### Privacy

Mentors must not automatically receive access to:

- Private financial records
- Sensitive identity documents
- Full university application histories
- Private IELTS recordings
- Unshared academic information

Any sharing feature must require explicit user consent and enforce access permissions.

Paid bookings must remain subject to the existing verified payment and administrator approval policies.

---

# PART G — DOCUMENT VAULT

# 29. EXPAND THE EXISTING PRIVATE DOCUMENT SYSTEM

The currently reviewed Workspace document API is tied to an IELTS-specific scope.

Upgrade this architecture carefully.

Do not delete, relocate unsafely, or invalidate existing IELTS documents.

Introduce appropriate document scopes or categories for:

- Personal
- Academic
- University Applications
- Scholarships
- IELTS
- Financial Preparation
- Visa
- Mentorship
- Other

### User Features

- Upload Document
- View Documents
- Download
- Rename
- Categorize
- Replace Version
- Archive
- Delete with Confirmation
- Link to Application
- Link to Visa Checklist
- Link to Scholarship
- Link to Mentorship Submission where authorized

### Storage Principles

Store each file once whenever possible.

Use relationships to associate the file with different authorized records.

Do not duplicate full file bytes per application.

### Security

Require:

- Owner-based access control
- Private storage
- File validation
- Size limits
- Secure downloads
- No public URLs exposing private uploads
- Server-side authorization
- Appropriate administrative auditing

Do not merge VisaFund financial documents into a general document collection without preserving their existing ownership and security policies.

Where storage boundaries prevent secure integration, provide a contextual link to the original document service.

---

# PART H — SHARED CALENDAR AND TASKS

# 30. ONE CENTRAL CALENDAR

Preserve the existing 24-hour Personal Workspace calendar.

Do not introduce another disconnected calendar.

Connect activities from:

- University Applications
- Scholarship Deadlines
- IELTS Study
- Visa Preparation
- Visa Appointments
- Financial Preparation
- Mentorship Sessions
- Academic Activities
- Personal Tasks

### Supported Views

- Day
- Week
- Month
- Agenda

### Event Details

- Title
- Category
- Date
- Start time
- End time
- Status
- Notes
- Related record
- Timezone
- Reminder preference

### Useful Features

- Add
- Edit
- Delete
- Mark Completed
- Reschedule
- Repeat Activity
- Filter by Category
- Open Related Record

Do not automatically create duplicate tasks when a module is revisited.

Use stable references and idempotent synchronization where integration is supported.

---

# 31. NOTIFICATIONS AND REMINDERS

Create one unified notification center.

Potential notifications:

- Upcoming university deadlines
- Scholarship deadlines
- User-scheduled IELTS practice
- Visa preparation deadlines
- Appointment reminders
- Confirmed mentorship sessions
- Course enrollment updates
- Authorized administrative messages

Support:

- Read/unread state
- Notification preferences
- Date and time
- Related record
- Open action
- Dismiss
- Clear read notifications

Notification delivery must use a real supported service.

Do not pretend background reminders work if there is no implemented scheduler or delivery channel.

Allow users to opt out of optional notifications.

Avoid exposing financial or sensitive personal details in email or push notification previews.

---

# PART I — CROSS-MODULE USER JOURNEY

# 32. COMPLETE CONNECTED WORKFLOW

The ecosystem should support the following practical journeys.

### Journey 1 — University Discovery

Universities → Find Programme → View Details → Save to Shortlist → Personal Workspace.

### Journey 2 — Application Preparation

Personal Workspace → Saved Programme → Create Application → Prepare Documents → Add Deadline → Track Decision.

### Journey 3 — Scholarship Preparation

Scholarships → Save Scholarship → Link Programme → Add Deadline → Track Application.

### Journey 4 — IELTS Preparation

IELTS → Practice → Save Results → Personal Workspace IELTS Summary → Continue Learning.

### Journey 5 — Financial Preparation

Personal Workspace → Financial Preparation → VisaFund → Manage Funds → Review Financial Documents → Return to Visa Checklist.

### Journey 6 — Visa Preparation

University Decision → User Starts Visa Journey → Select Country → Review Requirements → Prepare Documents → Track Tasks.

### Journey 7 — Mentorship

Mentorship → Request Session → Booking Status → Personal Workspace Sessions → Central Calendar.

### Journey 8 — Daily Planning

Personal Workspace → Calendar → Select Activity → Open Relevant Module → Complete Task → Save Progress.

All journeys must maintain consistent user identity.

Where a workflow spans independent storage services, use validated APIs and authorized references.

Do not assume cross-module synchronization exists merely because both modules are linked in navigation.

---

# PART J — UX/UI DESIGN

# 33. SIMPLIFIED DESIGN SYSTEM

Use the current Campus to Country design language.

Do not replace the logo.

Avoid unnecessarily complex dashboards.

### Desktop Layout

- Clear top navigation
- Compact module sidebar where needed
- Main content area
- Search and filters
- Consistent cards
- Visible primary actions

### Mobile Layout

- Collapsible menu
- One-column cards
- Readable text
- Clear action buttons
- Compact filters
- Short forms
- Mobile-friendly tables
- Accessible input controls

### Design Rules

- Avoid excessive animations.
- Avoid fake statistics.
- Avoid irrelevant visual decorations.
- Avoid too many nested navigation levels.
- Use consistent spacing.
- Maintain proper contrast.
- Support keyboard navigation.
- Preserve existing language support.
- Provide useful empty states.

---

# 34. DASHBOARD INFORMATION PRIORITY

The dashboard should answer three questions immediately:

1. What should I do next?
2. What deadlines are approaching?
3. Where can I continue my preparation?

Prioritize these above charts and promotional content.

Recommended order:

1. Welcome and Quick Actions
2. Upcoming Deadlines
3. Current Applications
4. Connected Services
5. Recent Activity

Do not overload the first screen.

Use concise cards and progressive disclosure.

---

# PART K — ADMINISTRATION

# 35. SUPER ADMIN MANAGEMENT

Preserve the current Super Admin identity, MFA policies, and permissions.

Extend administration for all required functionality.

### Universities Admin

- Countries
- Institutions
- Programmes
- Scholarships
- Admission Guides
- Deadlines
- Official Sources

### Visa Admin

- Country Guides
- Visa Requirements
- Embassy Links
- Document Checklist Templates
- FAQs
- Source Verification

### Personal Workspace Admin

- Account Support
- Profile Support
- Application Record Support
- Document Administration
- Calendar Configuration
- Notification Configuration

### IELTS Admin

Preserve existing IELTS and Premium Academy administration.

### VisaFund Admin

Preserve existing financial administration without weakening privacy or access restrictions.

### Mentorship Admin

Preserve:

- Mentor management
- Courses
- Enrollment approval
- Session management
- Booking decisions
- Published materials
- Access management

### Super Admin Actions

Authorized administrators must be able to:

- Create
- Edit
- Update
- Enable
- Disable
- Publish
- Unpublish
- Reorder
- Archive
- Restore
- Delete
- Approve
- Reject
- Configure

Protect destructive operations through confirmation, authorization, and audit logs.

Full administrative functionality does not mean bypassing privacy protections or removing auditing.

---

# PART L — DATA ARCHITECTURE

# 36. DATABASE AND EXISTING RECORDS

Reuse the current platform storage architecture.

Preserve:

- User Account IDs
- User profiles
- Existing record identifiers
- Shortlists
- Applications
- Calendar events
- IELTS records
- Bank transactions
- Sponsors
- Financial records
- Mentorship bookings
- Enrollments
- Document references
- Administrative configuration

Introduce only necessary additive schemas.

Support stable relationships between:

- User and shortlist
- User and application
- Application and programme
- Application and scholarship
- Application and documents
- Application and deadlines
- Visa journey and country
- Visa checklist and documents
- IELTS progress and user
- Financial records and user
- Mentorship booking and user
- Mentorship session and calendar event

Avoid duplicating the original records in the Workspace.

Use read-only summaries or secure cross-module APIs where practical.

---

# 37. SECURITY AND PRIVACY

Implement:

- Authentication
- Role-based access control
- Owner-based authorization
- Input validation
- Secure file handling
- Safe external links
- Appropriate rate limits
- Audit logging
- Sensitive-data minimization
- Secure administrative actions
- Permission-aware cross-module data access

Financial data must never become publicly visible because it appears in the Personal Workspace.

Mentors may access only information authorized for their assigned service.

Other applicants must never be able to read another user's records.

Do not introduce public document URLs or insecure data-sharing endpoints.

Preserve current session security and account-management behavior.

---

# PART M — IMPLEMENTATION ROADMAP

# 38. IMPLEMENT IN SEQUENTIAL PHASES

### Phase 1 — GitHub Audit

Inspect current components, routes, data models, existing connections, and tests.

Record functional gaps and dependencies.

### Phase 2 — Navigation and UX

Simplify Universities, Visa Application, and Personal Workspace navigation.

Preserve old routes and data.

### Phase 3 — Universities

Improve search, filters, programme details, scholarships, comparison, and admission guidance.

### Phase 4 — Visa Application

Improve country-based requirements, document checklists, guidance, source records, and visa preparation timelines.

### Phase 5 — Personal Workspace

Improve the dashboard, shortlists, applications, scholarships, profile, and private documents.

### Phase 6 — IELTS Connection

Reuse current IELTS progress and study data.

Show concise progress summaries and quick navigation.

### Phase 7 — VisaFund Connection

Connect existing financial readiness features without duplicating sensitive banking records.

### Phase 8 — Mentorship Connection

Connect real booking, enrollment, course, and session records to Personal Workspace.

### Phase 9 — Shared Calendar and Notifications

Integrate user-approved deadlines, learning tasks, and mentorship events.

### Phase 10 — Super Admin

Extend existing administration without creating a second system.

### Phase 11 — Testing and Verification

Run automated tests, regression checks, security tests, and supported browser tests.

---

# 39. REQUIRED TEST SCENARIOS

### Universities

- Search works.
- Filters work.
- Programme details load.
- Compare works.
- Shortlist saves.
- Scholarship records link correctly.

### Visa

- Country selection works.
- Guides load.
- Official links are accessible.
- Checklist changes persist.
- Visa journey displays correct saved status.

### Workspace

- Account ID remains unchanged.
- Profile saves.
- Applications save.
- Shortlists remain intact.
- Calendar events persist.
- Private documents enforce ownership.
- Cross-module links work.

### IELTS

- Existing IELTS progress remains accessible.
- Practice records are preserved.
- Premium Academy remains functional.
- Shared calendar connection works.

### VisaFund

- Existing financial records remain unchanged.
- Existing financial dashboard works.
- Workspace navigation opens the correct user account.
- No financial information leaks into public or unauthorized interfaces.

### Mentorship

- Existing bookings remain accessible.
- Enrollment history is preserved.
- Booking status is accurate.
- Approved sessions appear correctly.
- Pending requests are not shown as confirmed.
- Linked calendar events do not duplicate.

### Regression

- Existing website branding remains unchanged.
- Existing authentication works.
- Existing non-target modules still work.
- Existing admin permissions remain intact.
- No existing user data is deleted.

---

# 40. FINAL OUTPUT REQUIREMENTS

After implementation, provide an accurate report with:

1. GitHub audit findings
2. Features preserved
3. Features enhanced
4. New functionality implemented
5. Cross-module integrations
6. Database changes
7. Security improvements
8. UX improvements
9. Tests completed
10. Tests pending
11. Remaining limitations
12. Modified files and Git commit references, if applicable

Do not report incomplete functionality as finished.

Do not claim third-party portals, bank systems, visa platforms, university admissions systems, or notification services are integrated unless working integrations have been tested.

Do not activate live payments or deploy to production without explicit approval.

---

# 41. FINAL EXECUTION COMMAND

**Upgrade Campus to Country into a fully connected, intuitive study-abroad ecosystem while preserving the existing project.**

The primary functionality upgrade must focus on:

- Universities
- Visa Application
- Personal Workspace

The Personal Workspace must additionally integrate and preserve:

- IELTS and Premium Academy
- Bank Statements / VisaFund
- Mentorship & Counseling

Use **one existing account identity**, one connected user journey, and appropriate shared or securely linked records.

Keep each specialized module independent in functionality while making its relevant personal data accessible through the central Workspace.

Never create duplicate financial systems, duplicate calendars, duplicate account registries, or duplicate application records.

Maintain the exact existing Campus to Country branding and approved logo.

Preserve existing content, data, administrative capabilities, and working modules.

Use real records, verified information, functional interactions, and secure access.

**NO REBUILD. NO DATA RESET. NO FAKE CONTENT. NO DUPLICATE MODULES. NO UNAUTHORIZED DATA SHARING.**

**AUDIT FIRST → REUSE EXISTING CODE → IMPLEMENT INCREMENTALLY → TEST → REPORT ACCURATELY.**
