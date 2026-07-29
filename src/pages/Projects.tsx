import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, MoreHorizontal, Calendar, User, Tag, CheckCircle2, Circle, Clock, AlertCircle, Trash2, Edit2 } from 'lucide-react'

type Priority = 'low' | 'medium' | 'high'
type Status = 'todo' | 'inprogress' | 'review' | 'done'

interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  assignee: string
  dueDate: string
  tags: string[]
}

interface Column {
  id: Status
  label: string
  color: string
  bg: string
  tasks: Task[]
}

const priorityConfig: Record<Priority, { label: string; color: string; bg: string; icon: typeof AlertCircle }> = {
  low: { label: 'Low', color: '#22C55E', bg: '#F0FDF4', icon: Circle },
  medium: { label: 'Medium', color: '#F59E0B', bg: '#FFFBEB', icon: Clock },
  high: { label: 'High', color: '#EF4444', bg: '#FEF2F2', icon: AlertCircle },
}

const initialColumns: Column[] = [
  {
    id: 'todo', label: 'To Do', color: '#6B7280', bg: '#F3F4F6',
    tasks: [
      { id: '1', title: 'Research target companies', description: 'Find 20 companies hiring for React roles', priority: 'high', assignee: 'MK', dueDate: '2025-08-10', tags: ['Research'] },
      { id: '2', title: 'Update resume for backend roles', description: 'Highlight Node.js and MongoDB experience', priority: 'medium', assignee: 'MK', dueDate: '2025-08-05', tags: ['Resume'] },
      { id: '3', title: 'Prepare cover letter template', description: 'Generic template for SaaS companies', priority: 'low', assignee: 'MK', dueDate: '2025-08-12', tags: ['Template'] },
    ],
  },
  {
    id: 'inprogress', label: 'In Progress', color: '#2563EB', bg: '#EFF6FF',
    tasks: [
      { id: '4', title: 'Send applications to startups', description: 'Target 10 early-stage startups this week', priority: 'high', assignee: 'MK', dueDate: '2025-08-03', tags: ['Applications'] },
      { id: '5', title: 'Follow up with Google recruiter', description: 'Send follow-up email after 1 week', priority: 'medium', assignee: 'MK', dueDate: '2025-08-04', tags: ['Follow-up'] },
    ],
  },
  {
    id: 'review', label: 'In Review', color: '#7C3AED', bg: '#F5F3FF',
    tasks: [
      { id: '6', title: 'Interview prep — DSA', description: 'Complete 50 LeetCode problems', priority: 'high', assignee: 'MK', dueDate: '2025-08-08', tags: ['Interview'] },
    ],
  },
  {
    id: 'done', label: 'Done', color: '#059669', bg: '#ECFDF5',
    tasks: [
      { id: '7', title: 'Set up JobMailer AI', description: 'Configured email templates and resume', priority: 'low', assignee: 'MK', dueDate: '2025-07-28', tags: ['Setup'] },
      { id: '8', title: 'LinkedIn profile update', description: 'Updated headline and about section', priority: 'medium', assignee: 'MK', dueDate: '2025-07-25', tags: ['Profile'] },
    ],
  },
]

const tagColors = ['#2563EB', '#7C3AED', '#059669', '#DC2626', '#0891B2', '#B45309']

function TaskCard({ task, onDelete, onEdit }: { task: Task; onDelete: () => void; onEdit: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pCfg = priorityConfig[task.priority]
  const PIcon = pCfg.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -1, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
      className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-3.5 cursor-default group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-[13px] font-medium text-[var(--color-foreground)] leading-snug flex-1">{task.title}</p>
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-[var(--color-muted)] text-[var(--color-muted-foreground)] transition-all"
          >
            <MoreHorizontal size={13} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-full mt-1 w-32 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg overflow-hidden z-50"
              >
                <button
                  onClick={() => { onEdit(); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
                >
                  <Edit2 size={11} /> Edit
                </button>
                <button
                  onClick={() => { onDelete(); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  <Trash2 size={11} /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {task.description && (
        <p className="text-[11.5px] text-[var(--color-muted-foreground)] mb-2.5 leading-relaxed line-clamp-2">{task.description}</p>
      )}

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {task.tags.map((tag, i) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 rounded text-[10px] font-medium"
              style={{ backgroundColor: tagColors[i % tagColors.length] + '18', color: tagColors[i % tagColors.length] }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
            style={{ backgroundColor: pCfg.bg, color: pCfg.color }}
          >
            <PIcon size={9} /> {pCfg.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-[10.5px] text-[var(--color-muted-foreground)]">
              <Calendar size={10} />
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          )}
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <span className="text-[8px] font-bold text-white">{task.assignee.slice(0, 2)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface TaskFormData {
  title: string
  description: string
  priority: Priority
  assignee: string
  dueDate: string
  tags: string
}

function TaskModal({
  onClose,
  onSave,
  initial,
}: {
  onClose: () => void
  onSave: (data: TaskFormData) => void
  initial?: Partial<TaskFormData>
}) {
  const [form, setForm] = useState<TaskFormData>({
    title: initial?.title || '',
    description: initial?.description || '',
    priority: initial?.priority || 'medium',
    assignee: initial?.assignee || 'MK',
    dueDate: initial?.dueDate || '',
    tags: initial?.tags || '',
  })

  const set = (k: keyof TaskFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[13px] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all'

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <p className="text-[13px] font-semibold text-[var(--color-foreground)]">{initial?.title ? 'Edit Task' : 'New Task'}</p>
          <button onClick={onClose} className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"><X size={16} /></button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div>
            <label className="block text-[11.5px] font-medium text-[var(--color-muted-foreground)] mb-1.5">Title *</label>
            <input value={form.title} onChange={set('title')} placeholder="Task title" className={inputClass} />
          </div>
          <div>
            <label className="block text-[11.5px] font-medium text-[var(--color-muted-foreground)] mb-1.5">Description</label>
            <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Task description..." className={`${inputClass} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11.5px] font-medium text-[var(--color-muted-foreground)] mb-1.5">Priority</label>
              <select value={form.priority} onChange={set('priority')} className={inputClass}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-[11.5px] font-medium text-[var(--color-muted-foreground)] mb-1.5">Due Date</label>
              <input type="date" value={form.dueDate} onChange={set('dueDate')} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-[11.5px] font-medium text-[var(--color-muted-foreground)] mb-1.5">Tags <span className="font-normal opacity-70">(comma separated)</span></label>
            <input value={form.tags} onChange={set('tags')} placeholder="Research, Interview, Follow-up" className={inputClass} />
          </div>
        </div>
        <div className="px-5 pb-4 flex gap-2.5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-[var(--color-border)] text-[13px] font-medium text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors">Cancel</button>
          <button
            onClick={() => { if (form.title.trim()) onSave(form) }}
            disabled={!form.title.trim()}
            className="flex-1 py-2.5 rounded-lg bg-[#2563EB] text-white text-[13px] font-semibold hover:bg-[#1D4ED8] disabled:opacity-40 transition-colors"
          >
            {initial?.title ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [modal, setModal] = useState<{ colId: Status; task?: Task } | null>(null)
  const [dragTask, setDragTask] = useState<{ task: Task; fromCol: Status } | null>(null)
  const [dragOver, setDragOver] = useState<Status | null>(null)

  const totalTasks = columns.reduce((s, c) => s + c.tasks.length, 0)
  const doneTasks = columns.find((c) => c.id === 'done')?.tasks.length || 0

  const addOrEditTask = (colId: Status, data: TaskFormData, taskId?: string) => {
    const tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean)
    setColumns((cols) =>
      cols.map((col) => {
        if (taskId) {
          return { ...col, tasks: col.tasks.map((t) => t.id === taskId ? { ...t, ...data, tags } : t) }
        }
        if (col.id !== colId) return col
        return { ...col, tasks: [...col.tasks, { id: Date.now().toString(), ...data, tags }] }
      })
    )
    setModal(null)
  }

  const deleteTask = (colId: Status, taskId: string) => {
    setColumns((cols) => cols.map((col) => col.id !== colId ? col : { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }))
  }

  const handleDrop = (toColId: Status) => {
    if (!dragTask) return
    if (dragTask.fromCol === toColId) { setDragTask(null); setDragOver(null); return }
    setColumns((cols) =>
      cols.map((col) => {
        if (col.id === dragTask.fromCol) return { ...col, tasks: col.tasks.filter((t) => t.id !== dragTask.task.id) }
        if (col.id === toColId) return { ...col, tasks: [...col.tasks, dragTask.task] }
        return col
      })
    )
    setDragTask(null)
    setDragOver(null)
  }

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 shrink-0">
        <div>
          <h1 className="text-[18px] font-semibold text-[var(--color-foreground)] tracking-tight">Projects</h1>
          <p className="text-[13px] text-[var(--color-muted-foreground)] mt-0.5">
            Track your job search tasks — {doneTasks}/{totalTasks} completed
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress bar */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-32 h-1.5 rounded-full bg-[var(--color-muted)] overflow-hidden">
              <motion.div
                animate={{ width: totalTasks ? `${(doneTasks / totalTasks) * 100}%` : '0%' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full bg-[#22C55E]"
              />
            </div>
            <span className="text-[11.5px] font-medium text-[var(--color-muted-foreground)]">
              {totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0}%
            </span>
          </div>
          <button
            onClick={() => setModal({ colId: 'todo' })}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2563EB] text-white text-[12.5px] font-medium hover:bg-[#1D4ED8] transition-colors"
          >
            <Plus size={13} /> Add Task
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-5 shrink-0">
        {columns.map((col) => (
          <div key={col.id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: col.color + '40' }}>
              <div className="w-2 rounded-full transition-all duration-500" style={{ backgroundColor: col.color, height: `${totalTasks ? (col.tasks.length / totalTasks) * 100 : 0}%`, minHeight: col.tasks.length > 0 ? '4px' : '0' }} />
            </div>
            <div>
              <p className="text-[18px] font-semibold text-[var(--color-foreground)]">{col.tasks.length}</p>
              <p className="text-[11px] text-[var(--color-muted-foreground)]">{col.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 flex-1 overflow-x-auto pb-2">
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex flex-col shrink-0 w-72"
            onDragOver={(e) => { e.preventDefault(); setDragOver(col.id) }}
            onDrop={() => handleDrop(col.id)}
            onDragLeave={() => setDragOver(null)}
          >
            {/* Column header */}
            <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl mb-3 border transition-colors ${dragOver === col.id ? 'border-dashed border-2' : 'border-transparent'}`}
              style={{ backgroundColor: col.bg, borderColor: dragOver === col.id ? col.color : undefined }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                <span className="text-[12px] font-semibold" style={{ color: col.color }}>{col.label}</span>
                <span className="text-[10.5px] font-medium px-1.5 py-0.5 rounded-full bg-white/60 dark:bg-black/20" style={{ color: col.color }}>
                  {col.tasks.length}
                </span>
              </div>
              <button
                onClick={() => setModal({ colId: col.id })}
                className="p-1 rounded-md hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
                style={{ color: col.color }}
              >
                <Plus size={13} />
              </button>
            </div>

            {/* Tasks */}
            <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto">
              <AnimatePresence>
                {col.tasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => setDragTask({ task, fromCol: col.id })}
                    onDragEnd={() => { setDragTask(null); setDragOver(null) }}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <TaskCard
                      task={task}
                      onDelete={() => deleteTask(col.id, task.id)}
                      onEdit={() => setModal({ colId: col.id, task })}
                    />
                  </div>
                ))}
              </AnimatePresence>

              {/* Drop zone hint */}
              {dragOver === col.id && dragTask?.fromCol !== col.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-2 border-dashed rounded-xl h-16 flex items-center justify-center"
                  style={{ borderColor: col.color + '60' }}
                >
                  <span className="text-[11.5px] font-medium" style={{ color: col.color }}>Drop here</span>
                </motion.div>
              )}

              {col.tasks.length === 0 && dragOver !== col.id && (
                <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl h-20 flex flex-col items-center justify-center gap-1">
                  <CheckCircle2 size={16} className="text-[var(--color-muted-foreground)] opacity-40" />
                  <span className="text-[11px] text-[var(--color-muted-foreground)] opacity-60">No tasks</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <TaskModal
            onClose={() => setModal(null)}
            initial={modal.task ? {
              title: modal.task.title,
              description: modal.task.description,
              priority: modal.task.priority,
              assignee: modal.task.assignee,
              dueDate: modal.task.dueDate,
              tags: modal.task.tags.join(', '),
            } : undefined}
            onSave={(data) => addOrEditTask(modal.colId, data, modal.task?.id)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
