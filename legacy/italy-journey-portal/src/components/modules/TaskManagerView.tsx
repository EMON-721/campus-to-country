import React, { useState } from 'react';
import { TaskItem, TaskCategory, TaskPriority, TaskStatus } from '../../types';
import { Modal } from '../common/Modal';
import {
  ListTodo,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag,
  Edit2,
  Trash2,
  Filter,
  Check,
} from 'lucide-react';

interface TaskManagerViewProps {
  tasks: TaskItem[];
  onAddTask: (task: TaskItem) => void;
  onUpdateTask: (task: TaskItem) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  isAddModalOpenInitially?: boolean;
  onCloseAddModalInitially?: () => void;
}

const CATEGORIES: { key: TaskCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All Categories' },
  { key: 'academic', label: 'Academic & Syllabus' },
  { key: 'document', label: 'Documents & Legalization' },
  { key: 'universitaly', label: 'Universitaly Portal' },
  { key: 'visa', label: 'Visa & VFS Dhaka' },
  { key: 'scholarship', label: 'DSU Scholarship' },
  { key: 'financial', label: 'Sponsor & Banking' },
  { key: 'post_arrival', label: 'Post-Arrival in Italy' },
];

export const TaskManagerView: React.FC<TaskManagerViewProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
  isAddModalOpenInitially = false,
  onCloseAddModalInitially,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'user' | 'demo'>('all');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(isAddModalOpenInitially);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const initialFormState: Partial<TaskItem> = {
    title: '',
    description: '',
    category: 'academic',
    priority: 'high',
    status: 'todo',
    dueDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
    tags: ['Degree', 'Admission'],
  };

  const [formData, setFormData] = useState<Partial<TaskItem>>(initialFormState);
  const [tagInput, setTagInput] = useState('');

  // Sync modal when triggered from external quick-add
  React.useEffect(() => {
    if (isAddModalOpenInitially) {
      setEditingTask(null);
      setFormData(initialFormState);
      setIsModalOpen(true);
    }
  }, [isAddModalOpenInitially]);

  const handleOpenAdd = () => {
    setEditingTask(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: TaskItem) => {
    setEditingTask(task);
    setFormData(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    if (onCloseAddModalInitially) onCloseAddModalInitially();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingTask) {
      const updated: TaskItem = {
        ...editingTask,
        ...(formData as TaskItem),
        status: (formData.status as TaskStatus) || editingTask.status,
        isDemo: formData.isDemo !== undefined ? formData.isDemo : editingTask.isDemo,
      };
      onUpdateTask(updated);
    } else {
      const created: TaskItem = {
        id: `t-${Date.now()}`,
        title: formData.title!,
        description: formData.description || '',
        category: formData.category || 'general',
        priority: (formData.priority as TaskPriority) || 'medium',
        status: (formData.status as TaskStatus) || 'todo',
        dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
        tags: formData.tags || [],
        isDemo: formData.isDemo !== undefined ? Boolean(formData.isDemo) : false,
      };
      onAddTask(created);
    }
    handleCloseModal();
  };

  const handleConvertToReal = (task: TaskItem) => {
    onUpdateTask({ ...task, isDemo: false });
  };

  const handleCycleStatus = (task: TaskItem) => {
    const nextStatus: TaskStatus =
      task.status === 'todo' ? 'in_progress' : task.status === 'in_progress' ? 'completed' : 'todo';
    onUpdateTask({
      ...task,
      status: nextStatus,
      completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
    });
  };

  const handleConvertAllDemos = () => {
    tasks.forEach((task) => {
      if (task.isDemo) {
        onUpdateTask({ ...task, isDemo: false });
      }
    });
  };

  const handleDeleteAllDemos = () => {
    if (window.confirm('Remove all sample demonstration tasks? Your own custom tasks will be kept.')) {
      tasks.forEach((task) => {
        if (task.isDemo) {
          onDeleteTask(task.id);
        }
      });
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const current = formData.tags || [];
    setFormData({
      ...formData,
      tags: [...current, tagInput.trim()],
    });
    setTagInput('');
  };

  const handleRemoveTag = (index: number) => {
    const current = formData.tags || [];
    setFormData({
      ...formData,
      tags: current.filter((_, i) => i !== index),
    });
  };

  const userTasksCount = tasks.filter((t) => !t.isDemo).length;
  const demoTasksCount = tasks.filter((t) => t.isDemo).length;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase()) ||
      task.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && task.status !== 'completed') ||
      (statusFilter === 'completed' && task.status === 'completed');

    const matchesSource =
      sourceFilter === 'all' ||
      (sourceFilter === 'user' && !task.isDemo) ||
      (sourceFilter === 'demo' && Boolean(task.isDemo));

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus && matchesSource;
  });

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <ListTodo className="w-4 h-4" />
            <span>Master Action & Milestone Tracker</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Tasks and To-Do Lists</h2>
          <p className="text-xs text-slate-400 mt-1">
            Keep track of critical milestones from syllabus attestation to VFS visa appointment booking.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center space-x-3 text-xs">
            <div>
              <div className="text-[11px] text-slate-400">Completion Rate</div>
              <div className="font-bold text-emerald-400 text-sm">
                {completedCount} / {tasks.length} Completed
              </div>
            </div>
            <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full"
                style={{
                  width: `${tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}%`,
                }}
              />
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Category Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks, descriptions, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full md:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <div className="flex items-center space-x-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  statusFilter === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Done ({completedCount})
              </button>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
            </div>

            {/* Record Source Filter */}
            <div className="flex items-center space-x-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => setSourceFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  sourceFilter === 'all'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({tasks.length})
              </button>
              <button
                onClick={() => setSourceFilter('user')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  sourceFilter === 'user'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-emerald-300'
                }`}
              >
                My Tasks ({userTasksCount})
              </button>
              <button
                onClick={() => setSourceFilter('demo')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  sourceFilter === 'demo'
                    ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30'
                    : 'text-slate-400 hover:text-purple-300'
                }`}
              >
                Samples ({demoTasksCount})
              </button>
            </div>

            {/* Quick Demo Tasks Actions */}
            {demoTasksCount > 0 && (
              <div className="hidden xl:flex items-center space-x-1.5 pl-1 border-l border-slate-800 text-[11px]">
                <button
                  onClick={handleConvertAllDemos}
                  className="px-2 py-1 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  title="Convert all sample tasks into your real action items"
                >
                  Make All Mine
                </button>
                <button
                  onClick={handleDeleteAllDemos}
                  className="px-2 py-1 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Clear all sample tasks"
                >
                  Clear Samples
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                selectedCategory === c.key
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isDone = task.status === 'completed';

          return (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDone
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-65'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  className={`mt-0.5 w-5 h-5 rounded-lg shrink-0 flex items-center justify-center border transition-colors ${
                    isDone
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-600 hover:border-emerald-500 bg-slate-950 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-sm font-bold ${
                        isDone ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </span>

                    {/* Quick status pill that cycles status on click */}
                    <button
                      type="button"
                      onClick={() => handleCycleStatus(task)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition-colors ${
                        task.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : task.status === 'in_progress'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                      title="Click to cycle status: To-Do → In Progress → Completed"
                    >
                      {task.status === 'completed'
                        ? 'Done'
                        : task.status === 'in_progress'
                        ? 'In Progress'
                        : 'To-Do'}
                    </button>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        task.priority === 'urgent'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : task.priority === 'high'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : task.priority === 'medium'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {task.priority}
                    </span>

                    {!task.isDemo ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        My Task
                      </span>
                    ) : (
                      <button
                        onClick={() => handleConvertToReal(task)}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 hover:bg-emerald-500/20 text-purple-300 hover:text-emerald-300 border border-purple-500/30 hover:border-emerald-500/30 transition-colors flex items-center space-x-1"
                        title="Click to convert sample into your own real task"
                      >
                        <span>Sample</span>
                        <span className="text-[9px] underline">→ Make Mine</span>
                      </button>
                    )}
                  </div>

                  {task.description && (
                    <p
                      className={`text-xs leading-relaxed ${
                        isDone ? 'text-slate-400' : 'text-slate-300'
                      }`}
                    >
                      {task.description}
                    </p>
                  )}

                  {/* Meta items */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                    <span className="capitalize text-slate-400 font-medium">
                      Stage: {task.category.replace('_', ' ')}
                    </span>
                    <span className="flex items-center space-x-1 text-slate-300 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Due: {task.dueDate}</span>
                    </span>
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        {task.tags.map((t, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1 sm:self-center shrink-0">
                <button
                  onClick={() => handleOpenEdit(task)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(task.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-medium">No tasks found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? `Edit Task: ${editingTask.title}` : 'Create New Action Item'}
        subtitle="Set milestone deadline, stage category, and priority"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Schedule VFS Italy student appointment"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Description / Action Steps</label>
            <textarea
              rows={3}
              placeholder="Details on what to do..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Stage Category</label>
              <select
                value={formData.category || 'academic'}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as TaskCategory })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                {CATEGORIES.filter((c) => c.key !== 'all').map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Status</label>
              <select
                value={formData.status || 'todo'}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as TaskStatus })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="todo">To-Do (Pending)</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed (Done)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Priority</label>
              <select
                value={formData.priority || 'medium'}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as TaskPriority })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Due Date</label>
              <input
                type="date"
                value={formData.dueDate || ''}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-slate-400 font-medium">Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {(formData.tags || []).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs flex items-center space-x-1"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(idx)}
                    className="text-slate-400 hover:text-rose-400 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                placeholder="Add tag (e.g. VFS, MOFA, Attestation)..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Record Classification Selector */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <label className="block text-slate-400 font-medium text-[11px]">Record Classification</label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isDemo: false })}
                className={`px-3 py-1.5 rounded-xl font-semibold border transition-colors ${
                  !formData.isDemo
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                My Real Task (Action Item)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isDemo: true })}
                className={`px-3 py-1.5 rounded-xl font-semibold border transition-colors ${
                  Boolean(formData.isDemo)
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Sample Demonstration Task
              </button>
            </div>
          </div>

          {/* Actions */}
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-950"
            >
              {editingTask ? 'Update Task' : 'Save Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Task?"
        subtitle="This action cannot be undone."
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-300">
            Are you sure you want to delete this action item from your list?
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
                if (deleteConfirmId) onDeleteTask(deleteConfirmId);
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

