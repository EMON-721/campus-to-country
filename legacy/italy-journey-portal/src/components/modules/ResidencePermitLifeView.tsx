import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  Coffee,
  CreditCard,
  HeartPulse,
  Smartphone,
  Bus,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface ResidencePermitLifeViewProps {
  activeModule?: string;
}

const PERMESSO_STORAGE_KEY = 'italy_msc_permesso_steps';

const defaultPermessoSteps = [
  {
    step: 1,
    title: 'Pick Up Yellow Kit at Poste Italiane (Sportello Amico)',
    desc: 'Free envelope containing Modulo 1 and Modulo 2 collected from any main Italian post office with the Sportello Amico sign.',
    done: false,
  },
  {
    step: 2,
    title: 'Purchase €16 Marca da Bollo (Revenue Stamp)',
    desc: 'Bought at any Tabacchi (tobacco shop) across Italy and affixed to page 1 of Modulo 1.',
    done: false,
  },
  {
    step: 3,
    title: 'Submit Kit & Pay Bollettino at Post Office (Within 8 Days)',
    desc: 'Pay €118.46 for 1-year electronic residence card + €30 registered postal mailing fee.',
    done: false,
  },
  {
    step: 4,
    title: 'Receive Postal Receipt (Ricevuta con Ologramma)',
    desc: 'CRITICAL: The postal receipt with holographic seal serves as your legal residency document and proof of status in Italy.',
    done: false,
  },
  {
    step: 5,
    title: 'Attend Questura (Immigration Police) Appointment',
    desc: 'Take 4 passport photos, original passport, university enrollment proof, and undergo fingerprinting (fotosegnalamento).',
    done: false,
  },
  {
    step: 6,
    title: 'Collect Electronic Smartcard Residence Permit',
    desc: 'Notification received via SMS (portaleimmigrazione.it). Pick up chip card at local Commissariato.',
    done: false,
  },
];

export const ResidencePermitLifeView: React.FC<ResidencePermitLifeViewProps> = ({ activeModule }) => {
  const getInitialTab = (): 'permesso' | 'enrollment' | 'student_life' => {
    if (activeModule === 'enrollment') return 'enrollment';
    if (activeModule === 'student_life') return 'student_life';
    return 'permesso';
  };

  const [activeTab, setActiveTab] = useState<'permesso' | 'enrollment' | 'student_life'>(getInitialTab);

  useEffect(() => {
    if (activeModule === 'enrollment') setActiveTab('enrollment');
    else if (activeModule === 'student_life') setActiveTab('student_life');
    else if (activeModule === 'residence_permit') setActiveTab('permesso');
  }, [activeModule]);

  // Permesso milestone steps with localStorage persistence
  const [permessoSteps, setPermessoSteps] = useState<typeof defaultPermessoSteps>(() => {
    try {
      const saved = localStorage.getItem(PERMESSO_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading permesso steps:', e);
    }
    return defaultPermessoSteps;
  });

  const toggleStep = (idx: number) => {
    setPermessoSteps((prev: typeof defaultPermessoSteps) => {
      const updated = prev.map((s, i) => (i === idx ? { ...s, done: !s.done } : s));
      try {
        localStorage.setItem(PERMESSO_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving permesso steps:', e);
      }
      return updated;
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <Award className="w-4 h-4" />
            <span>Post-Arrival Legal Formalities & Settlement</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Residence Permit, Enrolment & Student Life
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Permesso di Soggiorno (8-day rule), university matriculation, Codice Fiscale, ASL health card, and Italian banking.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('permesso')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'permesso'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Permesso di Soggiorno
          </button>
          <button
            onClick={() => setActiveTab('enrollment')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'enrollment'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Final Enrollment
          </button>
          <button
            onClick={() => setActiveTab('student_life')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'student_life'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Italian Student Life
          </button>
        </div>
      </div>

      {/* Tab 1: Permesso di Soggiorno */}
      {activeTab === 'permesso' && (
        <div className="space-y-6">
          {/* Warning banner for 8 days */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-slate-300">
              <strong className="text-amber-300 block">The Strict 8-Day Rule (Entro 8 giorni lavorativi):</strong>
              Under Italian immigration law, you must submit your yellow kit at Poste Italiane within 8 working days of landing in Italy. The post office stamp on your receipt protects your legal status.
            </div>
          </div>

          {/* Interactive Steps List */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white tracking-tight">
              Permesso di Soggiorno Execution Roadmap
            </h3>

            {permessoSteps.map((s, idx) => (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-start space-x-3.5 group"
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center border shrink-0 transition-colors ${
                    s.done
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-700 bg-slate-950 group-hover:border-emerald-500'
                  }`}
                >
                  {s.done && <Check className="w-3.5 h-3.5" />}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-emerald-400 text-xs font-bold">Step {s.step}:</span>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {s.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: University Final Enrollment */}
      {activeTab === 'enrollment' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">
              University In-Person Matriculation (Segreteria Studenti)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Upon arriving at your Italian university campus (e.g. Turin, Bologna, Padua, Pisa), you must visit the Student Secretariat to transform your provisional pre-enrolment into official matriculation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-white">1. Document Handover</span>
                <p className="text-slate-400">
                  Present your original bachelor transcript, CIMEA statement, and Italian student visa.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-white">2. Tax Regional Stamp (Marca da Bollo)</span>
                <p className="text-slate-400">
                  Pay the standard university regional tax (€156 or waived via DSU) to confirm semester 1 courses.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-white">3. University Smartcard & Email</span>
                <p className="text-slate-400">
                  Receive student magnetic badge (smartcard for library, canteen access) and university login.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Italian Student Life */}
      {activeTab === 'student_life' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Codice Fiscale */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center space-x-2 text-emerald-400">
              <CreditCard className="w-4 h-4" />
              <h4 className="text-sm font-bold text-white">Codice Fiscale (Italian Tax Code)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Essential for everything in Italy: renting rooms, opening bank accounts, getting a SIM, and doctor appointments. Often issued directly on your visa summary or by Agenzia delle Entrate with your passport.
            </p>
          </div>

          {/* Card 2: Tessera Sanitaria (Health Insurance) */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center space-x-2 text-rose-400">
              <HeartPulse className="w-4 h-4" />
              <h4 className="text-sm font-bold text-white">Tessera Sanitaria (SSN Public Healthcare)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Voluntary registration with the Italian National Health Service (SSN) costs a flat student rate and grants complete access to public hospitals and a personal family doctor (Medico di Base).
            </p>
          </div>

          {/* Card 3: Italian SIM Cards */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center space-x-2 text-teal-400">
              <Smartphone className="w-4 h-4" />
              <h4 className="text-sm font-bold text-white">Mobile Network & High-Speed Data</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Recommended: <strong>Iliad</strong> (€9.99/mo for 200GB 5G + EU roaming) or <strong>Fastweb</strong>. Zero hidden fees and simple contract cancellation.
            </p>
          </div>

          {/* Card 4: Student Banking */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center space-x-2 text-amber-400">
              <CreditCard className="w-4 h-4" />
              <h4 className="text-sm font-bold text-white">Free Student Bank Accounts (IBAN)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Intesa Sanpaolo XME Under 35</strong> (100% free Italian IBAN account for receiving DSU scholarship stipends) or <strong>Revolut Italy</strong> for day-to-day contactless spending.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

