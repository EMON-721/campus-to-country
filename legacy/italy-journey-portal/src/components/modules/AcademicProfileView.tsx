import React, { useState } from 'react';
import { UserProfile } from '../../types';
import {
  UserCheck,
  Award,
  GraduationCap,
  BookOpen,
  Sparkles,
  Save,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Calculator,
  Layers,
  FileCheck2,
  Building2,
  Globe2,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface AcademicProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigate?: (module: 'programmes' | 'documents' | 'cimea_dov' | 'universitaly') => void;
}

export const AcademicProfileView: React.FC<AcademicProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onNavigate,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [newFieldInput, setNewFieldInput] = useState('');

  // Undergraduate to Italian ECTS conversion calculator state
  const [undergradCompletedCredits, setUndergradCompletedCredits] = useState<number>(140);
  const estimatedCfu = Math.round(undergradCompletedCredits * 1.5);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIeltsChange = (sub: keyof UserProfile['ieltsBreakdown'], val: number) => {
    setFormData((prev) => ({
      ...prev,
      ieltsBreakdown: {
        ...prev.ieltsBreakdown,
        [sub]: val,
      },
    }));
  };

  const handleAddField = () => {
    if (!newFieldInput.trim()) return;
    if (!formData.targetFields.includes(newFieldInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        targetFields: [...prev.targetFields, newFieldInput.trim()],
      }));
    }
    setNewFieldInput('');
  };

  const handleRemoveField = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      targetFields: prev.targetFields.filter((f) => f !== field),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  // Check if user has entered minimum profile credentials and has selected an academic programme
  const hasMinimumAcademicData =
    Boolean(formData.bachelorDegree?.trim() || formData.currentUniversity?.trim()) &&
    Boolean(formData.subject?.trim() || formData.preferredSubject?.trim()) &&
    Boolean(formData.currentCgpa > 0 || formData.academicCredits);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Alert */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-medium text-xs shadow-2xl flex items-center space-x-2 border border-emerald-400/40 animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>Academic Profile Updated & Saved to Storage!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Applicant Dossier · {formData.studyLevel || "Master's"} Candidate</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Academic Profile & Qualifications
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your education history, test scores, research background, and Italian degree prerequisites across all disciplines.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData(profile);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Save className="w-3.5 h-3.5" />}
                onClick={handleSubmit}
              >
                Save Profile
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile Details
            </Button>
          )}
        </div>
      </div>

      {/* Profile Overview & Strategy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form / Profile Data (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-sm"
          >
            {/* Degree Level Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Intended Study Level in Italy
                </h3>
                <p className="text-[11px] text-slate-400">
                  Select your target qualification type in the Italian higher education system
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {(["Bachelor's", "Master's", "PhD"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    disabled={!isEditing}
                    onClick={() => handleChange('studyLevel', lvl)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      (formData.studyLevel || "Master's") === lvl
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    } disabled:opacity-85`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Academic Credentials Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Full Legal Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium disabled:opacity-80 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Primary Email Address</label>
                <input
                  type="email"
                  disabled={!isEditing}
                  placeholder="e.g. yourname@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium disabled:opacity-80 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Country of Origin / Citizenship</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  placeholder="e.g. Bangladesh / India / Pakistan"
                  value={formData.originCountry}
                  onChange={(e) => handleChange('originCountry', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium disabled:opacity-80 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Current City</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  placeholder="e.g. Dhaka"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium disabled:opacity-80 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  {formData.studyLevel === "Bachelor's"
                    ? 'Secondary High School / College'
                    : 'Current / Previous University'}
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  placeholder="e.g. Name of Institution"
                  value={formData.currentUniversity}
                  onChange={(e) => handleChange('currentUniversity', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium disabled:opacity-80 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  {formData.studyLevel === "Bachelor's"
                    ? 'Secondary Certificate / Stream'
                    : 'Degree Program / Major'}
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  placeholder="e.g. BSc, BA, BBA, HSC, A-Levels, MSc"
                  value={formData.bachelorDegree}
                  onChange={(e) => handleChange('bachelorDegree', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium disabled:opacity-80 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Academic Department / Faculty</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  placeholder="e.g. Department / Faculty name"
                  value={formData.department || ''}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium disabled:opacity-80 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Current Subject / Discipline</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  placeholder="e.g. Economics, Biology, Engineering, Law"
                  value={formData.subject || ''}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium disabled:opacity-80 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Grade / CGPA / Percentage (If Applicable)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    disabled={!isEditing}
                    placeholder="e.g. 3.25"
                    value={formData.currentCgpa || ''}
                    onChange={(e) => handleChange('currentCgpa', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-300 font-bold disabled:opacity-80 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                  <input
                    type="text"
                    disabled={!isEditing}
                    placeholder="Scale (e.g. 4.0)"
                    value={formData.cgpaScale ? `${formData.cgpaScale} Scale` : ''}
                    onChange={(e) => handleChange('cgpaScale', parseFloat(e.target.value) || 4.0)}
                    className="w-28 px-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-xs shrink-0 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Completed Academic Credits (Hours)</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  placeholder="e.g. 120 or 140"
                  value={formData.academicCredits || ''}
                  onChange={(e) => handleChange('academicCredits', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium disabled:opacity-80 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Expected / Actual Graduation Date</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  placeholder="e.g. 2026 or Completed"
                  value={formData.expectedGraduation}
                  onChange={(e) => handleChange('expectedGraduation', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium disabled:opacity-80 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Target Italian Intake</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.targetIntake}
                  onChange={(e) => handleChange('targetIntake', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium disabled:opacity-80 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Preferred Subject / Discipline in Italy</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  placeholder="e.g. International Business, Architecture, AI"
                  value={formData.preferredSubject || ''}
                  onChange={(e) => handleChange('preferredSubject', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium disabled:opacity-80 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Preferred Target University (Optional)</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  placeholder="e.g. University of Bologna, Sapienza"
                  value={formData.preferredUniversity || ''}
                  onChange={(e) => handleChange('preferredUniversity', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium disabled:opacity-80 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Language Proficiency Section */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Language Proficiency (IELTS / TOEFL / Duolingo / MOI / Other)</span>
                </h4>
                <div className="text-xs text-slate-400">
                  {formData.ieltsOverall > 0 ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      Overall: {formData.ieltsOverall}
                    </span>
                  ) : (
                    <span className="text-slate-500 italic">Optional if not applicable</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Listening</span>
                  <input
                    type="number"
                    step="0.5"
                    disabled={!isEditing}
                    placeholder="0"
                    value={formData.ieltsBreakdown.listening || ''}
                    onChange={(e) => handleIeltsChange('listening', parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 bg-transparent text-emerald-300 font-bold text-base focus:outline-none"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Reading</span>
                  <input
                    type="number"
                    step="0.5"
                    disabled={!isEditing}
                    placeholder="0"
                    value={formData.ieltsBreakdown.reading || ''}
                    onChange={(e) => handleIeltsChange('reading', parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 bg-transparent text-emerald-300 font-bold text-base focus:outline-none"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Writing</span>
                  <input
                    type="number"
                    step="0.5"
                    disabled={!isEditing}
                    placeholder="0"
                    value={formData.ieltsBreakdown.writing || ''}
                    onChange={(e) => handleIeltsChange('writing', parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 bg-transparent text-emerald-300 font-bold text-base focus:outline-none"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Speaking</span>
                  <input
                    type="number"
                    step="0.5"
                    disabled={!isEditing}
                    placeholder="0"
                    value={formData.ieltsBreakdown.speaking || ''}
                    onChange={(e) => handleIeltsChange('speaking', parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 bg-transparent text-emerald-300 font-bold text-base focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Target Fields of Interest */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Target Disciplines & Specializations
              </label>

              <div className="flex flex-wrap gap-2">
                {formData.targetFields.map((field, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold flex items-center space-x-1.5"
                  >
                    <span>{field}</span>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveField(field)}
                        className="text-teal-400 hover:text-rose-400 ml-1 text-sm font-bold cursor-pointer"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
                {formData.targetFields.length === 0 && (
                  <span className="text-xs text-slate-500 italic">
                    No disciplines added yet. Add areas of interest below.
                  </span>
                )}
              </div>

              {isEditing && (
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add area (e.g. Economics, Molecular Biology, Architecture)"
                    value={newFieldInput}
                    onChange={(e) => setNewFieldInput(e.target.value)}
                    className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <Button variant="secondary" size="xs" onClick={handleAddField}>
                    Add Area
                  </Button>
                </div>
              )}
            </div>

            {/* Portfolio & Project Links */}
            <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider">
                Academic Portfolio & Web Presence (Optional)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-400 block mb-1">GitHub / Code Repository</span>
                  <input
                    type="text"
                    disabled={!isEditing}
                    placeholder="https://github.com/..."
                    value={formData.githubUrl}
                    onChange={(e) => handleChange('githubUrl', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">LinkedIn Profile</span>
                  <input
                    type="text"
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedinUrl}
                    onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Portfolio / Research Link</span>
                  <input
                    type="text"
                    disabled={!isEditing}
                    placeholder="https://..."
                    value={formData.portfolioUrl}
                    onChange={(e) => handleChange('portfolioUrl', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Personal Notes */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Personal Admission & Research Notes
              </label>
              <textarea
                rows={3}
                disabled={!isEditing}
                placeholder="Personal notes on research interests, target professors, or application deadlines..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed disabled:opacity-80 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </form>
        </div>

        {/* Right Column: Admission Assessment & Prerequisites (Non-Guaranteed) */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center space-x-2 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Admission Assessment
              </h3>
            </div>

            {!hasMinimumAcademicData ? (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-slate-400 flex items-center justify-center mx-auto border border-slate-800">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Admission Assessment Not Available Yet
                  </h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Complete your academic profile and select a university programme to begin an eligibility review.
                  </p>
                </div>
                <div className="pt-2">
                  <Badge variant="amber" size="xs">
                    Not Yet Assessed
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex justify-between text-slate-300">
                    <span>Study Level:</span>
                    <span className="font-bold text-white">{formData.studyLevel || "Master's"}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Academic Field:</span>
                    <span className="font-bold text-emerald-400">{formData.subject || formData.preferredSubject || 'General'}</span>
                  </div>
                  {formData.currentCgpa > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>Standing / CGPA:</span>
                      <span className="font-bold text-amber-300 font-mono">
                        {formData.currentCgpa.toFixed(2)} / {formData.cgpaScale.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {formData.ieltsOverall > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>Language Cert:</span>
                      <span className="font-bold text-sky-400">
                        {formData.ieltsOverall >= 7.0 ? 'C1 Competence' : 'B2 Competence'} ({formData.ieltsOverall})
                      </span>
                    </div>
                  )}
                  {Boolean(formData.academicCredits) && (
                    <div className="flex justify-between text-slate-300">
                      <span>Undergraduate Credits:</span>
                      <span className="font-bold text-teal-300 font-mono">
                        {formData.academicCredits} credit hours
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/20 space-y-2">
                  <div className="text-xs font-semibold text-emerald-300 flex items-center space-x-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Dossier in Progress</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Official admission decisions depend strictly on each Italian university faculty board's syllabus evaluation. Compare your profile directly with specific programme requirements in the University Directory.
                  </p>
                </div>

                {onNavigate && (
                  <Button
                    variant="secondary"
                    size="xs"
                    className="w-full"
                    onClick={() => onNavigate('programmes')}
                  >
                    Explore Target Programmes
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

