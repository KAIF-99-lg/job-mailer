import { useState, useRef, useCallback, useEffect } from 'react'
import API_URL from '../api'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  Paperclip,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  Eye,
  X,
  Loader2,
} from 'lucide-react'

function parseEmails(raw: string) {
  return raw.split('\n').map((e) => e.trim()).filter(Boolean)
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function EmailTag({ email, emails }: { email: string; emails: string[] }) {
  const valid = validateEmail(email)
  const isDuplicate = emails.filter((e) => e === email).length > 1
  if (!valid) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-red-50 dark:bg-red-900/20 text-[#EF4444] border border-red-100 dark:border-red-900/30">
      <XCircle size={10} /> {email}
    </span>
  )
  if (isDuplicate) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 dark:bg-amber-900/20 text-[#F59E0B] border border-amber-100 dark:border-amber-900/30">
      <AlertCircle size={10} /> {email}
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-green-50 dark:bg-green-900/20 text-[#22C55E] border border-green-100 dark:border-green-900/30">
      <CheckCircle2 size={10} /> {email}
    </span>
  )
}

export default function SendApplication() {
  const [jobRoles, setJobRoles] = useState<string[]>([])
  const [templates, setTemplates] = useState<{ roleName: string; subject: string; body: string }[]>([])
  const [role, setRole] = useState('')
  const [roleOpen, setRoleOpen] = useState(false)
  const [emailsRaw, setEmailsRaw] = useState('')
  const [company, setCompany] = useState('')
  const [hrName, setHrName] = useState('')
  const [fileName] = useState('KAIF_RESUME.pdf')
  const [dragging, setDragging] = useState(false)
  const [subject, setSubject] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [bodyText, setBodyText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [resumeLoading, setResumeLoading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [sendError, setSendError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const emails = parseEmails(emailsRaw)
  const validEmails = emails.filter(validateEmail)
  const maxEmails = 5

  // Fetch templates
  useEffect(() => {
    fetch(`${API_URL}/templates`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const tmps = data.data.templates
          setTemplates(tmps)
          const roles = tmps.map((t: { roleName: string }) => t.roleName)
          setJobRoles(roles)
          if (tmps.length > 0) {
            setRole(tmps[0].roleName)
            setSubject(tmps[0].subject || `Application for ${tmps[0].roleName}`)
            setBodyText(tmps[0].body || '')
          }
        }
      })
      .catch(() => {})
  }, [])

  // Update subject + body when role changes
  useEffect(() => {
    if (!role || templates.length === 0) return
    const tmpl = templates.find((t) => t.roleName === role)
    if (tmpl) {
      setSubject(tmpl.subject || `Application for ${role}`)
      setBodyText(tmpl.body || '')
    }
  }, [role, templates])

  // Upload resume to backend
  const uploadResumeFile = useCallback(async (file: File) => {
    setUploading(true)
    setUploadError('')
    const formData = new FormData()
    formData.append('resume', file)
    try {
      const res = await fetch('/api/resume/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setUploadError(data.message || 'Upload failed.')
        setFileName('')
      } else {
        setFileName(data.data.resume.originalName)
      }
    } catch {
      setUploadError('Network error during upload.')
    } finally {
      setUploading(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadResumeFile(file)
  }, [uploadResumeFile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadResumeFile(file)
  }

  // Send mail via real API
  const handleSend = async () => {
    setShowConfirm(false)
    setSending(true)
    setSent(0)
    setSendError('')
    try {
      const res = await fetch(`${API_URL}/mail/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          role,
          hrEmails: validEmails,
          companyName: company,
          hrName,
          subject,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setSendError(data.message || 'Failed to send emails. Please try again.')
        setSending(false)
        return
      }
      setSent(data.data.successCount)
      setSending(false)
      setShowSuccess(true)
    } catch {
      setSendError('Network error. Please check your connection.')
      setSending(false)
    }
  }

  const sectionClass = 'bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl'
  const sectionHead = 'px-5 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-muted)]/40'
  const sectionBody = 'px-5 py-4'

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}>
              <CheckCircle2 size={44} className="text-[#22C55E]" strokeWidth={1.5} />
            </motion.div>
          </div>
          <h2 className="text-[22px] font-semibold text-[var(--color-foreground)] tracking-tight">Emails Sent Successfully</h2>
          <p className="text-[14px] text-[var(--color-muted-foreground)] mt-1.5">
            {sent} of {validEmails.length} delivered to recipients
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => { setShowSuccess(false); setSent(0); setEmailsRaw('') }}
              className="px-5 py-2.5 rounded-lg border border-[var(--color-border)] text-[13px] font-medium text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
            >
              Send Another
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl space-y-4">
      <div className="mb-2">
        <h1 className="text-[18px] font-semibold text-[var(--color-foreground)] tracking-tight">Send Application</h1>
        <p className="text-[13px] text-[var(--color-muted-foreground)] mt-0.5">Compose and send professional job applications</p>
      </div>

      {/* Section 1: Job Role */}
      <div className={sectionClass}>
        <div className={sectionHead}>
          <span className="text-[11px] font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">Job Role</span>
        </div>
        <div className={sectionBody}>
          <div className="relative">
            <button
              onClick={() => setRoleOpen(!roleOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[13px] text-[var(--color-foreground)] hover:border-[#2563EB]/50 transition-colors"
            >
              <span className="font-medium">{role || 'Select a role...'}</span>
              <ChevronDown size={14} className={`text-[var(--color-muted-foreground)] transition-transform ${roleOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {roleOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg overflow-hidden z-50"
                >
                  {jobRoles.length === 0 ? (
                    <div className="px-3.5 py-3 text-[13px] text-[var(--color-muted-foreground)] flex items-center gap-2">
                      <Loader2 size={13} className="animate-spin" /> Loading roles...
                    </div>
                  ) : (
                    jobRoles.map((r) => (
                      <button
                        key={r}
                        onClick={() => { setRole(r); setRoleOpen(false) }}
                        className={`w-full text-left px-3.5 py-2.5 text-[13px] transition-colors ${
                          role === r
                            ? 'bg-[var(--color-accent)] text-[#2563EB] dark:text-[#93C5FD] font-medium'
                            : 'text-[var(--color-foreground)] hover:bg-[var(--color-muted)]'
                        }`}
                      >
                        {r}
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Section 2: Emails */}
      <div className={sectionClass}>
        <div className={sectionHead}>
          <span className="text-[11px] font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">HR Emails</span>
        </div>
        <div className={sectionBody}>
          <textarea
            value={emailsRaw}
            onChange={(e) => {
              if (e.target.value.split('\n').filter(Boolean).length <= maxEmails) setEmailsRaw(e.target.value)
            }}
            rows={4}
            placeholder={'hr@company.com\ncareers@company.com'}
            className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[13px] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] resize-none font-mono transition-all"
          />
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {emails.map((e, i) => <EmailTag key={i} email={e} emails={emails} />)}
            </div>
            <span className={`text-[11px] font-medium shrink-0 ml-2 ${emails.length >= maxEmails ? 'text-[#EF4444]' : 'text-[var(--color-muted-foreground)]'}`}>
              {emails.length} / {maxEmails} Emails
            </span>
          </div>
        </div>
      </div>

      {/* Section 3+4: Company + HR Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={sectionClass}>
          <div className={sectionHead}>
            <span className="text-[11px] font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">Company Name <span className="normal-case font-normal">(optional)</span></span>
          </div>
          <div className={sectionBody}>
            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[13px] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all" />
          </div>
        </div>
        <div className={sectionClass}>
          <div className={sectionHead}>
            <span className="text-[11px] font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">HR Name <span className="normal-case font-normal">(optional)</span></span>
          </div>
          <div className={sectionBody}>
            <input type="text" value={hrName} onChange={(e) => setHrName(e.target.value)} placeholder="HR person's name"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[13px] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all" />
            <p className="text-[11px] text-[var(--color-muted-foreground)] mt-1.5">Leave blank to auto-detect greeting.</p>
          </div>
        </div>
      </div>

      {/* Section 5: Resume */}
      <div className={sectionClass}>
        <div className={sectionHead}>
          <span className="text-[11px] font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">Resume</span>
        </div>
        <div className={sectionBody}>
          <div className="border-2 border-dashed border-[#22C55E]/40 bg-green-50/30 dark:bg-green-900/5 rounded-xl p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
              <CheckCircle2 size={16} className="text-[#22C55E]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[var(--color-foreground)] truncate">KAIF_RESUME.pdf</p>
              <p className="text-[11px] text-[var(--color-muted-foreground)] mt-0.5">✓ Resume ready to send</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Subject */}
      <div className={sectionClass}>
        <div className={sectionHead}>
          <span className="text-[11px] font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">Email Subject</span>
        </div>
        <div className={sectionBody}>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[13px] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all" />
        </div>
      </div>

      {/* Section 7: Preview */}
      <div className={sectionClass}>
        <div className={`${sectionHead} flex items-center justify-between`}>
          <span className="text-[11px] font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">Email Preview</span>
          <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-1.5 text-[11px] text-[#2563EB] dark:text-[#93C5FD] font-medium hover:underline">
            <Eye size={12} /> {showPreview ? 'Collapse' : 'Expand'}
          </button>
        </div>
        <AnimatePresence>
          {showPreview && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
              <div className="m-4 rounded-xl border border-[var(--color-border)] overflow-hidden">
                <div className="px-5 py-3.5 bg-[var(--color-muted)]/60 border-b border-[var(--color-border)]">
                  <h3 className="text-[15px] font-medium text-[var(--color-foreground)]">{subject || 'No subject'}</h3>
                </div>
                <div className="px-5 py-4 space-y-2 bg-[var(--color-card)]">
                  <div className="text-[11px] text-[var(--color-muted-foreground)]">
                    To: <span className="text-[var(--color-foreground)]">{validEmails.join(', ') || 'No valid emails'}</span>
                  </div>
                  <div className="pt-2 border-t border-[var(--color-border)]">
                    <pre className="text-[12.5px] text-[var(--color-foreground)] whitespace-pre-wrap font-sans leading-relaxed">
                      {bodyText || 'Template body will appear here after role is selected.'}
                    </pre>
                  </div>
                  {fileName && (
                    <div className="pt-2 border-t border-[var(--color-border)]">
                      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-muted)] border border-[var(--color-border)]">
                        <Paperclip size={13} className="text-[#2563EB]" />
                        <span className="text-[12px] font-medium text-[var(--color-foreground)]">{fileName}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!showPreview && (
          <div className={sectionBody}>
            <button onClick={() => setShowPreview(true)} className="w-full text-center text-[12px] text-[var(--color-muted-foreground)] hover:text-[#2563EB] transition-colors py-2">
              Click to preview your email
            </button>
          </div>
        )}
      </div>

      {/* Section 8: Send */}
      <div className={sectionClass}>
        <div className={sectionBody}>
          {sendError && (
            <div className="mb-3 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-[12.5px] text-[#EF4444] font-medium">
              {sendError}
            </div>
          )}
          {!sending ? (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={validEmails.length === 0 || !role}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2563EB] text-white text-[14px] font-semibold hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
            >
              <Send size={15} /> Send Applications
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-medium text-[var(--color-foreground)]">Sending {validEmails.length} email{validEmails.length > 1 ? 's' : ''}...</span>
                <Loader2 size={14} className="animate-spin text-[#2563EB]" />
              </div>
              <div className="h-2 rounded-full bg-[var(--color-muted)] overflow-hidden">
                <motion.div animate={{ width: '100%' }} transition={{ duration: validEmails.length * 5, ease: 'linear' }} className="h-2 rounded-full bg-[#2563EB]" />
              </div>
              <p className="text-[11.5px] text-[var(--color-muted-foreground)]">Please wait — emails are being sent with delay to avoid spam filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-[15px] font-semibold text-[var(--color-foreground)]">Confirm Send</h3>
                <button onClick={() => setShowConfirm(false)} className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"><X size={15} /></button>
              </div>
              <p className="text-[13px] text-[var(--color-muted-foreground)] mt-1 leading-relaxed">
                You are about to send <strong className="text-[var(--color-foreground)]">{validEmails.length} email{validEmails.length > 1 ? 's' : ''}</strong> for the <strong className="text-[var(--color-foreground)]">{role}</strong> position. This action cannot be undone.
              </p>
              <div className="flex gap-2.5 mt-5">
                <button onClick={() => setShowConfirm(false)} className="flex-1 py-2.5 rounded-lg border border-[var(--color-border)] text-[13px] font-medium text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors">
                  Cancel
                </button>
                <button onClick={handleSend} className="flex-1 py-2.5 rounded-lg bg-[#2563EB] text-white text-[13px] font-semibold hover:bg-[#1D4ED8] transition-colors">
                  Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
