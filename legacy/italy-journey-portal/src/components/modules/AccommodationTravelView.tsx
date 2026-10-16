import React, { useState, useEffect } from 'react';
import {
  Home,
  Plane,
  Luggage,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building,
  MapPin,
  Clock,
  Check,
} from 'lucide-react';

interface AccommodationTravelViewProps {
  activeModule?: string;
}

const PACKING_STORAGE_KEY = 'italy_msc_packing_items';

const defaultPackingItems = [
  { id: 'p1', cat: 'Cabin Bag / Hand Luggage', item: 'Original Valid Passport + Italian Visa Sticker', checked: true },
  { id: 'p2', cat: 'Cabin Bag / Hand Luggage', item: 'Universitaly Pre-enrolment Summary (Printed Copies)', checked: false },
  { id: 'p3', cat: 'Cabin Bag / Hand Luggage', item: 'Undergraduate Transcripts & Syllabus (Original MOFA Attested)', checked: false },
  { id: 'p4', cat: 'Cabin Bag / Hand Luggage', item: 'CIMEA Statement of Comparability & Verification printouts', checked: false },
  { id: 'p5', cat: 'Cabin Bag / Hand Luggage', item: '€1,000 – €1,500 Cash Euros in Small Denominations (€10, €20, €50)', checked: false },
  { id: 'p6', cat: 'Cabin Bag / Hand Luggage', item: 'Medical Prescriptions with English Doctor Seal', checked: false },
  { id: 'p7', cat: 'Electronics', item: 'Italian Universal Socket Adapters (Type C & Type L 3-pin)', checked: false },
  { id: 'p8', cat: 'Electronics', item: 'Laptop, Charger, Power Bank (under 20,000mAh for flight)', checked: false },
  { id: 'p9', cat: 'Checked Baggage', item: 'Thermal Innerwear, Heavy Winter Jacket & Gloves (Italian Winter)', checked: false },
  { id: 'p10', cat: 'Checked Baggage', item: '2 Formal Suits / Shirts for University Presentations', checked: false },
  { id: 'p11', cat: 'Checked Baggage', item: 'Compact Pressure Cooker & Traditional Spices (Dry Packaged)', checked: false },
];

export const AccommodationTravelView: React.FC<AccommodationTravelViewProps> = ({ activeModule }) => {
  const getInitialTab = (): 'accommodation' | 'flight' | 'packing' => {
    if (activeModule === 'flight_planner') return 'flight';
    if (activeModule === 'travel_checklist') return 'packing';
    return 'accommodation';
  };

  const [activeTab, setActiveTab] = useState<'accommodation' | 'flight' | 'packing'>(getInitialTab);

  useEffect(() => {
    if (activeModule === 'flight_planner') setActiveTab('flight');
    else if (activeModule === 'travel_checklist') setActiveTab('packing');
    else if (activeModule === 'accommodation') setActiveTab('accommodation');
  }, [activeModule]);

  // Interactive packing checklist with localStorage persistence
  const [packingItems, setPackingItems] = useState<typeof defaultPackingItems>(() => {
    try {
      const saved = localStorage.getItem(PACKING_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading packing items:', e);
    }
    return defaultPackingItems;
  });

  const togglePacking = (id: string) => {
    setPackingItems((prev: typeof defaultPackingItems) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p));
      try {
        localStorage.setItem(PACKING_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving packing items:', e);
      }
      return updated;
    });
  };

  const packedCount = packingItems.filter((p) => p.checked).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <Home className="w-4 h-4" />
            <span>Relocation & Pre-Departure Coordination</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Accommodation, Flights & Travel Checklist
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Student housing contracts (Codice Fiscale registered), DAC-to-Italy flight reservations, and packing requirements.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center space-x-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('accommodation')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'accommodation'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Accommodation
          </button>
          <button
            onClick={() => setActiveTab('flight')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'flight'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Flight Planner
          </button>
          <button
            onClick={() => setActiveTab('packing')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'packing'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Packing Checklist
          </button>
        </div>
      </div>

      {/* Tab 1: Accommodation */}
      {activeTab === 'accommodation' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Option 1: Regional DSU Dormitories
              </span>
              <h4 className="text-base font-bold text-white">Residenza Universitaria</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Awarded automatically to eligible DSU scholarship recipients (EDISU, ER.GO, DSU Toscana). Includes furnished room, utilities, high-speed Wi-Fi, and 0€ rent!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Option 2: Private Student Flatshare
              </span>
              <h4 className="text-base font-bold text-white">Stanza Singola / Doppia</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Renting a single room in a shared apartment. Essential requirement: The landlord must register the contract with Agenzia delle Entrate (Registered Contract).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Temporary Arrival Housing
              </span>
              <h4 className="text-base font-bold text-white">Initial 2-3 Weeks</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Book a temporary student hostel or Airbnb for your first 14 days in Italy while attending apartment viewings in person to avoid online rental scams.
              </p>
            </div>
          </div>

          {/* Average City Rent Benchmarks */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Average Student Rent by Italian City</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-slate-400">Turin (PoliTO)</div>
                <div className="text-base font-bold text-emerald-300 mt-1">€300 – €450</div>
                <div className="text-[10px] text-slate-400">High affordability</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-slate-400">Pisa (UNIPI)</div>
                <div className="text-base font-bold text-emerald-300 mt-1">€280 – €400</div>
                <div className="text-[10px] text-slate-400">Very student friendly</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-slate-400">Genoa (UniGe)</div>
                <div className="text-base font-bold text-emerald-300 mt-1">€250 – €380</div>
                <div className="text-[10px] text-slate-400">Lowest coastal rent</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-slate-400">Bologna (UNIBO)</div>
                <div className="text-base font-bold text-amber-300 mt-1">€450 – €650</div>
                <div className="text-[10px] text-slate-400">High competition</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-slate-400">Milan (PoliMi)</div>
                <div className="text-base font-bold text-rose-300 mt-1">€600 – €850</div>
                <div className="text-[10px] text-slate-400">Most expensive city</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Flight Booking Planner */}
      {activeTab === 'flight' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Plane className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">
                Dhaka (DAC) to Italy Flight Route & Student Deals
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-white text-sm">Qatar Airways</div>
                <div className="text-slate-400">Route: DAC → DOH (Doha) → MXP/FCO</div>
                <div className="text-emerald-400 font-bold">Student Club: 40-45 kg Checked Bags</div>
                <p className="text-[11px] text-slate-400">
                  Joining the Qatar Airways Student Club offers 10-15% discount + extra 10kg checked bag allowance.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-white text-sm">Turkish Airlines</div>
                <div className="text-slate-400">Route: DAC → IST (Istanbul) → MXP/BLQ/TRN</div>
                <div className="text-emerald-400 font-bold">Direct Connections to Bologna & Turin</div>
                <p className="text-[11px] text-slate-400">
                  Flies directly into regional Italian airports like Bologna (BLQ) and Turin (TRN) without needing trains from Milan.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-white text-sm">Emirates</div>
                <div className="text-slate-400">Route: DAC → DXB (Dubai) → MXP/FCO/BLQ</div>
                <div className="text-emerald-400 font-bold">Student Special: 40 kg Baggage</div>
                <p className="text-[11px] text-slate-400">
                  Reliable schedule, generous onboard service, student discount promo code available online.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Airport & Travel Packing Checklist */}
      {activeTab === 'packing' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400">Items Packed: </span>
              <strong className="text-emerald-400 font-mono text-sm">
                {packedCount} / {packingItems.length}
              </strong>
            </div>
            <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${Math.round((packedCount / packingItems.length) * 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2.5">
            {packingItems.map((p) => (
              <div
                key={p.id}
                onClick={() => togglePacking(p.id)}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer group transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                      p.checked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-700 bg-slate-950 group-hover:border-emerald-500'
                    }`}
                  >
                    {p.checked && <Check className="w-3 h-3" />}
                  </div>
                  <div>
                    <span
                      className={`text-xs font-semibold ${
                        p.checked ? 'text-slate-400 line-through' : 'text-slate-200'
                      }`}
                    >
                      {p.item}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{p.cat}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

