import {
  AccommodationRecord,
  FlightRecord,
  VisaCheckItem,
  SponsorBankRecord,
  EmbassyVisaRecord,
  ReusableTemplate,
  CustomConfig,
  AppearanceSettings,
  DashboardSettings,
  CustomModuleDefinition,
  CustomModuleRecord,
  NavigationSettings,
} from '../types';

export const initialAccommodations: AccommodationRecord[] = [
  {
    id: 'acc-1',
    type: 'University Dormitory',
    propertyName: 'EDISU Piemonte - Residenza Borsellino',
    city: 'Turin',
    address: 'Via Michelangelo 32, 10126 Torino TO',
    monthlyRentEur: 280,
    depositEur: 350,
    utilitiesIncluded: true,
    status: 'Application Submitted',
    contractType: 'EDISU / ER.GO Dorm',
    contactPerson: 'EDISU Ufficio Alloggi',
    contactEmailOrPhone: 'alloggi@edisu.piemonte.it',
    bookingLink: 'https://www.edisu.piemonte.it/it/servizi/abitare',
    notes: 'Requested single room under Regional DSU Scholarship with zero tariff tier for ISEE < €13,000.',
  },
  {
    id: 'acc-2',
    type: 'Private Room',
    propertyName: 'Spacest / HousingAnywhere Verified Flat (Cenisia)',
    city: 'Turin',
    address: 'Corso Ferrucci 45, 10138 Torino TO (10 min walk to PoliTO)',
    monthlyRentEur: 420,
    depositEur: 840,
    utilitiesIncluded: false,
    status: 'Inquired',
    contractType: 'Contratto Transitorio',
    contactPerson: 'Marco Rossi (Landlord)',
    contactEmailOrPhone: 'marco.torino.rent@gmail.com',
    bookingLink: 'https://housinganywhere.com',
    notes: 'Registered with Agenzia delle Entrate (Cedolare Secca) which is mandatory for Permesso di Soggiorno registration.',
  },
  {
    id: 'acc-3',
    type: 'University Dormitory',
    propertyName: 'ER.GO Residenza San Vitale (UNIBO)',
    city: 'Bologna',
    address: 'Via San Vitale 88, 40125 Bologna BO',
    monthlyRentEur: 250,
    depositEur: 300,
    utilitiesIncluded: true,
    status: 'Waitlisted',
    contractType: 'EDISU / ER.GO Dorm',
    contactPerson: 'ER.GO Student Accommodation Desk',
    bookingLink: 'https://www.er-go.it',
    notes: 'Secondary backup dormitory if admitted to MSc Artificial Intelligence at UNIBO.',
  },
];

export const initialFlights: FlightRecord[] = [
  {
    id: 'flt-1',
    airline: 'Qatar Airways',
    flightNumber: 'QR 639 / QR 127',
    departureAirport: 'DAC - Hazrat Shahjalal International Airport, Dhaka',
    arrivalAirport: 'MXP - Milan Malpensa Airport (Terminal 1)',
    transitAirport: 'DOH - Hamad International Airport, Doha (2h 15m layover)',
    departureDate: '2027-09-15T20:10:00',
    arrivalDate: '2027-09-16T07:35:00',
    bookingReferencePnr: 'QTR-ITALY-279X',
    ticketCostEur: 560,
    ticketCostBdt: 73920,
    baggageAllowanceKg: 45,
    cabinBaggageKg: 7,
    status: 'Tentative',
    notes: 'Qatar Student Club registered: extra 10kg baggage allowance + 1 free date change included.',
  },
  {
    id: 'flt-2',
    airline: 'Turkish Airlines',
    flightNumber: 'TK 713 / TK 1873',
    departureAirport: 'DAC - Dhaka',
    arrivalAirport: 'TRN - Turin Caselle Airport',
    transitAirport: 'IST - Istanbul Airport (3h layover)',
    departureDate: '2027-09-18T06:50:00',
    arrivalDate: '2027-09-18T18:15:00',
    ticketCostEur: 590,
    ticketCostBdt: 77880,
    baggageAllowanceKg: 40,
    cabinBaggageKg: 8,
    status: 'Searching',
    notes: 'Alternative route landing directly in Turin without taking train from Milan.',
  },
];

export const initialVisaCheckItems: VisaCheckItem[] = [
  {
    id: 'v1',
    category: 'Forms & Identification',
    title: '1. Visa Application D Form',
    description: 'Duly filled National Type D Visa Application Form in English or Italian, signed matching passport signature page.',
    isMandatory: true,
    status: 'In Progress',
    notes: 'Download official Type D form from VFS Global / Embassy portal. Complete in block capital letters.',
  },
  {
    id: 'v2',
    category: 'Forms & Identification',
    title: '2. Original Passport and Passport Photocopies',
    description: 'Original passport valid for at least 3 months beyond visa duration (min. 2 blank pages), plus 2 complete sets of color/clear photocopies of data pages & prior visas.',
    isMandatory: true,
    status: 'Ready',
    notes: 'Ensure passport data matches Universitaly pre-enrolment and civil registry documents verbatim.',
  },
  {
    id: 'v3',
    category: 'Forms & Identification',
    title: '3. Two Passport Size (4.0 x 3.5 cm) Photographs',
    description: 'Two recent (within 6 months) color biometric photographs, 35x40 mm (4.0 x 3.5 cm), white background, matte finish, neutral expression, no eyeglasses.',
    isMandatory: true,
    status: 'Ready',
    notes: 'Standard ICAO/Schengen photo specification for consular visa processing.',
  },
  {
    id: 'v4',
    category: 'Pre-Enrolment & Admission',
    title: '4. Admission Letter',
    description: 'Official university admission / acceptance letter issued by the Italian public university confirming selection in the degree course.',
    isMandatory: true,
    status: 'In Progress',
    notes: 'Must state course title, language of instruction, and academic intake year.',
  },
  {
    id: 'v5',
    category: 'Pre-Enrolment & Admission',
    title: '5. Pre-Enrollment Summary Form (Universitaly Riepilogo)',
    description: 'Validated Universitaly Pre-enrolment Summary (Riepilogo) form with university confirmation stamp and official Ministry (MUR) QR code.',
    isMandatory: true,
    status: 'In Progress',
    notes: 'Downloaded from Universitaly.it after target university validates the application.',
  },
  {
    id: 'v6',
    category: 'Academic Credentials & Apostille',
    title: '6. Educational Certificates & Transcripts Attested with Apostille',
    description: 'All educational certificates and marksheets (SSC, HSC, Bachelor\'s BSc/BA/BBA or others) attested by Education Board, Ministry of Education, and MOFA with official Apostille.',
    isMandatory: true,
    status: 'Ready',
    notes: 'Original documents plus official English/Italian translations authenticated by MOFA with Apostille.',
  },
  {
    id: 'v7',
    category: 'Financial Solvency (12 Months)',
    title: '7. Statement of Sponsor (12 Months)',
    description: 'Original bank account statement of the financial sponsor covering the last 12 continuous months, stamped and signed on every page by authorized bank officials.',
    isMandatory: true,
    status: 'In Progress',
    notes: 'Showing regular financial transactions, credible turnover, and closing balance without sudden unexplained bulk deposits.',
  },
  {
    id: 'v8',
    category: 'Financial Solvency (12 Months)',
    title: '8. Bank Solvency Certificate of Sponsor',
    description: 'Original bank solvency certificate of the financial sponsor on official bank letterhead, indicating total account balance with EUR equivalent.',
    isMandatory: true,
    status: 'In Progress',
    notes: 'Issued recently within 7–15 days of the VFS appointment date.',
  },
  {
    id: 'v9',
    category: 'Financial Solvency (12 Months)',
    title: '9. Bank Statement of Applicant (12 Months)',
    description: 'Original personal bank account statement of the applicant covering the last 12 continuous months with genuine transaction history, stamped and signed by the bank.',
    isMandatory: true,
    status: 'In Progress',
    notes: 'Official embassy requirement: personal 12-month statement demonstrating applicant\'s own financial profile.',
  },
  {
    id: 'v10',
    category: 'Financial Solvency (12 Months)',
    title: '10. Bank Solvency Certificate of Applicant',
    description: 'Original bank solvency certificate in the name of the applicant issued by an authorized scheduled bank.',
    isMandatory: true,
    status: 'In Progress',
    notes: 'Matches applicant bank account details with verified closing balance.',
  },
  {
    id: 'v11',
    category: 'Sponsor Documentation',
    title: '11. Sponsorship Affidavit',
    description: 'Notarized affidavit of financial support on non-judicial stamp paper from sponsor (father/mother) affirming full maintenance, tuition, and return guarantees.',
    isMandatory: true,
    status: 'Ready',
    notes: 'Executed before a First Class Magistrate or Notary Public with official seal.',
  },
  {
    id: 'v12',
    category: 'Accommodation & Travel',
    title: '12. Accommodation Hotel Booking / Housing Proof',
    description: 'Proof of confirmed accommodation for at least 30 days upon arrival in Italy (university dormitory allotment letter, hotel/Airbnb booking voucher, or registered rental contract).',
    isMandatory: true,
    status: 'In Progress',
    notes: 'Must cover initial arrival period in the target university city.',
  },
  {
    id: 'v13',
    category: 'Health & Insurance',
    title: '13. Insurance for 12 Months from Welcome Association Italy',
    description: 'Comprehensive 12-month medical insurance package (specifically accepted by Italian Consular authority, e.g. Welcome Association Italy 12-month plan or Schengen health insurance minimum €30,000 coverage).',
    isMandatory: true,
    status: 'In Progress',
    notes: 'Must cover emergency medical expenses, hospitalisation, and repatriation for the full academic year.',
  },
  {
    id: 'v14',
    category: 'Civil Status & Family Relationship',
    title: '14. Sponsor Father NID Photocopy with Apostille',
    description: 'Clear photocopy of father\'s / sponsor\'s National Identity Card (NID), officially translated into Italian if required, and legalized by MOFA with Apostille.',
    isMandatory: true,
    status: 'Ready',
    notes: 'Corroborates parent identity matching student birth certificate.',
  },
  {
    id: 'v15',
    category: 'Civil Status & Family Relationship',
    title: '15. Birth Certificate Copy with Apostille',
    description: 'Digital online-verifiable Birth Registration Certificate (English version) issued by local civil registrar, legalized with MOFA Apostille.',
    isMandatory: true,
    status: 'Ready',
    notes: 'Establishes applicant identity and legal parentage.',
  },
  {
    id: 'v16',
    category: 'Civil Status & Family Relationship',
    title: '16. Family Certificate with Apostille',
    description: 'Official Family Certificate / Family Relationship Certificate establishing legal parent-child lineage to the financial sponsor, authenticated by MOFA with Apostille.',
    isMandatory: true,
    status: 'Ready',
    notes: 'Mandatory proof of family kinship required by Italian consular officers.',
  },
  {
    id: 'v17',
    category: 'Academic Qualification Recognition',
    title: '17. Statement of Comparability & Verification by CIMEA',
    description: 'Official digital Statement of Comparability and Statement of Verification issued by CIMEA via DiploME cryptographic platform, or Declaration of Value (DOV).',
    isMandatory: true,
    status: 'In Progress',
    notes: 'Downloaded as cryptographic PDF from cimea.diplo-me.eu or issued by embassy.',
  },
  {
    id: 'v18',
    category: 'Academic Qualification Recognition',
    title: '18. CIMEA Payment Slip (300 Euros)',
    description: 'Official payment receipt / invoice slip confirming €300 CIMEA service fee payment for comparability & verification dossiers.',
    isMandatory: true,
    status: 'In Progress',
    notes: 'Bank transaction slip or credit card receipt confirming €300 fee payment.',
  },
  {
    id: 'v19',
    category: 'Accommodation & Travel',
    title: '19. One-Way Booked Airline Ticket Reservation',
    description: 'Confirmed one-way flight reservation/dummy ticket itinerary from origin city to destination Italian airport (Rome/Milan/Venice/Bologna) matching university academic calendar.',
    isMandatory: true,
    status: 'Ready',
    notes: 'Ticket reservation showing matching passenger name and realistic arrival date.',
  },
  {
    id: 'v20',
    category: 'Language Proficiency',
    title: '20. IELTS and MOI Certificate',
    description: 'Original IELTS Academic Test Report Form (TRF) and/or official university-issued Medium of Instruction (MOI) letter certifying degree was taught 100% in English.',
    isMandatory: true,
    status: 'Ready',
    notes: 'Demonstrates linguistic qualification meeting Italian university admission decree.',
  },
  {
    id: 'v21',
    category: 'Sponsor Documentation',
    title: '21. Sponsor Source of Income Documents (Trade License, TIN, Tax Certificate)',
    description: 'Supporting economic proof of sponsor\'s legitimate earnings: valid Trade License (translated & notarized), TIN certificate, last 3 years income tax return acknowledgment slips (NBR IT-10B), company bank statements or salary certificates.',
    isMandatory: true,
    status: 'Ready',
    notes: 'Must conclusively prove legal source of accumulated funds.',
  },
  {
    id: 'v22',
    category: 'Professional & Extracurricular',
    title: '22. Job Certificate of Applicant (If Applicable)',
    description: 'Employment experience certificate, appointment letter, or payslips demonstrating relevant professional work experience in the field of study.',
    isMandatory: false,
    status: 'In Progress',
    notes: 'Optional/conditional: Strengthens applicant profile and explains study gap if applicable.',
  },
  {
    id: 'v23',
    category: 'Professional & Extracurricular',
    title: '23. Extracurricular Certificates & Publications (If Applicable)',
    description: 'Certificates of extracurricular activities, programming awards, academic research publications, conference presentations, or IEEE papers.',
    isMandatory: false,
    status: 'In Progress',
    notes: 'Optional/conditional: Provides proof of academic distinction and research potential.',
  },
];

export const initialSponsorRecords: SponsorBankRecord[] = [
  {
    id: 'sp-1',
    sponsorName: 'Primary Financial Sponsor (Parent / Legal Guardian)',
    relationship: 'Father / Mother (Primary Financial Guarantor)',
    bankName: 'Scheduled Commercial Bank',
    accountNumberMasked: '115.101.XXXXXXX',
    accountType: 'Savings Account',
    balanceBdt: 0,
    balanceEur: 0,
    statementPeriod: 'Last 12 Months (Continuous verified payroll / business cash flow)',
    solvencyCertificateIssued: false,
    tinOrTaxReturnAttached: false,
    affidavitNotarized: false,
    sourceOfFundsDescription: 'Documented income verifiable via official tax assessment return slips & trade credentials.',
    status: 'Draft',
  },
];

export const initialEmbassyRecord: EmbassyVisaRecord = {
  id: 'emb-record-1',
  consularOffice: 'Embassy of Italy in Dhaka (Consular Section) via VFS Global Bangladesh',
  visaCategory: 'National Type D Long Stay Visa (Studio / Immatricolazione Università)',
  vfsReferenceNumber: 'VFS-ITA-DAC-SAMPLE-REF',
  appointmentDate: '2027-07-20',
  appointmentTime: '09:30 AM',
  appointmentStatus: 'Monitoring Slots',
  submissionTargetMonth: 'July - August 2027',
  visaFeeBdt: 6600,
  vfsFeeBdt: 4400,
  interviewNotes: 'Be prepared to explain why MSc Data Science at PoliTO/UNIBO was chosen, English proficiency without Italian, and post-study intention.',
  policeClearanceAttached: true,
  travelInsuranceAttached: false,
  dummyTicketAttached: true,
  statusNotes: 'Monitoring VFS booking portal weekly. Document dossier is 75% complete.',
  updatedAt: new Date().toISOString(),
};

export const initialTemplates: ReusableTemplate[] = [
  {
    id: 'tmpl-1',
    title: 'Sponsor Financial Support & Affidavit Template',
    category: 'Sponsor Affidavit',
    description: 'Formatted for ৳300 non-judicial stamp in Bangladesh, certified by First Class Magistrate / Notary Public.',
    content: `BEFORE THE NOTARY PUBLIC / FIRST CLASS MAGISTRATE, DHAKA, BANGLADESH

AFFIDAVIT OF FINANCIAL SUPPORT & SPONSORSHIP

I, [Sponsor Full Name], Son/Daughter of [Grandparent Name], National ID No: [NID Number], residing at [Permanent Address, Dhaka, Bangladesh], do hereby solemnly affirm and declare on oath as follows:

1. That I am a bona fide citizen of Bangladesh by birth and have sufficient legitimate sources of income as [Profession / Designation / Business Name].
2. That my son/daughter, [STUDENT FULL NAME], holder of Bangladeshi Passport No: [PASSPORT NUMBER], has applied / received admission to pursue a Master of Science (MSc) in Italy for the academic year 2027/2028.
3. That I undertake full financial responsibility to bear all necessary expenses including university tuition fees, accommodation, living expenses, food, health insurance, and return airfare during the entire study tenure in Italy.
4. That I maintain sufficient liquid funds in my bank accounts maintained with [Bank Name, Branch Name], as evidenced by the attached Bank Solvency Certificate and 6-Month Bank Statements.
5. That my sponsored student will not become a financial burden or recourse to the public welfare funds of the Government of the Republic of Italy.

DEPONENT
Identified by me, Advocate Supreme Court of Bangladesh`,
    tags: ['Sponsor', 'Affidavit', 'Embassy Dhaka', 'Solvency'],
    updatedAt: new Date().toISOString().split('T')[0],
  },
  {
    id: 'tmpl-2',
    title: 'Formal Curricular Pre-Evaluation Email to Italian MSc Coordinator',
    category: 'Email to Professor',
    description: 'Polite inquiry asking whether non-EU bachelor credits fulfill the minimum CFU requirements.',
    content: `Subject: Curricular Requirement & ECTS Eligibility Inquiry: MSc in [Programme Title] - Fall 2027 (Applicant: [Candidate Full Name])

Dear Prof. [Coordinator Surname] / Admission Committee,

I hope this email finds you well.

My name is [Candidate Full Name], and I am currently in the final year of my Bachelor of Science in [Undergraduate Major / Degree Title] at [Undergraduate University Name, Country]. I am preparing my application for the English-taught Master of Science in [Programme Title] at [University Name] for the 2027/2028 academic intake.

I have reviewed the curricular admission requirements (e.g. [X] CFU in INF/01 and [Y] CFU in MAT/01-08). My bachelor transcript comprises [Z] credit hours in Computer Science, Discrete Mathematics, Calculus, Linear Algebra, Machine Learning, and Database Systems. Additionally, I hold an IELTS Academic overall score of [IELTS Score, e.g. 7.0].

Could you kindly advise if non-EU applicants with a 4-year South Asian Bachelor's degree are holistically evaluated regarding course syllabi, and if preliminary syllabus pre-checks are available?

Attached please find my European Curriculum Vitae (Europass) and official university transcript for your preliminary review.

Thank you very much for your time and guidance.

Cordiali saluti / Best regards,
[Candidate Full Name]
Email: [candidate.email@example.com]
LinkedIn: https://linkedin.com/in/[profile-id]
Dhaka, Bangladesh`,
    tags: ['Email', 'Professor', 'CFU', 'Curriculum', 'PoliTO', 'UNIBO'],
    updatedAt: new Date().toISOString().split('T')[0],
  },
  {
    id: 'tmpl-3',
    title: 'Statement of Purpose (SOP) Outline for MSc in Data Science / AI',
    category: 'Statement of Purpose (SOP)',
    description: 'High-impact SOP draft bridging undergraduate coursework with technical achievements and Italian academic alignment.',
    content: `STATEMENT OF PURPOSE
Master of Science in [Programme Title]
Candidate: [Candidate Full Name] ([Undergraduate University])

1. INTRODUCTION & MOTIVATION:
- Passion for intelligent systems, algorithmic optimization, and large-scale engineering.
- Why Italy: High-calibre public research universities, European innovation initiatives, and affordable public higher education.

2. ACADEMIC FOUNDATIONS & COURSE MATCHING:
- Rigorous 4-year curriculum: Advanced Algorithms, Operating Systems, Machine Learning, Applied Mathematics.
- Academic trajectory: Holistic academic growth, practical engineering competence, and upper-division project results.
- English competency: Proven fluency through IELTS Academic certification.

3. RESEARCH & APPLIED ENGINEERING EXPERIENCE:
- Projects in Natural Language Processing, computer vision, and distributed software pipelines.
- Open-source contributions and production-ready GitHub repositories.

4. WHY THIS SPECIFIC UNIVERSITY:
- Alignment with professors, research laboratories, and specific course modules (e.g., Deep Learning, Distributed Cloud Architectures).

5. CAREER VISION & LONG-TERM OBJECTIVES:
- Becoming a Machine Learning Engineer / AI Researcher bridging international innovation with high-impact data problems.`,
    tags: ['SOP', 'Motivation', 'AI', 'PoliTO', 'Data Science'],
    updatedAt: new Date().toISOString().split('T')[0],
  },
  {
    id: 'tmpl-4',
    title: 'Italian CAF Patronato Inquiry for ISEE Parificato Calculation',
    category: 'Motivation Letter',
    description: 'Email template in Italian and English requesting appointment/processing of ISEE Parificato from non-EU documents.',
    content: `Oggetto / Subject: Richiesta rilascio ISEE Parificato per borsa di studio EDISU/ER.GO - Studente Internazionale (Bangladesh)

Gentile CAF [Nome CAF / Sede],

Mi chiamo [Nome e Cognome Studente], studente internazionale proveniente dal Bangladesh, futuro immatricolato per l'A.A. 2027/2028 presso [Nome Università, es. Politecnico di Torino / Università di Bologna].

Scrivo per richiedere la procedura di calcolo e rilascio dell'attestazione ISEE Parificato necessaria per la richiesta di borsa di studio regionale e alloggio universitario (Bando [EDISU Piemonte / ER.GO]).

Ho a disposizione la seguente documentazione debitamente legalizzata e tradotta in italiano:
1. Composizione del nucleo familiare (Family Composition Certificate) attestato dal Ministero degli Esteri del Bangladesh (MOFA) e Ambasciata Italiana;
2. Certificato dei redditi familiari dell'anno solare precedente;
3. Certificato del patrimonio mobiliare e immobiliare (conti bancari e proprietà immobile) al 31/12;
4. Copia del passaporto e codice fiscale provvisorio.

Potreste confermarmi le modalità di invio dei documenti via email/portale online e le tempistiche di lavorazione?

RingraziandoVi anticipatamente per la disponibilità, porgo cordiali saluti.

[Nome e Cognome Studente]
Email: [email.studente@example.com]
Telefono: [+880 1XXXXXXXXX]`,
    tags: ['CAF', 'ISEE Parificato', 'Scholarship', 'Italian', 'DSU'],
    updatedAt: new Date().toISOString().split('T')[0],
  },
];

export const initialCustomConfig: CustomConfig = {
  taskCategories: [
    'academic',
    'document',
    'universitaly',
    'visa',
    'scholarship',
    'financial',
    'post_arrival',
    'general',
    'admin_urgent',
  ],
  documentCategories: [
    'academic',
    'legalization',
    'universitaly',
    'visa',
    'sponsor_financial',
    'scholarship_dsu',
    'post_arrival',
    'embassy_special',
  ],
  applicationStatuses: [
    'Researching',
    'Preparing Documents',
    'Applied',
    'Under Evaluation',
    'Interview Scheduled',
    'Admitted',
    'Rejected',
    'Pre-Enrolled',
    'Waitlisted',
  ],
  universityRegions: [
    'Piedmont',
    'Emilia-Romagna',
    'Veneto',
    'Tuscany',
    'Lazio',
    'Lombardy',
    'Liguria',
    'Trentino-Alto Adige',
    'Friuli Venezia Giulia',
    'Marche',
    'Umbria',
    'Campania',
  ],
  tags: [
    'PoliTO',
    'UNIBO',
    'UniPi',
    'IELTS Academic',
    'Curriculum ECTS',
    'EDISU',
    'ER.GO',
    'DSU Toscana',
    'CIMEA',
    'MOFA',
    'VFS Dhaka',
    'Permesso',
    'Sponsor',
    'Housing',
  ],
};

export const initialAppearanceSettings: AppearanceSettings = {
  brandTitle: 'Italy Journey Portal',
  brandSubtitle: 'University & Visa Admissions Hub',
  brandBadge: '2026/27',
  themeMode: 'dark',
  colorPalette: 'emerald_navy',
  fontFamily: 'inter',
  fontSizeScale: 'normal',
  headingScale: 'standard',
  bodyTextSize: 'base',
  fontWeightPreset: 'regular',
  buttonTypography: 'medium',
  dashboardNumberSize: 'standard',
  cardRadius: '2xl',
  cardElevation: 'subtle',
  cardSpacing: 'normal',
  layoutDensity: 'comfortable',
  tableDensity: 'comfortable',
  sidebarStyle: 'default',
  showBadges: true,
  activeItemGlow: true,
};

export const initialDashboardSettings: DashboardSettings = {
  widgets: [
    { id: 'kpi_stats', title: 'Key Metric Counters & Readiness KPIs', visible: true, order: 1, width: 'full' },
    { id: 'upcoming_deadlines', title: 'Upcoming Admission & Visa Deadlines', visible: true, order: 2, width: 'full' },
    { id: 'applications_pipeline', title: 'University Application Status Tracker', visible: true, order: 3, width: 'two-thirds' },
    { id: 'priority_tasks', title: 'High Priority Tasks & Next Actions', visible: true, order: 4, width: 'third' },
    { id: 'document_vault', title: 'Critical Academic Documents & Legalization', visible: true, order: 5, width: 'half' },
    { id: 'financial_snapshot', title: 'Financial Readiness & DSU Grants', visible: true, order: 6, width: 'half' },
    { id: 'master_roadmap', title: 'Master Admission Roadmap: 2027/2028 Intake', visible: true, order: 7, width: 'full' },
  ],
  statsFilter: 'all',
  deadlinesLookaheadDays: 180,
  showRoadmapProgressBar: true,
  kpiStatsToShow: ['apps', 'tasks', 'docs', 'dsu', 'budget', 'visa'],
};

export const initialCustomModules: CustomModuleDefinition[] = [
  {
    id: 'mod-lang-prep',
    name: 'Italian Language Prep (A1/A2)',
    slug: 'italian_language_prep',
    description: 'Track Italian vocabulary, grammar milestones, and CILS/CELI preparation for student life.',
    iconName: 'BookOpen',
    categoryGroup: 'RELOCATION & LIFE',
    createdAt: '2026-10-09T00:00:00.000Z',
    updatedAt: '2026-10-09T00:00:00.000Z',
    fields: [
      { id: 'f_topic', name: 'topic', label: 'Study Topic / Unit', type: 'text', required: true, placeholder: 'e.g. Presente indicativo, Greetings' },
      { id: 'f_level', name: 'level', label: 'CEFR Target Level', type: 'dropdown', options: ['A1 Beginner', 'A2 Elementary', 'B1 Intermediate'], defaultValue: 'A1 Beginner' },
      { id: 'f_hours', name: 'studyHours', label: 'Study Hours Logged', type: 'number', placeholder: '4' },
      { id: 'f_deck_url', name: 'deckUrl', label: 'Anki / Resource Deck Link', type: 'url', placeholder: 'https://ankiweb.net/shared/...' },
      { id: 'f_done', name: 'completed', label: 'Mastered Unit', type: 'checkbox', defaultValue: false },
      { id: 'f_notes', name: 'notes', label: 'Grammar Notes & Key Verbs', type: 'notes', placeholder: 'Essere vs Avere conjugation notes...' },
    ],
  },
  {
    id: 'mod-prof-outreach',
    name: 'Professor & Faculty Outreach',
    slug: 'professor_outreach',
    description: 'Track academic emails, lab specializations, and potential thesis advisors in Italy.',
    iconName: 'MailCheck',
    categoryGroup: 'ADMISSION & UNIVERSITIES',
    createdAt: '2026-10-09T00:00:00.000Z',
    updatedAt: '2026-10-09T00:00:00.000Z',
    fields: [
      { id: 'f_pname', name: 'professorName', label: 'Professor Full Name', type: 'text', required: true, placeholder: 'Prof. Marco Rossi' },
      { id: 'f_uni', name: 'university', label: 'University', type: 'dropdown', options: ['Politecnico di Torino', 'Politecnico di Milano', 'University of Bologna', 'Sapienza University of Rome', 'University of Pisa'], defaultValue: 'Politecnico di Torino' },
      { id: 'f_lab', name: 'researchLab', label: 'Lab / Research Focus', type: 'text', placeholder: 'Computer Vision & Deep Learning Lab' },
      { id: 'f_email', name: 'email', label: 'Official Academic Email', type: 'text', placeholder: 'marco.rossi@polito.it' },
      { id: 'f_status', name: 'contactStatus', label: 'Outreach Status', type: 'dropdown', options: ['Drafting Email', 'Sent - Awaiting Reply', 'Positive Response', 'Interview Scheduled', 'No Reply'], defaultValue: 'Drafting Email' },
      { id: 'f_date', name: 'contactDate', label: 'Date Contacted', type: 'date' },
      { id: 'f_notes', name: 'notes', label: 'Discussion Summary & Advice', type: 'notes', placeholder: 'Professor recommended reviewing their recent ECCV paper on Vision Transformers.' },
    ],
  },
];

export const initialCustomModuleRecords: CustomModuleRecord[] = [
  {
    id: 'rec-lang-1',
    moduleId: 'mod-lang-prep',
    data: {
      f_topic: 'Pronomi Diretti e Indiretti (Direct & Indirect Pronouns)',
      f_level: 'A1 Beginner',
      f_hours: 6,
      f_deck_url: 'https://ankiweb.net/shared/info/italian-pronouns',
      f_done: true,
      f_notes: 'Mi, ti, ci, vi; lo, la, li, le. Used frequently when shopping at Esselunga or asking directions in Milan.',
    },
    createdAt: '2026-10-09T00:00:00.000Z',
    updatedAt: '2026-10-09T00:00:00.000Z',
  },
  {
    id: 'rec-lang-2',
    moduleId: 'mod-lang-prep',
    data: {
      f_topic: 'Conversational Italian for Codice Fiscale & Poste Italiane',
      f_level: 'A2 Elementary',
      f_hours: 4,
      f_deck_url: 'https://youtube.com/watch?v=sample-italian-student-phrases',
      f_done: false,
      f_notes: 'Essential phrases: "Vorrei richiedere il codice fiscale", "Ho un appuntamento per il kit postale del permesso".',
    },
    createdAt: '2026-10-09T00:00:00.000Z',
    updatedAt: '2026-10-09T00:00:00.000Z',
  },
  {
    id: 'rec-prof-1',
    moduleId: 'mod-prof-outreach',
    data: {
      f_pname: 'Prof. Barbara Caputo',
      f_uni: 'Politecnico di Torino',
      f_lab: 'Visual and Multimodal Applied Learning Lab (VANDAL)',
      f_email: 'barbara.caputo@polito.it',
      f_status: 'Positive Response',
      f_date: '2026-10-01',
      f_notes: 'Positive response regarding MSc curriculum prerequisites and encouraged applying in Round 1 with official transcript evaluation.',
    },
    createdAt: '2026-10-09T00:00:00.000Z',
    updatedAt: '2026-10-09T00:00:00.000Z',
  },
];

export const initialNavigationSettings: NavigationSettings = {
  hiddenModules: [],
  customLabels: {},
};


