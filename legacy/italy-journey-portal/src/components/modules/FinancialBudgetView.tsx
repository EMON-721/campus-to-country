import React, { useState } from 'react';
import { ExpenseItem } from '../../types';
import { Modal } from '../common/Modal';
import {
  WalletCards,
  Plus,
  Coins,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  TrendingDown,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface FinancialBudgetViewProps {
  expenses: ExpenseItem[];
  onAddExpense: (exp: ExpenseItem) => void;
  onUpdateExpense: (exp: ExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
}

const PHASES = [
  'All Phases',
  'Preparation',
  'Admission & CIMEA',
  'Visa & Embassy',
  'Flight & Travel',
  'Initial Italy Settlement',
] as const;

export const FinancialBudgetView: React.FC<FinancialBudgetViewProps> = ({
  expenses,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<string>('All Phases');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<ExpenseItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const EUR_RATE = 132;

  // Form State
  const initialForm: Partial<ExpenseItem> = {
    title: '',
    phase: 'Admission & CIMEA',
    estimatedEur: 50,
    estimatedBdt: 6600,
    status: 'Pending',
    notes: '',
  };

  const [formData, setFormData] = useState<Partial<ExpenseItem>>(initialForm);

  const handleOpenAdd = () => {
    setEditingExp(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: ExpenseItem) => {
    setEditingExp(exp);
    setFormData(exp);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExp(null);
  };

  const handleEurChange = (val: number) => {
    setFormData({
      ...formData,
      estimatedEur: val,
      estimatedBdt: Math.round(val * EUR_RATE),
    });
  };

  const handleBdtChange = (val: number) => {
    setFormData({
      ...formData,
      estimatedBdt: val,
      estimatedEur: Math.round(val / EUR_RATE),
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingExp) {
      const updated: ExpenseItem = {
        ...editingExp,
        ...(formData as ExpenseItem),
      };
      onUpdateExpense(updated);
    } else {
      const created: ExpenseItem = {
        id: `exp-${Date.now()}`,
        title: formData.title!,
        phase: formData.phase || 'Preparation',
        estimatedEur: Number(formData.estimatedEur) || 0,
        actualEur: formData.actualEur,
        estimatedBdt: Number(formData.estimatedBdt) || 0,
        actualBdt: formData.actualBdt,
        status: formData.status || 'Pending',
        notes: formData.notes || '',
      };
      onAddExpense(created);
    }
    handleCloseModal();
  };

  const filteredExpenses = expenses.filter((e) => {
    return selectedPhase === 'All Phases' || e.phase === selectedPhase;
  });

  const totalEstimatedEur = expenses.reduce((acc, curr) => acc + curr.estimatedEur, 0);
  const totalEstimatedBdt = expenses.reduce((acc, curr) => acc + curr.estimatedBdt, 0);

  const totalPaidEur = expenses
    .filter((e) => e.status === 'Paid')
    .reduce((acc, curr) => acc + (curr.actualEur || curr.estimatedEur), 0);

  const totalPaidBdt = expenses
    .filter((e) => e.status === 'Paid')
    .reduce((acc, curr) => acc + (curr.actualBdt || curr.estimatedBdt), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <WalletCards className="w-4 h-4" />
            <span>Personal Expenditure Control</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Financial Budget Tracker</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track expenses from IELTS & CIMEA verification through to flight tickets and your first month in Italy.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense Item</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
          <span className="text-xs font-semibold text-slate-400">Total Estimated Budget</span>
          <div className="text-2xl font-black text-white font-mono">
            €{totalEstimatedEur.toLocaleString()} EUR
          </div>
          <div className="text-xs text-slate-400 font-mono">
            ≈ ৳{totalEstimatedBdt.toLocaleString()} BDT
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
          <span className="text-xs font-semibold text-emerald-400">Paid So Far</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            €{totalPaidEur.toLocaleString()} EUR
          </div>
          <div className="text-xs text-slate-400 font-mono">
            ≈ ৳{totalPaidBdt.toLocaleString()} BDT
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
          <span className="text-xs font-semibold text-cyan-400">Regional DSU Grant Potential</span>
          <div className="text-2xl font-black text-cyan-300 font-mono">Needs Verification</div>
          <div className="text-xs text-slate-400">
            Tuition waiver & cash grant depend on verified ISEE Parificato and regional ranking.
          </div>
        </div>
      </div>

      {/* Phase Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        {PHASES.map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPhase(p)}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
              selectedPhase === p
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Expense Items Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
            <tr>
              <th className="p-4">Expense Item</th>
              <th className="p-4">Phase</th>
              <th className="p-4">Estimated (EUR / BDT)</th>
              <th className="p-4">Status</th>
              <th className="p-4">Notes</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredExpenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-slate-850">
                <td className="p-4 font-bold text-white">{exp.title}</td>
                <td className="p-4 text-slate-400">{exp.phase}</td>
                <td className="p-4 font-mono font-medium">
                  <div className="text-emerald-300 font-bold">€{exp.estimatedEur}</div>
                  <div className="text-[11px] text-slate-400">৳{exp.estimatedBdt.toLocaleString()}</div>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      exp.status === 'Paid'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : exp.status === 'Reimbursed by DSU'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {exp.status}
                  </span>
                </td>
                <td className="p-4 text-slate-400 max-w-xs truncate">{exp.notes || '—'}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    <button
                      onClick={() => handleOpenEdit(exp)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(exp.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingExp ? `Edit: ${editingExp.title}` : 'Add Financial Expense Item'}
        subtitle="Specify estimated cost in EUR and BDT conversion"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. VFS Italy Student Visa Fee"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Stage Phase</label>
              <select
                value={formData.phase || 'Preparation'}
                onChange={(e) => setFormData({ ...formData, phase: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                {PHASES.filter((p) => p !== 'All Phases').map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Status</label>
              <select
                value={formData.status || 'Pending'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Reimbursed by DSU">Reimbursed by DSU</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Estimated EUR (€)</label>
              <input
                type="number"
                min="0"
                value={formData.estimatedEur || 0}
                onChange={(e) => handleEurChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Estimated BDT (৳)</label>
              <input
                type="number"
                min="0"
                value={formData.estimatedBdt || 0}
                onChange={(e) => handleBdtChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Notes</label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              {editingExp ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Expense Item?"
        subtitle="This action cannot be undone."
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-300">
            Are you sure you want to remove this expense item from your budget tracker?
          </p>
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (deleteConfirmId) onDeleteExpense(deleteConfirmId);
                setDeleteConfirmId(null);
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

