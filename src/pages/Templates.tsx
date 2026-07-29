import { useState, useEffect } from 'react'
import API_URL from '../api'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Edit, Zap, X, Plus, Loader2, Save, Trash2 } from 'lucide-react'

interface Template {
  _id: string
  roleName: string
  subject: string
  body: string
  isDefault: boolean
}

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState<Template | null>(null)
  const [editing, setEditing] = useState<Template | null>(null)
  const [editForm, setEditForm] = useState({ roleName: '', subject: '', body: '' })
  const [saving, setSaving] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  const fetchTemplates = () => {
    setLoading(true)
    fetch(`${API_URL}/templates`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setTemplates(data.data.templates) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTemplates() }, [])

  const openEdit = (t: Template) => {
    setEditing(t)
    setEditForm({ roleName: t.roleName, subject: t.subject, body: t.body })
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    await fetch(`${API_URL}/templates/${editing._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editForm),
    })
    setSaving(false)
    setEditing(null)
    fetchTemplates()
  }

  const handleCreate = async () => {
    setSaving(true)
    await fetch(`${API_URL}/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editForm),
    })
    setSaving(false)
    setShowCreate(false)
    setEditForm({ roleName: '', subject: '', body: '' })
    fetchTemplates()
  }

  const handleDelete = async (id: string) => {
    await fetch(`${API_URL}/templates/${id}`, {
      method: 'DELETE',
    })
    fetchTemplates()
  }

  const roleColors = [
    { color: '#2563EB', bg: '#EFF6FF' },
    { color: '#7C3AED', bg: '#F5F3FF' },
    { color: '#059669', bg: '#ECFDF5' },
    { color: '#DC2626', bg: '#FEF2F2' },
    { color: '#0891B2', bg: '#ECFEFF' },
    { color: '#15803D', bg: '#F0FDF4' },
    { color: '#9333EA', bg: '#FAF5FF' },
    { color: '#B45309', bg: '#FFFBEB' },
  ]

  return (
    <div className="p-4 md:p-6 max-w-6xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[18px] font-semibold text-[var(--color-foreground)] tracking-tight">Templates</h1>
          <p className="text-[13px] text-[var(--color-muted-foreground)] mt-0.5">Manage your professional email templates</p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setEditForm({ roleName: '', subject: '', body: '' }) }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2563EB] text-white text-[12.5px] font-medium hover:bg-[#1D4ED8] transition-colors"
        >
          <Plus size={13} /> New Template
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={22} className="animate-spin text-[var(--color-muted-foreground)]" />
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-[14px] font-medium text-[var(--color-foreground)]">No templates yet</p>
          <p className="text-[12.5px] text-[var(--color-muted-foreground)] mt-1">Create your first template to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {templates.map((t, i) => {
            const { color, bg } = roleColors[i % roleColors.length]
            return (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                whileHover={{ y: -2 }}
                className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden flex flex-col group cursor-default"
              >
                <div className="px-4 pt-5 pb-4 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[13px] font-bold" style={{ backgroundColor: bg, color }}>
                      {t.roleName.charAt(0)}
                    </div>
                    {t.isDefault && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">
                        Default
                      </span>
                    )}
                  </div>
                  <h3 className="text-[13px] font-semibold text-[var(--color-foreground)] leading-snug">{t.roleName}</h3>
                  <p className="text-[11.5px] text-[var(--color-muted-foreground)] mt-1.5 leading-relaxed line-clamp-3">{t.subject}</p>
                </div>
                <div className="px-4 pb-4 flex gap-2">
                  <button
                    onClick={() => setPreview(t)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[var(--color-border)] text-[11.5px] font-medium text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
                  >
                    <Eye size={12} /> Preview
                  </button>
                  <button
                    onClick={() => openEdit(t)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[var(--color-border)] text-[11.5px] font-medium text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
                  >
                    <Edit size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="flex items-center justify-center px-2.5 py-2 rounded-lg border border-[var(--color-border)] text-[11.5px] text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] max-w-lg w-full shadow-2xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-[var(--color-foreground)]">{preview.roleName}</p>
                  <p className="text-[11px] text-[var(--color-muted-foreground)]">Email template preview</p>
                </div>
                <button onClick={() => setPreview(null)} className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">
                  <X size={16} />
                </button>
              </div>
              <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
                <div className="bg-[var(--color-muted)]/50 rounded-lg p-4">
                  <p className="text-[11px] font-medium text-[var(--color-muted-foreground)] mb-2">Subject: {preview.subject}</p>
                  <pre className="text-[12.5px] text-[var(--color-foreground)] whitespace-pre-wrap font-sans leading-relaxed">{preview.body}</pre>
                </div>
              </div>
              <div className="px-5 pb-4 flex gap-2.5">
                <button onClick={() => setPreview(null)} className="flex-1 py-2.5 rounded-lg border border-[var(--color-border)] text-[13px] font-medium text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors">
                  Close
                </button>
                <button onClick={() => { setPreview(null); openEdit(preview) }} className="flex-1 py-2.5 rounded-lg bg-[#2563EB] text-white text-[13px] font-semibold hover:bg-[#1D4ED8] transition-colors">
                  Edit Template
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit / Create Modal */}
      <AnimatePresence>
        {(editing || showCreate) && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] max-w-lg w-full shadow-2xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
                <p className="text-[13px] font-semibold text-[var(--color-foreground)]">
                  {showCreate ? 'New Template' : `Edit — ${editing?.roleName}`}
                </p>
                <button onClick={() => { setEditing(null); setShowCreate(false) }} className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">
                  <X size={16} />
                </button>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div>
                  <label className="block text-[11.5px] font-medium text-[var(--color-muted-foreground)] mb-1.5">Role Name</label>
                  <input
                    value={editForm.roleName}
                    onChange={(e) => setEditForm((f) => ({ ...f, roleName: e.target.value }))}
                    placeholder="e.g. React Developer"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[13px] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-medium text-[var(--color-muted-foreground)] mb-1.5">Subject</label>
                  <input
                    value={editForm.subject}
                    onChange={(e) => setEditForm((f) => ({ ...f, subject: e.target.value }))}
                    placeholder="Application for {{role}} | {{candidateName}}"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[13px] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-medium text-[var(--color-muted-foreground)] mb-1.5">
                    Body <span className="font-normal opacity-70">— use {'{{greeting}}'}, {'{{role}}'}, {'{{candidateName}}'}, {'{{company}}'}</span>
                  </label>
                  <textarea
                    value={editForm.body}
                    onChange={(e) => setEditForm((f) => ({ ...f, body: e.target.value }))}
                    rows={10}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[13px] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] resize-none font-mono transition-all"
                  />
                </div>
              </div>
              <div className="px-5 pb-4 flex gap-2.5">
                <button onClick={() => { setEditing(null); setShowCreate(false) }} className="flex-1 py-2.5 rounded-lg border border-[var(--color-border)] text-[13px] font-medium text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors">
                  Cancel
                </button>
                <button
                  onClick={showCreate ? handleCreate : handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-lg bg-[#2563EB] text-white text-[13px] font-semibold hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
