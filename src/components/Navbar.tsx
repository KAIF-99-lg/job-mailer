import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, Sun, Moon, Monitor, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

interface NavbarProps {
  theme: 'light' | 'dark' | 'system'
  onThemeChange: (t: 'light' | 'dark' | 'system') => void
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export default function Navbar({ theme, onThemeChange, sidebarCollapsed, onToggleSidebar }: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showTheme, setShowTheme] = useState(false)

  const notifications: { id: number; title: string; time: string; unread: boolean }[] = []

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  return (
    <header className="h-14 flex items-center gap-3 px-4 border-b border-[var(--color-border)] bg-[var(--color-card)] shrink-0">
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="p-1.5 rounded-md text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
        aria-label="Toggle sidebar"
      >
        {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xs">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
          <input
            type="text"
            placeholder="Search applications..."
            className="w-full h-8 pl-8 pr-3 text-[13px] bg-[var(--color-muted)] border border-[var(--color-border)] rounded-md text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Google badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-blue-400 via-red-400 to-yellow-400 flex items-center justify-center">
            <span className="text-[6px] font-bold text-white">G</span>
          </div>
          <span className="text-[11px] font-medium text-[var(--color-muted-foreground)]">Connected</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
        </div>

        {/* Theme toggle */}
        <div className="relative">
          <button
            onClick={() => { setShowTheme(!showTheme); setShowNotifications(false) }}
            className="p-1.5 rounded-md text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
            aria-label="Toggle theme"
          >
            <ThemeIcon size={15} />
          </button>
          <AnimatePresence>
            {showTheme && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1.5 w-32 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg overflow-hidden z-50"
              >
                {(['light', 'dark', 'system'] as const).map((t) => {
                  const Icon = t === 'dark' ? Moon : t === 'light' ? Sun : Monitor
                  return (
                    <button
                      key={t}
                      onClick={() => { onThemeChange(t); setShowTheme(false) }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[12px] capitalize transition-colors ${
                        theme === t
                          ? 'bg-[var(--color-accent)] text-[#2563EB] dark:text-[#93C5FD] font-medium'
                          : 'text-[var(--color-foreground)] hover:bg-[var(--color-muted)]'
                      }`}
                    >
                      <Icon size={13} /> {t}
                    </button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowTheme(false) }}
            className="relative p-1.5 rounded-md text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
            aria-label="Notifications"
          >
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          </button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1.5 w-72 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg overflow-hidden z-50"
              >
                <div className="px-3 py-2.5 border-b border-[var(--color-border)]">
                  <p className="text-[12px] font-semibold text-[var(--color-foreground)]">Notifications</p>
                </div>
                {notifications.map((n) => (
                  <div key={n.id} className={`px-3 py-2.5 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)] transition-colors cursor-pointer flex gap-2.5 items-start ${n.unread ? '' : 'opacity-60'}`}>
                    {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />}
                    {!n.unread && <div className="w-1.5 h-1.5 mt-1.5 shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-[12px] text-[var(--color-foreground)] font-medium leading-snug">{n.title}</p>
                      <p className="text-[11px] text-[var(--color-muted-foreground)] mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center cursor-pointer ml-0.5" title="Md Kaif">
          <span className="text-[11px] font-semibold text-white">MK</span>
        </div>
      </div>
    </header>
  )
}
