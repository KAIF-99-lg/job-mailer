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
      <div className="hidden sm:flex flex-1 max-w-xs">
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
          <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
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
