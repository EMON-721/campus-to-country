import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  GraduationCap,
  Award,
  ChevronRight,
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  month: string;
  title: string;
  category: 'University App' | 'Academic Milestone' | 'CIMEA & MOFA' | 'Visa & Embassy' | 'DSU Scholarship' | 'Relocation';
  urgency: 'critical' | 'high' | 'normal';
  details: string;
  dateStr: string;
}

export const CalendarDeadlinesView: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const events: TimelineEvent[] = [
    {
      id: 'e1',
      month: 'November 2026',
      title: 'University of Padua (UNIPD) Call 1 Opens',
      category: 'University App',
      urgency: 'high',
      dateStr: '2026-11-02',
      details: 'Call 1 offers maximum consideration for international tuition waiver grants.',
    },
    {
      id: 'e2',
      month: 'December 2026',
      title: 'Politecnico di Torino (PoliTO) Round 1 Opens',
      category: 'University App',
      urgency: 'critical',
      dateStr: '2026-12-10',
      details: 'MSc Data Science and Engineering application portal open.',
    },
    {
      id: 'e3',
      month: 'January 2027',
      title: 'PoliTO Round 1 & UNIBO Intake 1 Deadlines',
      category: 'University App',
      urgency: 'critical',
      dateStr: '2027-01-25',
      details: 'Submit before midnight CET to ensure non-EU quota slot consideration.',
    },
    {
      id: 'e4',
      month: 'February 2027',
      title: 'UNIPD Call 1 Closes & University of Pisa Call 1',
      category: 'University App',
      urgency: 'high',
      dateStr: '2027-02-15',
      details: 'UniPi MSc AI & Data Engineering call submission (0€ fee).',
    },
    {
      id: 'e5',
      month: 'March 2027',
      title: 'University of Genoa (UniGe) Spring Call',
      category: 'University App',
      urgency: 'normal',
      dateStr: '2027-03-30',
      details: 'Safe target application window for Computer Engineering AI track.',
    },
    {
      id: 'e6',
      month: 'April 2027',
      title: 'Undergraduate Degree Completion & Final Graduation',
      category: 'Academic Milestone',
      urgency: 'critical',
      dateStr: '2027-04-30',
      details: 'Final CGPA finalized. Collect sealed provisional certificate & complete transcripts.',
    },
    {
      id: 'e7',
      month: 'May 2027',
      title: 'MOE & MOFA Dhaka Attestations + CIMEA Order',
      category: 'CIMEA & MOFA',
      urgency: 'critical',
      dateStr: '2027-05-15',
      details: 'Authenticate degree papers in Segunbagicha, order CIMEA Statement of Comparability.',
    },
    {
      id: 'e8',
      month: 'June 2027',
      title: 'Universitaly Pre-enrolment 2027/2028 Submission',
      category: 'University App',
      urgency: 'critical',
      dateStr: '2027-06-15',
      details: 'Select admitted university, forward to Italian Embassy Dhaka, receive Riepilogo.',
    },
    {
      id: 'e9',
      month: 'July 2027',
      title: 'VFS Italy Dhaka Visa Appointment & DSU Filings',
      category: 'Visa & Embassy',
      urgency: 'critical',
      dateStr: '2027-07-10',
      details: 'Submit Type D visa dossier, submit ISEE Parificato to EDISU/ER.GO/Toscana.',
    },
    {
      id: 'e10',
      month: 'August 2027',
      title: 'Visa Issuance & Flight Ticket Booking',
      category: 'Relocation',
      urgency: 'high',
      dateStr: '2027-08-20',
      details: 'Collect passport with Italian Type D visa sticker. Book Qatar/Emirates student fare.',
    },
    {
      id: 'e11',
      month: 'September 2027',
      title: 'Departure from Dhaka & Welcome to Italy 🇮🇹',
      category: 'Relocation',
      urgency: 'critical',
      dateStr: '2027-09-15',
      details: 'Arrive at Milan (MXP) or Rome (FCO). Check in to student housing.',
    },
    {
      id: 'e12',
      month: 'October 2027',
      title: 'Permesso di Soggiorno (8-Day Kit) & University Classes',
      category: 'Relocation',
      urgency: 'critical',
      dateStr: '2027-10-01',
      details: 'Poste Italiane yellow kit submitted. In-person matriculation at university.',
    },
  ];

  const filtered = selectedCat === 'all' ? events : events.filter((e) => e.category === selectedCat);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <CalendarIcon className="w-4 h-4" />
            <span>Master Timeline 2026 – 2027/2028</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Admissions Calendar & Deadlines</h2>
          <p className="text-xs text-slate-400 mt-1">
            Chronological roadmap tracking university application calls, degree graduation, and visa clearance.
          </p>
        </div>

        {/* Filter */}
        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
        >
          <option value="all">All Milestone Categories</option>
          <option value="University App">University Applications</option>
          <option value="Academic Milestone">Academic Graduation</option>
          <option value="CIMEA & MOFA">CIMEA & Legalization</option>
          <option value="Visa & Embassy">Visa & VFS Dhaka</option>
          <option value="Relocation">Travel & Arrival</option>
        </select>
      </div>

      {/* Timeline items */}
      <div className="relative border-l border-slate-800 ml-4 sm:ml-6 pl-6 space-y-6">
        {filtered.map((item) => (
          <div key={item.id} className="relative group">
            {/* Dot */}
            <div
              className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-900 ${
                item.urgency === 'critical'
                  ? 'bg-rose-500 ring-4 ring-rose-500/20'
                  : item.urgency === 'high'
                  ? 'bg-amber-500 ring-4 ring-amber-500/20'
                  : 'bg-emerald-500 ring-4 ring-emerald-500/20'
              }`}
            />

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="font-mono text-emerald-400 font-bold">{item.month}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {item.category}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                {item.title}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">{item.details}</p>

              <div className="text-[11px] text-slate-400 font-mono pt-1">
                Target Date: {item.dateStr}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

