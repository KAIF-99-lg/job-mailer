import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Monitor, Save, Check, Loader2 } from 'lucide-react'
import { getProfile } from '../profile'

interface SettingsProps {
  theme: 'light' | 'dark' | 'system'
  onThemeChange: (t: 'light' | 'dark' | 'system') => void
}

interface UserProfile {
  name: string
  email: string
  phone: string
  linkedin: string
  github: string
  leetcode: string
  portfolio: string
  signature: string
  preferredDelay: number
}

export default function Settings({ theme, onThemeChange }: SettingsProps) {
  const [profile, setProfile] = useState<UserProfile>(() => ({ ...getProfile() }))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    localStorage.setItem('jobmailer-profile', JSON.stringify(profile))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const set = (key: keyof UserProfile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setProfile((p) => ({ ...p, [key]: e.target.value }))

  const cardClass = 'bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden mb-4'
  const headClass = 'px-5 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-muted)]/40'
  const bodyClass = 'px-5 py-5'
  const inputClass = 'w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[13px] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all'

  const initials = profile.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <div className="p-4 md:p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-[18px] font-semibold text-[var(--color-foreground)] tracking-tight">Settings</h1>
        <p className="text-[13px] text-[var(--color-muted-foreground)] mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className={cardClass}>
        <div className={headClass}>
          <span className="text-[11px] font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">Profile</span>
        </div>
        <div className={bodyClass}>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-[18px] font-bold">
              {initials}
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[var(--color-foreground)]">{profile.name || 'Your Name'}</p>
              <p className="text-[12.5px] text-[var(--color-muted-foreground)]">{profile.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11.5px] font-medium text-[var(--color-muted-foreground)] mb-1.5">Full Name</label>
              <input value={profile.name} onChange={set('name')} placeholder="Your full name" className={inputClass} />
            </div>
            <div>
              <label className="block text-[11.5px] font-medium text-[var(--color-muted-foreground)] mb-1.5">Phone</label>
              <input value={profile.phone} onChange={set('phone')} placeholder="+91 00000 00000" className={inputClass} />
            </div>
            <div>
              <label className="block text-[11.5px] font-medium text-[var(--color-muted-foreground)] mb-1.5">LinkedIn</label>
              <input value={profile.linkedin} onChange={set('linkedin')} placeholder="linkedin.com/in/yourprofile" className={inputClass} />
            </div>
            <div>
              <label className="block text-[11.5px] font-medium text-[var(--color-muted-foreground)] mb-1.5">GitHub</label>
              <input value={profile.github} onChange={set('github')} placeholder="github.com/yourusername" className={inputClass} />
            </div>
            <div>
              <label className="block text-[11.5px] font-medium text-[var(--color-muted-foreground)] mb-1.5">Portfolio</label>
              <input value={profile.portfolio} onChange={set('portfolio')} placeholder="https://yourportfolio.com" className={inputClass} />
            </div>
            <div>
              <label className="block text-[11.5px] font-medium text-[var(--color-muted-foreground)] mb-1.5">LeetCode</label>
              <input value={profile.leetcode} onChange={set('leetcode')} placeholder="leetcode.com/yourusername" className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      {/* Signature */}
      <div className={cardClass}>
        <div className={headClass}>
          <span className="text-[11px] font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">Email Signature</span>
        </div>
        <div className={bodyClass}>
          <textarea
            value={profile.signature}
            onChange={set('signature')}
            rows={5}
            placeholder="Best regards,&#10;Your Name&#10;+91 00000 00000 | your@email.com"
            className={`${inputClass} resize-none font-mono`}
          />
          <p className="text-[11px] text-[var(--color-muted-foreground)] mt-1.5">This signature will be appended to every email you send.</p>
        </div>
      </div>

      {/* Theme */}
      <div className={cardClass}>
        <div className={headClass}>
          <span className="text-[11px] font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">Appearance</span>
        </div>
        <div className={bodyClass}>
          <p className="text-[12.5px] text-[var(--color-muted-foreground)] mb-3">Choose your preferred color theme.</p>
          <div className="grid grid-cols-3 gap-3">
            {([
              { id: 'light' as const, label: 'Light', icon: Sun },
              { id: 'dark' as const, label: 'Dark', icon: Moon },
              { id: 'system' as const, label: 'System', icon: Monitor },
            ]).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onThemeChange(id)}
                className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 transition-all ${
                  theme === id
                    ? 'border-[#2563EB] bg-[var(--color-accent)]'
                    : 'border-[var(--color-border)] hover:border-[#2563EB]/40 hover:bg-[var(--color-muted)]'
                }`}
              >
                <Icon size={18} className={theme === id ? 'text-[#2563EB]' : 'text-[var(--color-muted-foreground)]'} />
                <span className={`text-[12px] font-medium ${theme === id ? 'text-[#2563EB] dark:text-[#93C5FD]' : 'text-[var(--color-foreground)]'}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Email Delay */}
      <div className={cardClass}>
        <div className={headClass}>
          <span className="text-[11px] font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">Email Delay</span>
        </div>
        <div className={bodyClass}>
          <p className="text-[12.5px] text-[var(--color-muted-foreground)] mb-3">Time between each email to avoid spam detection.</p>
          <div className="flex items-center gap-2">
            {([3000, 5000, 10000] as const).map((ms) => (
              <button
                key={ms}
                onClick={() => setProfile((p) => ({ ...p, preferredDelay: ms }))}
                className={`px-4 py-2 rounded-lg border-2 text-[12.5px] font-medium transition-all ${
                  profile.preferredDelay === ms
                    ? 'border-[#2563EB] bg-[var(--color-accent)] text-[#2563EB] dark:text-[#93C5FD]'
                    : 'border-[var(--color-border)] text-[var(--color-foreground)] hover:border-[#2563EB]/40'
                }`}
              >
                {ms / 1000}s
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={handleSave}
          disabled={saving}
          animate={saved ? { scale: [1, 0.97, 1] } : {}}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all disabled:opacity-50 ${
            saved ? 'bg-[#22C55E] text-white' : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
          }`}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </motion.button>
      </div>
    </div>
  )
}
