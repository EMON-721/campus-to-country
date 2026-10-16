export type ApplicationStatus =
  | 'Researching'
  | 'Preparing Documents'
  | 'Applied'
  | 'Under Evaluation'
  | 'Interview Scheduled'
  | 'Admitted'
  | 'Rejected'
  | 'Pre-Enrolled'
  | 'Waitlisted';

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskCategory =
  | 'academic'
  | 'document'
  | 'universitaly'
  | 'visa'
  | 'scholarship'
  | 'financial'
  | 'post_arrival'
  | 'general';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export type DocumentCategory =
  | 'academic'
  | 'legalization'
  | 'universitaly'
  | 'visa'
  | 'sponsor_financial'
  | 'scholarship_dsu'
  | 'post_arrival';

export type DocumentStatus =
  | 'Not Started'
  | 'Draft'
  | 'Ready'
  | 'Attested / Legalized'
  | 'Submitted'
  | 'Verified';

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  originCountry: string;
  city: string;
  studyLevel?: "Bachelor's" | "Master's" | "PhD";
  currentUniversity: string;
  bachelorDegree: string;
  department?: string;
  subject?: string;
  degreeDuration?: string;
  academicCredits?: number;
  gradingSystem?: string;
  currentCgpa: number;
  cgpaScale: number;
  expectedGraduation: string; // e.g. "2026 / 2027"
  languageProficiencyCert?: string;
  ieltsOverall: number;
  ieltsBreakdown: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
  };
  targetIntake: string; // e.g. "2027/2028 (Autumn / Fall)"
  targetFields: string[];
  targetSpecialization?: string;
  preferredSubject?: string;
  preferredUniversity?: string;
  preferredLanguage: string; // "English-taught"
  passportNumber: string;
  passportExpiry: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  notes: string;
}

export interface ItalianRegion {
  id: string;
  name: string;
  zone: 'North-West' | 'North-East' | 'Central' | 'Southern' | 'Islands';
  capital: string;
  universityCities: string[];
  publicUniversitiesCount: number;
  publicUniversities: string[];
  bachelorProgrammesCount: number;
  masterProgrammesCount: number;
  phdOpportunitiesCount: number;
  featuredDegrees: {
    bachelor: string[];
    master: string[];
    phd: string[];
  };
  regionalScholarshipAuthority: {
    name: string;
    fullName: string;
    officialPortal: string;
    maxStipendEur: number;
    tuitionWaiver: boolean;
    freeMeals: boolean;
    housingProvided: boolean;
    annualCallStatus: 'Published' | 'Upcoming' | 'Application Open' | 'Closed / Evaluation';
    applicationWindow: string;
    iseeParificatoThresholdEur: number;
    officialBandoUrl: string;
  };
  accommodationResources: {
    dormitoriesAvailable: boolean;
    averagePrivateRoomEur: string;
    dormProviders: string[];
    housingPlatforms: string[];
  };
  estimatedLivingCostsEur: {
    low: number;
    average: number;
    high: number;
    category: 'Affordable' | 'Moderate' | 'High Cost';
    monthlyBreakdown: {
      rent: string;
      food: string;
      transport: string;
      utilities: string;
    };
  };
  studentServices: string[];
  officialContacts: {
    scholarshipEmail: string;
    scholarshipPhone: string;
    studentInfoDesk: string;
    address: string;
  };
  officialSources: {
    title: string;
    url: string;
    verifiedDate: string;
  }[];
  verificationStatus: 'Verified' | 'Needs Verification';
}

export interface UniversityProgram {
  id: string;
  universityName: string;
  italianName: string;
  city: string;
  region: string;
  worldRank?: number;
  programTitle: string;
  degreeType: 'MSc / Laurea Magistrale';
  durationYears: number;
  creditsCFU: number;
  language: 'English';
  applicationPortal: string;
  applicationFeeEur: number;
  tuitionFeeEurPerYear: string;
  regionalScholarship: string; // e.g. 'EDISU Piemonte', 'ER.GO', 'DSU Toscana'
  intakeDeadlines: string;
  admissionRequirements: {
    minIelts: number;
    cgpaRecommendation: string;
    curriculumMatching: string;
    greRequired: boolean;
  };
  curriculumFocus: string[]; // e.g. ['Artificial Intelligence', 'Machine Learning', 'Computer Vision']
  competitiveness: 'High' | 'Moderate' | 'Target' | 'Safe / Realistic';
  cgpaStrategyTip: string;
  officialWebsite: string;
  isArchived?: boolean;
  archivedAt?: string;
  isCustom?: boolean;
}

export interface UniversityApplication {
  id: string;
  universityId?: string;
  universityName: string;
  programName: string;
  city: string;
  region: string;
  portalUrl: string;
  portalUsername?: string;
  portalPasswordHint?: string;
  applicationFeeEur: number;
  feePaid: boolean;
  round: string; // e.g. "Round 1 (Nov-Jan)", "Round 2 (Feb-Apr)"
  deadlineDate: string;
  status: ApplicationStatus;
  submissionDate?: string;
  resultDate?: string;
  isUniversitalyChoice: boolean;
  notes: string;
  requiredDocuments: string[];
  scholarshipApplied: boolean;
  updatedAt: string;
  isDemo?: boolean;
  isArchived?: boolean;
  archivedAt?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  tags: string[];
  relatedModule?: string;
  completedAt?: string;
  isDemo?: boolean;
  isArchived?: boolean;
  archivedAt?: string;
}

export interface DocumentVersion {
  versionNumber: string; // e.g. "v1.0", "v1.1", "v2.0"
  fileName: string;
  fileSize?: string;
  uploadedAt: string;
  note?: string;
  fileDataUrl?: string;
}

export interface AcademicDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  status: DocumentStatus;
  requiredFor: string[]; // e.g. ["University App", "Universitaly", "Visa"]
  issuingAuthority: string; // e.g. "University Registrar / Controller of Exams", "MOFA Dhaka", "British Council / IDP"
  copiesCount: number;
  notes: string;
  hasPhysicalCopy: boolean;
  hasDigitalCopy: boolean;
  expiryDate?: string;
  fileReferenceName?: string;
  fileSize?: string;
  fileDataUrl?: string; // Data URL for live preview
  fileType?: string; // 'application/pdf', 'image/png', etc.
  linkedUniversities?: string[]; // Names or IDs of universities
  isPrivate?: boolean; // Sensitive document indicator
  versions?: DocumentVersion[];
  lastReplacedAt?: string;
  isDemo?: boolean;
  isArchived?: boolean;
  archivedAt?: string;
}

export interface RegionalScholarshipInfo {
  region: string;
  agencyName: string;
  website: string;
  academicYear?: string;
  officialCallBando?: string;
  awardAmountDescription?: string;
  estimatedBenefits: string;
  maxAnnualStipendEur?: number;
  freeMealAllowance: boolean;
  freeAccommodation: boolean;
  iseeThresholdEur?: number;
  applicationWindow: string;
  requiredDocuments: string[];
  notes: string;
  verificationStatus?: 'Verified' | 'Needs Verification' | 'Estimated' | 'Outdated';
  lastVerifiedDate?: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  phase: 'Preparation' | 'Admission & CIMEA' | 'Visa & Embassy' | 'Flight & Travel' | 'Initial Italy Settlement';
  estimatedEur: number;
  actualEur?: number;
  estimatedBdt: number;
  actualBdt?: number;
  status: 'Pending' | 'Paid' | 'Reimbursed by DSU';
  notes: string;
  isArchived?: boolean;
  archivedAt?: string;
}

export interface ImportantLink {
  id: string;
  title: string;
  url: string;
  category: 'Official Portals' | 'Scholarships' | 'Bangladesh Community' | 'Embassies & VFS' | 'Learning & Prep' | string;
  description: string;
  isPinned: boolean;
  isArchived?: boolean;
  archivedAt?: string;
}

export interface UserNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
  isArchived?: boolean;
  archivedAt?: string;
}

export type DsuApplicationStatus =
  | 'Not Started'
  | 'Documents Preparation'
  | 'ISEE Parificato Issued'
  | 'Submitted to Agency'
  | 'Provisional Ranking (Idoneo)'
  | 'Provisional Winner (Assegnatario)'
  | 'Final Winner (Beneficiario Borsa)';

export interface DsuApplication {
  agencyName: string;
  region: string;
  applicationDeadline: string;
  status: DsuApplicationStatus;
  cafOfficeUsed: string;
  iseeParificatoEur: number;
  protocolNumber: string;
  freeMealRequested: boolean;
  dormAccommodationRequested: boolean;
  notes: string;
  updatedAt: string;
}

export interface CimeaStep {
  id: number;
  title: string;
  authority: string;
  timeline: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  cost: string;
  instructions: string;
  dossierNumber?: string;
  verificationDate?: string;
}

export type UniversitalyStatus =
  | 'Draft'
  | 'Submitted to University'
  | 'Under Evaluation by Faculty'
  | 'Approved (Riepilogo Issued)'
  | 'Forwarded to Embassy Dhaka'
  | 'Rejected by University';

export interface UniversitalyRecord {
  accountEmail: string;
  targetUniversity: string;
  targetDegree: string;
  consularPost: string;
  applicationCode: string;
  status: UniversitalyStatus;
  submissionDate?: string;
  approvalDate?: string;
  riepilogoPdfDownloaded: boolean;
  notes: string;
  checklist: { id: string; text: string; checked: boolean }[];
  updatedAt: string;
}

export interface EctsCourseMapping {
  id: string;
  courseCode: string;
  courseTitle: string;
  ulabCourseCode?: string;
  ulabCourseTitle?: string;
  creditHours: number;
  convertedCfu: number;
  italianDiscipline: 'INF/01' | 'ING-INF/05' | 'MAT/01-08' | 'FIS/01-03' | 'General';
  status: 'Matched' | 'Partial' | 'Pending';
}

export interface AccommodationRecord {
  id: string;
  type: 'University Dormitory' | 'Private Room' | 'Studio / Monolocale' | 'Shared Apartment' | 'Temporary Hostel';
  propertyName: string;
  city: string;
  address?: string;
  monthlyRentEur: number;
  depositEur: number;
  utilitiesIncluded: boolean;
  status: 'Inquired' | 'Waitlisted' | 'Application Submitted' | 'Contract Signed' | 'Reserved';
  contractType?: 'Contratto Transitorio' | 'Contratto 3+2' | 'EDISU / ER.GO Dorm' | 'Hostel Booking';
  contactPerson?: string;
  contactEmailOrPhone?: string;
  bookingLink?: string;
  notes: string;
  isArchived?: boolean;
  archivedAt?: string;
}

export interface FlightRecord {
  id: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  transitAirport?: string;
  departureDate: string;
  arrivalDate: string;
  bookingReferencePnr?: string;
  ticketCostEur: number;
  ticketCostBdt: number;
  baggageAllowanceKg: number;
  cabinBaggageKg: number;
  status: 'Searching' | 'Tentative' | 'Booked' | 'Ticket Issued';
  notes: string;
  isArchived?: boolean;
  archivedAt?: string;
}

export interface VisaCheckItem {
  id: string;
  category: string;
  title: string;
  description: string;
  isMandatory: boolean;
  status: 'Ready' | 'In Progress' | 'Missing';
  notes?: string;
  isArchived?: boolean;
  archivedAt?: string;
}

export interface SponsorBankRecord {
  id: string;
  sponsorName: string;
  relationship: string;
  bankName: string;
  accountNumberMasked: string;
  accountType: string;
  balanceBdt: number;
  balanceEur: number;
  statementPeriod: string;
  solvencyCertificateIssued: boolean;
  tinOrTaxReturnAttached: boolean;
  affidavitNotarized: boolean;
  sourceOfFundsDescription: string;
  status: 'Draft' | 'Gathering Statements' | 'Solvency Ready' | 'Notarized & Ready';
  isArchived?: boolean;
  archivedAt?: string;
}

export interface EmbassyVisaRecord {
  id: string;
  consularOffice: string;
  visaCategory: string;
  vfsReferenceNumber?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentStatus: 'Monitoring Slots' | 'Booked' | 'Attended / Submitted' | 'Passport with Embassy' | 'Visa Issued' | 'Refused';
  submissionTargetMonth: string;
  visaFeeBdt: number;
  vfsFeeBdt: number;
  interviewNotes?: string;
  policeClearanceAttached: boolean;
  travelInsuranceAttached: boolean;
  dummyTicketAttached: boolean;
  statusNotes?: string;
  updatedAt: string;
}

export interface ReusableTemplate {
  id: string;
  title: string;
  category: 'Statement of Purpose (SOP)' | 'Curriculum Vitae (CV)' | 'Email to Professor' | 'Recommendation Letter' | 'Sponsor Affidavit' | 'Motivation Letter' | 'Custom';
  description: string;
  content: string;
  tags: string[];
  updatedAt: string;
}

export interface CustomConfig {
  taskCategories: string[];
  documentCategories: string[];
  applicationStatuses: string[];
  universityRegions: string[];
  tags: string[];
}

// ==================== PART 2: APPEARANCE & CUSTOMIZATION ====================

export type ThemePalette =
  | 'emerald_navy'
  | 'sapphire_blue'
  | 'forest_mint'
  | 'cyber_slate'
  | 'velvet_purple';

// ==================== AUTHENTICATION & ACCESS CONTROL ====================

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  bachelorDegree?: string;
  currentUniversity?: string;
  targetIntake?: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt: number;
}

export interface AppearanceSettings {
  brandTitle: string;
  brandSubtitle: string;
  brandBadge: string;
  themeMode: 'dark' | 'light';
  colorPalette: ThemePalette;
  fontFamily: 'inter' | 'jakarta' | 'system';
  fontSizeScale: 'compact' | 'normal' | 'spacious';
  headingScale: 'compact' | 'standard' | 'prominent';
  bodyTextSize: 'sm' | 'base' | 'lg';
  fontWeightPreset: 'regular' | 'medium' | 'semibold';
  buttonTypography: 'normal' | 'medium' | 'semibold';
  dashboardNumberSize: 'compact' | 'standard' | 'large';
  cardRadius: 'md' | 'xl' | '2xl' | '3xl';
  cardElevation: 'flat' | 'subtle' | 'glow';
  cardSpacing: 'compact' | 'normal' | 'spacious';
  layoutDensity: 'compact' | 'comfortable';
  tableDensity: 'compact' | 'comfortable';
  sidebarStyle: 'default' | 'minimal' | 'glass';
  showBadges: boolean;
  activeItemGlow: boolean;
}

export type DashboardWidgetId =
  | 'kpi_stats'
  | 'master_roadmap'
  | 'applications_pipeline'
  | 'priority_tasks'
  | 'upcoming_deadlines'
  | 'document_vault'
  | 'financial_snapshot'
  | 'universitaly_banner'
  | 'quick_links';

export interface DashboardWidgetConfig {
  id: DashboardWidgetId;
  title: string;
  visible: boolean;
  order: number;
  width: 'full' | 'half' | 'third' | 'two-thirds';
}

export interface DashboardSettings {
  widgets: DashboardWidgetConfig[];
  statsFilter: 'all' | 'my' | 'demo';
  deadlinesLookaheadDays: number;
  showRoadmapProgressBar: boolean;
  kpiStatsToShow: string[]; // e.g. ['apps', 'tasks', 'docs', 'dsu', 'budget', 'visa']
}

// ==================== CUSTOM MODULE BUILDER ====================

export type CustomFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'currency'
  | 'dropdown'
  | 'checkbox'
  | 'url'
  | 'notes'
  | 'file';

export interface CustomFieldDefinition {
  id: string;
  name: string;
  label: string;
  type: CustomFieldType;
  required?: boolean;
  options?: string[]; // for dropdown
  placeholder?: string;
  defaultValue?: any;
}

export interface CustomModuleDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string; // Lucide icon identifier e.g. 'BookOpen', 'Award', 'Globe', etc.
  categoryGroup:
    | 'COMMAND CENTER'
    | 'ADMISSION & UNIVERSITIES'
    | 'SCHOLARSHIP & FINANCE'
    | 'DOCUMENTS & LEGALIZATION'
    | 'VISA & EMBASSY'
    | 'RELOCATION & LIFE'
    | 'DAILY PRODUCTIVITY'
    | 'CUSTOM MODULES';
  fields: CustomFieldDefinition[];
  createdAt: string;
  updatedAt: string;
  hidden?: boolean;
}

export interface CustomModuleRecord {
  id: string;
  moduleId: string;
  data: Record<string, any>; // field.id -> value
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
  archivedAt?: string;
}

export interface NavigationSettings {
  hiddenModules: string[];
  customLabels: Record<string, string>;
}


