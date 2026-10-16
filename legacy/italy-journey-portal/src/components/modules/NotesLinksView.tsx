import React, { useState } from 'react';
import { UserNote, ImportantLink } from '../../types';
import { Modal } from '../common/Modal';
import {
  BookmarkCheck,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  FileText,
  Pin,
  Globe,
  Tag,
} from 'lucide-react';

interface NotesLinksViewProps {
  notes: UserNote[];
  links: ImportantLink[];
  onAddNote: (note: UserNote) => void;
  onUpdateNote: (note: UserNote) => void;
  onDeleteNote: (id: string) => void;
  onAddLink: (link: ImportantLink) => void;
  onDeleteLink: (id: string) => void;
}

export const NotesLinksView: React.FC<NotesLinksViewProps> = ({
  notes,
  links,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onAddLink,
  onDeleteLink,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'links'>('notes');
  const [search, setSearch] = useState('');

  // Note Modal
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<UserNote | null>(null);
  const [noteForm, setNoteForm] = useState({ title: '', content: '', tags: '' });

  // Link Modal
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkForm, setLinkForm] = useState({
    title: '',
    url: '',
    category: 'Official Portals' as ImportantLink['category'],
    description: '',
    isPinned: false,
  });

  const handleOpenAddNote = () => {
    setEditingNote(null);
    setNoteForm({ title: '', content: '', tags: 'Strategy, Admission' });
    setIsNoteModalOpen(true);
  };

  const handleOpenEditNote = (n: UserNote) => {
    setEditingNote(n);
    setNoteForm({ title: n.title, content: n.content, tags: n.tags.join(', ') });
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteForm.title.trim()) return;

    const parsedTags = noteForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingNote) {
      onUpdateNote({
        ...editingNote,
        title: noteForm.title,
        content: noteForm.content,
        tags: parsedTags,
        updatedAt: new Date().toISOString().split('T')[0],
      });
    } else {
      onAddNote({
        id: `note-${Date.now()}`,
        title: noteForm.title,
        content: noteForm.content,
        tags: parsedTags,
        updatedAt: new Date().toISOString().split('T')[0],
      });
    }
    setIsNoteModalOpen(false);
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkForm.title || !linkForm.url) return;

    onAddLink({
      id: `link-${Date.now()}`,
      title: linkForm.title,
      url: linkForm.url.startsWith('http') ? linkForm.url : `https://${linkForm.url}`,
      category: linkForm.category,
      description: linkForm.description,
      isPinned: linkForm.isPinned,
    });
    setIsLinkModalOpen(false);
    setLinkForm({
      title: '',
      url: '',
      category: 'Official Portals',
      description: '',
      isPinned: false,
    });
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredLinks = links.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase()) ||
      l.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <BookmarkCheck className="w-4 h-4" />
            <span>Knowledge Base & Bookmarks</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Notes and Important Links</h2>
          <p className="text-xs text-slate-400 mt-1">
            Official ministry portals, Telegram community channels, and your personal admission research.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'notes' ? (
            <button
              onClick={handleOpenAddNote}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-950 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Note</span>
            </button>
          ) : (
            <button
              onClick={() => setIsLinkModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-950 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Link</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === 'notes' ? 'Search notes...' : 'Search links & portals...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'notes'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Personal Notes ({notes.length})
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'links'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Verified Portals ({links.length})
          </button>
        </div>
      </div>

      {/* Tab: Notes */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-extrabold text-white">{note.title}</h3>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditNote(note)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {note.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <span>Updated: {note.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Links */}
      {activeTab === 'links' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredLinks.map((link) => (
            <div
              key={link.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400">
                    {link.category}
                  </span>
                  <button
                    onClick={() => onDeleteLink(link.id)}
                    className="text-slate-500 hover:text-rose-400 text-xs"
                  >
                    ×
                  </button>
                </div>
                <h4 className="text-sm font-bold text-white">{link.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{link.description}</p>
              </div>

              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-emerald-300 font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>Visit Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Note Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title={editingNote ? 'Edit Note' : 'Create Personal Strategy Note'}
        subtitle="Keep track of findings, advice from seniors, or specific university requirements"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveNote} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Note Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. UniPi AI Course Coordinator Insights"
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Content *</label>
            <textarea
              rows={5}
              required
              placeholder="Write your notes here..."
              value={noteForm.content}
              onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. UniPi, Syllabus, Interview"
              value={noteForm.tags}
              onChange={(e) => setNoteForm({ ...noteForm, tags: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsNoteModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Save Note
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Link Modal */}
      <Modal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        title="Add Important Website Link"
        subtitle="Save portal URLs, embassy announcements, or community groups"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveLink} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Italian Embassy Visa Fee Schedule"
              value={linkForm.title}
              onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">URL *</label>
            <input
              type="text"
              required
              placeholder="https://..."
              value={linkForm.url}
              onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Category</label>
            <select
              value={linkForm.category}
              onChange={(e) => setLinkForm({ ...linkForm, category: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            >
              <option value="Official Portals">Official Portals</option>
              <option value="Scholarships">Scholarships</option>
              <option value="Embassies & VFS">Embassies & VFS</option>
              <option value="Bangladesh Community">Bangladesh Community</option>
              <option value="Learning & Prep">Learning & Prep</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Short Description</label>
            <input
              type="text"
              placeholder="e.g. Official VFS slot alerts"
              value={linkForm.description}
              onChange={(e) => setLinkForm({ ...linkForm, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsLinkModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Add Link
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

